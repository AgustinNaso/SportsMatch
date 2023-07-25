import psycopg2
from psycopg2.extras import RealDictCursor
import json

host = "sportsmatch.cluster-creyuppchxcc.us-east-1.rds.amazonaws.com"
username = "postgres"
password = "]W-ru-mY$ox]OKNFbM#DbD0YeEsX"
database = "SportsMatch"


def lambda_handler(event, context):
    sql = """
        SELECT * from accounts
    """
    
    return {
        'statusCode': 200,
        'result': read(sql)
    }
    
    
def read(sql):
    conn = psycopg2.connect(host=host, user=username, password=password, database=database)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute(sql)
    res = cur.fetchall()
    conn.commit() # <- We MUST commit to reflect the inserted data
    cur.close()
    conn.close()
    return res
    