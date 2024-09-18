import json
import boto3
import logging
import psycopg2
import psycopg2.extras

# Bedrock Runtimeクライアントを作成
bedrock_runtime = boto3.client(service_name="bedrock-runtime", region_name="ap-northeast-1")
dimensions = 1024
modelId = "cohere.embed-multilingual-v3"


logger = logging.getLogger()
logger.setLevel(logging.INFO)


def connect_db():
    conn = psycopg2.connect(
        "host=***.rds.amazonaws.com port=*** dbname=*** user=*** password=***"
    )
    logger.info("SUCCESS: Connection to RDS Aurora instance succeeded")
    return conn


def lambda_handler(event, context):
    global bedrock_runtime, dimensions, modelId
    conn = connect_db()
    cur = conn.cursor()

    cur.execute(
        f"SELECT id, message FROM fave_posts WHERE vector = (SELECT ARRAY(SELECT 0::float8 FROM GENERATE_SERIES(1, 1024))::VECTOR(1024));"
    )
    result = cur.fetchall()
    if result:
        body = json.dumps({"texts": [r[1] for r in result], "input_type": "search_document"})
        response = bedrock_runtime.invoke_model(
            body=body,
            modelId=modelId,
            accept="*/*",
            contentType="application/json",
        )
        response_body = json.loads(response.get("body").read())
        embeddings = response_body.get("embeddings")
        for r, embedding in zip(result, embeddings):
            id, message = r
            #print(f"{id=}, len={len(embedding)}")
            #print("--------------------")
            #print(str(embedding))
            cur.execute(f"UPDATE fave_posts SET vector = ARRAY{str(embedding)}::VECTOR(1024) WHERE id = {id}")
        conn.commit()
    # Update user vector
    cur.execute(f"SELECT id FROM users")
    user_ids = cur.fetchall()
    for user_id in user_ids:
        user_id = user_id[0]
        # 最後にuserが投稿したメッセージ取得
        cur.execute(f"SELECT vector FROM fave_posts WHERE user_id={user_id} ORDER BY post_date_time DESC")
        latest_post_vector = cur.fetchone()
        if latest_post_vector:
            latest_post_vector = latest_post_vector[0]
            cur.execute(f"UPDATE users SET vector = ARRAY{str(latest_post_vector)}::VECTOR(1024) WHERE id = {user_id}")
    conn.commit()

    return {"statusCode": 200, "body": json.dumps({"update_post_id": [r[0] for r in result]})}