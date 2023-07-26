import psycopg2
from psycopg2.extras import RealDictCursor
import json
from datetime import datetime

host = "sportsmatch.cluster-creyuppchxcc.us-east-1.rds.amazonaws.com"
username = "postgres"
password = "ij]71&cnljl4Nl|w9Mc&e?QHx|B0"
database = "SportsMatch"


def lambda_handler(event, context):
    filters = event['queryStringParameters']
    
    sql = """
          SELECT * FROM events 
          """

    param_set = ()
    if filters['sportId'] != None:
        sportId = filters['sportId'].strip()
        sql +=  "WHERE sport_id = " + sportId
    
    result = read(sql, param_set)
    
    for item in result:
        for key, value in item.items():
            if isinstance(value, datetime):
                item[key] = value.strftime('%Y-%m-%d %H:%M:%S')
    
    return {
        'statusCode': 200,
        'body': json.dumps(result)
    }
    
    
def read(sql, params):
    conn = psycopg2.connect(host=host, user=username, password=password, database=database)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute(sql)
    res = cur.fetchall()
    conn.commit() # <- We MUST commit to reflect the inserted data
    cur.close()
    conn.close()
    return res
    