import { FB_VERIFY_TOKEN } from '../config';

export default function handler(): Promise<string> {
    console.log('pong');
    return Promise.resolve('pong');
};
