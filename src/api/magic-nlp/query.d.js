import { ILuisData, LuisIntentEnum } from '../luis/interfaces';
export declare type FacebookUserID = {
    type: 'facebook';
    ID: string;
};
export declare type UserID = FacebookUserID;
export declare type PostbackPayload = {
    query: string;
    intents: {
        intent: LuisIntentEnum;
        score: 1;
    }[];
    entities: {
        type: string;
        entity: string;
    }[];
};
export declare type LuisRequest = {
    'user-id'?: UserID;
    epoch?: number;
    'payload-type': 'luis';
    payload: ILuisData;
    facets?: any;
    utterance?: string;
};
export declare type PostbackRequest = {
    'payload-type': 'postback';
    'user-id'?: UserID;
    epoch?: number;
    facets?: any;
    payload: PostbackPayload;
};
export declare type MagicNlpRequest = LuisRequest | PostbackRequest;
export declare type showtimes = {
    'payload-type': 'showtimes';
    utterance: string;
};
export declare type movieInfo = {
    'payload-type': 'movie-info';
    utterance: string;
};
export declare type MagicNlpResult = showtimes | movieInfo;
export declare type MagicNlpLuisResponse = {
    "epoch": number;
    "mnlp-lambda-timestamp": string;
    "payload": ILuisData;
    "payload-type": 'luis';
    "result-aux": any;
    "result-payload": MagicNlpResult;
    "result-payload-type": 'showtimes' | 'movie-info';
    "user-id": UserID;
    "utterance": string;
};
export declare type MagicNlpPostbackResponse = {
    "epoch": number;
    "mnlp-lambda-timestamp": string;
    "payload": ILuisData;
    "payload-type": 'postback';
    facets?: any;
    "result-aux": any;
    "result-payload": MagicNlpResult;
    "result-payload-type": 'showtimes' | 'movie-info';
    "user-id"?: UserID;
    "utterance": string;
};
export declare type MagicNlpResponse = MagicNlpLuisResponse | MagicNlpPostbackResponse;
export default function query(requestPayload: MagicNlpRequest): Promise<MagicNlpResponse>;
