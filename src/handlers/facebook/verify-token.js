import { FB_VERIFY_TOKEN } from '../../config';

interface IVerifyPayload {
    token: string;
    challenge: string;
}

export default function handler(payload: IVerifyPayload): Promise<string> {
    if (payload.token === FB_VERIFY_TOKEN) {
        return Promise.resolve(payload.challenge);
    }

    return Promise.reject('Error, wrong validation token');
};
