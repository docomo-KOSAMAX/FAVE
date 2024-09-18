import psycopg2
import psycopg2.extras
import time
import datetime
import logging
import sys
import os
import json
import random
PERSONALIZED_POST_LIMIT = 30  # ユーザーベクトルと類似する上位X件のポストを取得
RANDOM_RATE = 20  # ランダム(ユーザーベクトルに関係ない無作為抽出)な投稿を混ぜる割合

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def connect_db():
    conn = psycopg2.connect("host=***.rds.amazonaws.com port=*** dbname=*** user=*** password=***")
    logger.info("SUCCESS: Connection to RDS Aurora instance succeeded")
    return conn

def create_post(post_record, cur):
    """favePostのJSONオブジェクトを作る"""
    post_obj = {}
    id, message, user_id, fave_id, date_time, vector = post_record
    cur.execute(f"SELECT user_name FROM users WHERE id={user_id}")
    post_by = cur.fetchone()[0]
    cur.execute(f"SELECT reaction_type, COUNT(reaction_type) FROM post_reactions WHERE post_id={id} GROUP BY reaction_type")
    reactions = cur.fetchall()
    post_obj["id"] = id
    post_obj["message"] = message
    post_obj["fave_id"] = fave_id
    post_obj["date_time"] = str(date_time)
    post_obj["post_by"] = post_by
    post_obj["reactions"] = {"like": 0, "watch": 0, "love": 0, "new_listener": 0}
    if reactions:
        for reaction in reactions:
            reaction_name, reaction_count = reaction
            post_obj["reactions"][reaction_name] = reaction_count
    return post_obj

def get_personalized_posts(user_id, cur):
    """ユーザーベクトルとユーグリッド距離が近い上位{PERSONALIZED_POST_LIMIT}件の投稿をdbから取得"""
    cur.execute(f"SELECT vector FROM users WHERE id={user_id}")
    user_vector = cur.fetchone()[0]
    cur.execute(f"SELECT * FROM fave_posts WHERE user_id != {user_id} ORDER BY vector <-> (ARRAY{user_vector}::VECTOR(1024)) LIMIT {PERSONALIZED_POST_LIMIT}")
    posts = cur.fetchall()
    return [create_post(post_record, cur) for post_record in posts]

def get_random_posts():
    """無作為に抽出した投稿を取得"""
    # TODO: dbからランダム抽出
    # TODO: get_personalized_postsで抽出したポストを除く
    ...

def rank_posts(posts):
    """ポストを並び替える"""
    # NOTE: ランダムに並べ替え
    random.seed(int(datetime.datetime.now().strftime("%s")))
    random.shuffle(posts)
    return posts


def lambda_handler(event, context):
    target_user = str(event["pathParameters"]["userName"])
    print("target user: ", target_user)
    conn = connect_db()
    cur = conn.cursor()
    cur.execute(f"SELECT id FROM users WHERE user_name='{target_user}'")
    user_id = cur.fetchone()
    if not user_id:
        return {
            'statusCode': 404,
            'body': json.dumps({"message": "No such user was found."}),
            'headers': {
                "Access-Control-Allow-Origin": "*"
                }
            }
    else:
        posts = get_personalized_posts(user_id[0], cur)
        posts = rank_posts(posts)
        return {
            'statusCode': 200,
            'body': json.dumps(posts),
            'headers': {
                "Access-Control-Allow-Origin": "*"
                }
            }