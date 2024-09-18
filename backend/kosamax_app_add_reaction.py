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
    
    postId = event["pathParameters"]["postId"]
    
    reactionType = event["pathParameters"]["reactionType"]
    
    cursor.execute(f"SELECT id FROM fave_posts WHERE id='{postId}'")
    existPost = cursor.fetchone()
    
    if userId and existPost:
        insertSql = "INSERT INTO post_reactions (post_id, reaction_type, user_id) VALUES (%s, %s, %s)"
        cursor.execute(insertSql, (postId, reactionType, userId))
        
        conn.commit()
    
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                "Access-Control-Allow-Origin": "*"
            }
        }
    else:        
        return {
            'statusCode': 202,
            'body': json.dumps("No such user or post was found."),
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