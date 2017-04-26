import { Lambda, config } from 'aws-sdk';

import { AWS_REGION } from '../config';

config.update({ region: AWS_REGION });

const lambda = new Lambda();

export async function invoke(functionName, requestData) {
  return new Promise((resolve, reject) => lambda.invoke({
    FunctionName: functionName,
    Payload: JSON.stringify(requestData)
  }, (err, data) => err ? reject(err) : resolve(data)));
}
