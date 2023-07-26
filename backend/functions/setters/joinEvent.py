import psycopg2
from psycopg2.extras import RealDictCursor
import json

host = "sportsmatch.cluster-creyuppchxcc.us-east-1.rds.amazonaws.com"
username = "postgres"
password = "ij]71&cnljl4Nl|w9Mc&e?QHx|B0"
database = "SportsMatch"

def lambda_handler(event, context):
    try:
        body = event["body"]
        # Assuming the body is already a JSON-formatted string, no need for json.loads
        body_dict = json.loads(body) if isinstance(body, str) else body

        event_id = body_dict.get("eventId")
        user_id = body_dict.get("userId")

        if None in (event_id, user_id):
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Bad request. Missing eventId or userId'})
            }

        sql = """
              INSERT INTO participants(event_id, user_id, status)
              VALUES(%s, %s, %s)
              """

        param_set = (
            event_id,
            user_id,
            False
        )

        try:
            insert(sql, param_set)
            return {
                'statusCode': 201,
                'body': json.dumps({'message': 'Participant added successfully'})
            }
        except psycopg2.Error as e:
            # Handle database-related errors
            return {
                'statusCode': 500,
                'body': json.dumps({'error': 'Internal server error'})
            }

    except json.JSONDecodeError:
        # Handle JSON decoding error (invalid JSON)
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Bad request. Invalid JSON format'})
        }
    except KeyError as e:
        # Handle missing keys in the JSON body
        return {
            'statusCode': 400,
            'body': json.dumps({'error': f'Bad request. Missing key: {str(e)}'})
        }

def insert(sql, params):
    conn = psycopg2.connect(host=host, user=username, password=password, database=database)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute(sql, params)
    
    conn.commit() # <- We MUST commit to reflect the inserted data
    cur.close()
    conn.close() 