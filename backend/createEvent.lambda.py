# Required imports
import botocore
import boto3

# Imports for your app
from datetime import datetime

# Update your cluster and secret ARNs
cluster_arn = 'arn:aws:rds:us-east-1:0000000000:cluster:my-cluster' 
secret_arn = 'arn:aws:secretsmanager:us-east-1:0000000000:secret:my-secret'

rds_data = boto3.client('rds-data')


def lambda_handler(event, context):
    body = event.body
    
    sql = """
          INSERT INTO events(userId, sportId, dificulty, place, time, description)
          VALUES(:userId, :sportId, :dificulty, :place, TO_TIMESTAMP(:time, 'YYYY-MM-DD HH24:MI:SS'), :description)
          """
    
    param_set = [
        {'name': 'userId', 'value':{'stringValue': body.userId}},
        {'name': 'sportId', 'value':{'stringValue': body.sportId}},
        {'name': 'dificulty', 'value':{'stringValue': body.dificulty}},
        {'name': 'place', 'value':{'stringValue': body.place}},
        {'name': 'time', 'value':{'stringValue': body.time}},
        {'name': 'description', 'value':{'stringValue': body.description}},
    ]
    
    call_rds_data_api(sql, param_set)


def call_rds_data_api(sql, param_set):
    response = rds_data.execute_statement(
        resourceArn = cluster_arn, 
        secretArn = secret_arn, 
        database = '', 
        sql = sql,
        parameters = param_set)
    
    print(str(response));