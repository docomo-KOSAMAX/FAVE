import psycopg2
import psycopg2.extras
import time
import datetime
import logging
import sys
import os
import json

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def connect_db():
    conn = psycopg2.connect("host=***.rds.amazonaws.com port=*** dbname=*** user=*** password=***")
    logger.info("SUCCESS: Connection to RDS Aurora instance succeeded")
    return conn

def lambda_handler(event, context):
    conn = connect_db()
    cur = conn.cursor()
    print("Login attempt user: ", event["pathParameters"]["userName"])
    cur.execute(f"SELECT id FROM users WHERE user_name='{event["pathParameters"]["userName"]}'")
    result = cur.fetchone()
    
    if not result:
        cur.execute(f"INSERT INTO users (user_name, vector) VALUES ('{event["pathParameters"]["userName"]}', (SELECT ARRAY(SELECT 0 FROM GENERATE_SERIES(1, 1024))::VECTOR(1024)))")
        conn.commit()
        response = {
            'statusCode': 201,
            'headers': {
                "Access-Control-Allow-Origin": "*"
            },
            'body': json.dumps({"user_id": f"No such user was found. {event["pathParameters"]["userName"]} is added."})
        }
    else:
        response = {
            'statusCode': 200,
            'headers': {
            "Access-Control-Allow-Origin": "*"
            },
            'body': json.dumps({"user_id": result[0]})
        }
    cur.close()
    conn.close()
    return response