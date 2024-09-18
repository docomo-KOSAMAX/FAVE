import os
import json
import psycopg2
import boto3

from psycopg2.extras import DictCursor

# ssm = boto3.client('ssm')


def lambda_handler(event, context):
    # TODO implement
    conn = db_connect()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM Faves")
    
    query_result = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    result = [{"id": item[0], "fave_name": item[1], "image": item[2]} for item in query_result]

    
    return {
        'statusCode': 200,
        'body': json.dumps(result),
        'headers': {
            "Access-Control-Allow-Origin": "*"
        }
    }

def db_connect():

    # DB_HOST = ssm.get_parameter(
    #     Name = 'db.host',
    #     WithDecryption = False
    # )['Parameter']['Value']
    # DB_DBNAME = ssm.get_parameter(
    #     Name = 'db.dbname',
    #     WithDecryption = False
    # )['Parameter']['Value']
    # DB_PORT = ssm.get_parameter(
    #     Name = 'db.port',
    #     WithDecryption = False
    # )['Parameter']['Value']
    # DB_USER = ssm.get_parameter(
    #     Name = 'db.user',
    #     WithDecryption = False
    # )['Parameter']['Value']
    # DB_PASSWORD = ssm.get_parameter(
    #     Name = 'db.password',
    #     WithDecryption = True
    # )['Parameter']['Value']

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