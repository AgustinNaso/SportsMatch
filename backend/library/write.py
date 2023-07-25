import psycopg2
from psycopg2.extras import RealDictCursor
import json

host = "sportsmatch.cluster-creyuppchxcc.us-east-1.rds.amazonaws.com"
username = "postgres"
password = "]W-ru-mY$ox]OKNFbM#DbD0YeEsX"
database = "SportsMatch"


def lambda_handler(event, context):
    sql = """
    INSERT INTO accounts (user_id, username, password, email)
    VALUES (33, 'john_doe535', 'password1323', 'johndoe1323@example.com');
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
    