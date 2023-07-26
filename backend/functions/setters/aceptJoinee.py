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

        if event_id is None or user_id is None:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Bad request. Missing eventId or userId'})
            }

        sql = """
              UPDATE participants
              SET status = true
              WHERE event_id = %s AND user_id = %s
              """

        param_set = (event_id, user_id)

        try:
            insert(sql, param_set)
            return {
                'statusCode': 201,
                'body': json.dumps({'message': 'Update successful'})
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

    try:
        cur.execute(sql, params)
        conn.commit()
        cur.close()
        conn.close()
        return True
    except psycopg2.Error as e:
        conn.rollback()  # Rollback the transaction on error
        raise e  # Re-raise the exception for the caller to handle

    return False  # This return will not be reached if an exception occurs
