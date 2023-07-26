import psycopg2
from psycopg2.extras import RealDictCursor
import json

host = "sportsmatch.cluster-creyuppchxcc.us-east-1.rds.amazonaws.com"
username = "postgres"
password = "ij]71&cnljl4Nl|w9Mc&e?QHx|B0"
database = "SportsMatch"


def lambda_handler(event, context):
    body = event["body"]

    sql = """
          INSERT INTO users(firstname, lastname, telephone, email)
          VALUES(%s, %s, %s, %s)
          """
    
    param_set = (
        body["firstname"],
        body["lastname"],
        body["telephone"],
        body["email"]
    )
    
    insert(sql, param_set)
    return {
        'statusCode': 201
    }
    
    
def insert(sql, params):
    conn = psycopg2.connect(host=host, user=username, password=password, database=database)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute(sql, params)
    
    conn.commit() # <- We MUST commit to reflect the inserted data
    cur.close()
    conn.close()
    