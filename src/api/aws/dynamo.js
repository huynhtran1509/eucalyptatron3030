const AWS = require('aws-sdk');
import { AWS_REGION } from '../../config';

AWS.config.update({
    region: AWS_REGION
});

const docClient = new AWS.DynamoDB.DocumentClient();

type AnyHash = { [key: string]: any };

interface IConsumedCapacity {
    CapacityUnits: number;
    GlobalSecondaryIndexes: {
        [key: string]: {
            CapacityUnits: number;
        };
    };
    LocalSecondaryIndexes: {
        [key: string]: {
            CapacityUnits: number;
        };
    };
    Table: {
        [key: string]: {
            CapacityUnits: number;
        };
    };
    TableName: string;
}

interface IPutItemRequest {
    TableName: string;
    Item: AnyHash;
    ConditionalOperator?: string;
    ConditionExpression?: string;
    Expected?: {
        [key: string]: {
            AttributeValueList: Array<AnyHash>;
            ComparisonOperator: string[];
            Exists: boolean;
            Value: AnyHash;
        }
    };
    ExpressionAttributeNames?: AnyHash;
    ExpressionAttributeValues?: AnyHash;
    ReturnConsumedCapacity?: string;
    ReturnItemCollectionMetrics?: string;
    ReturnValues?: string;
}

interface IPutItemResponse {
    Attributes: AnyHash;
    ConsumedCapacity: IConsumedCapacity;
    ItemCollectionMetrics: {
        ItemCollectionKey: AnyHash;
        SizeEstimateRangeGB: number[];
    };
}

interface IGetItemRequest {
    TableName: string;
    Key: AnyHash;
    AttributesToGet?: string[];
    ConsistentRead?: boolean;
    ExpressionAttributeNames?: {
        [key: string]: string;
    };
    ProjectionExpression?: string;
    ReturnConsumedCapacity?: string;
}

interface IGetItemResponse {
    ConsumedCapacity: IConsumedCapacity;
    Item: AnyHash;
}

export function putDocument(params: IPutItemRequest): Promise<IPutItemResponse> {
    return new Promise((resolve, reject) =>
        docClient.put(params, (error, data: IPutItemResponse) =>
            error ? reject(error) : resolve(data)));
}

export function getDocument(params: IGetItemRequest): Promise<IGetItemResponse> {
    return new Promise((resolve, reject) =>
        docClient.get(params, (error, data: IGetItemResponse) =>
            error ? reject(error) : resolve(data)));
}
