import psycopg2
from psycopg2.extras import RealDictCursor
import json

host = "sportsmatch.cluster-creyuppchxcc.us-east-1.rds.amazonaws.com"
username = "postgres"
password = "ij]71&cnljl4Nl|w9Mc&e?QHx|B0"
database = "SportsMatch"


def lambda_handler(event, context):
    sql = """
    INSERT INTO sports (name) VALUES
    ('football'),
    ('basket'),
    ('tennis'),
    ('paddle');

    """
    
    insert(sql, [])
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
    return {
        
    }
    