import psycopg2
import psycopg2.extras
import time
import datetime
import logging
import sys
import os
import json
import datetime
import urllib.parse

def lambda_handler(event, context):
    # TODO implement
    conn = db_connect()
    cursor = conn.cursor()
    
    cursor.execute(f"SELECT id FROM users WHERE user_name='{event["pathParameters"]["userName"]}'")
    
    userId = cursor.fetchone()

    if userId:
    
        body = event['body']
        param = json.loads(body)
        message = param["message"]
        faveId = param["fave_id"]
    
        dt_now = datetime.datetime.now()
        
        insertSql = "INSERT INTO fave_posts (message, user_id, fave_id, post_date_time, vector) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(insertSql, (message, userId, faveId, dt_now, [0] * 1024))
        
        conn.commit()
    
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'body' : json.dumps(param),
            'headers': {
                "Access-Control-Allow-Origin": "*"
            }
        }
    else:
        return {
            'statusCode': 202,
            'body': json.dumps("No such user was found."),
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