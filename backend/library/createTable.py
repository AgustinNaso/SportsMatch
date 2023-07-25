import psycopg2
from psycopg2.extras import RealDictCursor
import json

host = "sportsmatch.cluster-creyuppchxcc.us-east-1.rds.amazonaws.com"
username = "postgres"
password = "]W-ru-mY$ox]OKNFbM#DbD0YeEsX"
database = "SportsMatch"


def lambda_handler(event, context):
    # select code from schemas
    sql = """
    
    """
    
    insert(sql)
    return {
        'statusCode': 201
    }
    
    
def insert(sql):
    conn = psycopg2.connect(host=host, user=username, password=password, database=database)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute(sql)
    
    conn.commit() # <- We MUST commit to reflect the inserted data
    cur.close()
    conn.close()
    