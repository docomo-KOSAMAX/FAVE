import psycopg2
import psycopg2.extras
import time
import datetime
import logging
import sys
import os
import json

def lambda_handler(event, context):
    # TODO implement
    conn = db_connect()
    cursor = conn.cursor()
    
    cursor.execute(f"SELECT id FROM users WHERE user_name='{event["pathParameters"]["userName"]}'")
    
    userId = cursor.fetchone()

    if userId:
        userId = int(userId[0])
        cursor.execute(f"SELECT * FROM fave_posts WHERE user_id='{userId}' ORDER BY post_date_time DESC")
        query_result = cursor.fetchall()
        
        result = []
        for item in query_result:
            print(item)
            cursor.execute(f"SELECT reaction_type, COUNT(reaction_type) FROM post_reactions WHERE post_id={item[0]} GROUP BY reaction_type")
            reactions = cursor.fetchall()
            
            reactionList = {"like": 0, "watch": 0, "love": 0, "new_listener": 0}

            for reaction in reactions:
                reaction_name, reaction_count = reaction
                reactionList[reaction_name] = reaction_count
            result.append({"id": item[0], "message": item[1], "post_by": event["pathParameters"]["userName"], "fave_id" : item[3], "date_time": str(item[4]), "reactions": reactionList})
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'body': json.dumps(result),
            'headers': {
                "Access-Control-Allow-Origin": "*"
            }
        }
    else:
        return {
            'statusCode': 200,
            'body': json.dumps([]),
            'headers': {
                "Access-Control-Allow-Origin": "*"
            }
        }

def db_connect():

    DB_HOST="***.rds.amazonaws.com"
    DB_PORT="***"
    DB_NAME="***"
    DB_USER="***"
    DB_PASSWORD="***"

    conn = psycopg2.connect(
        host=DB_HOST,
        dbname=DB_NAME,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD
    )
    return conn