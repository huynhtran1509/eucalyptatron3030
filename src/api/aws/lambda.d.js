import { Lambda } from 'aws-sdk';
export declare function `invoke`<T>(functionName: string, requestData: T): Promise<Lambda.InvocationResponse>;
