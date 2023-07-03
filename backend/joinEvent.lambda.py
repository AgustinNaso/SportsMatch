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
          INSERT INTO participants(eventId, userId, confirmed)
          VALUES(:eventId, :userId, :confirmed)
          """
    
    param_set = [
        {'name': 'eventId', 'value':{'stringValue': body.eventId}},
        {'name': 'userId', 'value':{'stringValue': body.userId}},
        {'name': 'confirmed', 'value':{'booleanValue': False}}
    ]
    
    call_rds_data_api(sql, param_set)


def call_rds_data_api(sql, param_set):
    response = rds_data.execute_statement(
        resourceArn = cluster_arn, 
        secretArn = secret_arn, 
        database = '', 
        sql = sql,
        parameters = param_set)