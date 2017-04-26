/**
 * @flow
 */
import { config, Lambda } from 'aws-sdk';
import { AWS_REGION } from '../../config';

config.update({ region: AWS_REGION });

const lambda = new Lambda();

export async function invoke<T>(functionName: string, requestData: T) {
  return ((resolve, reject) => lambda.invoke({
    FunctionName: functionName,
    Payload: JSON.stringify(requestData)
  }, (err, data) => err ? reject(err) : resolve(data)));
}
