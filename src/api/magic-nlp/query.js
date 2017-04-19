import { invoke } from '../aws/lambda';
import { ILuisData, LuisIntentEnum } from '../luis/interfaces';

export type FacebookUserID = {
    type: 'facebook';
    ID: string; // a facebook uuid (e.g. "sender id")
}
export type UserID = FacebookUserID;

export type PostbackPayload = {
    query: string;
    intents: { intent: LuisIntentEnum; score: 1; }[];
    entities: { type: string; entity: string; }[];
    topScoringIntent?: { intent: LuisIntentEnum; score: 1; }[];
}

/*
|
| REQUEST to MagicNLP
|
*/

export type LuisRequest = {
    'user-id'?: UserID;
    epoch?: number; // e.g. 1484771343.01
    'payload-type': 'luis';
    payload: ILuisData | PostbackPayload;
    facets?: any;
    utterance?: string;
}

// This is the request that we send out to magicNLP
export type PostbackRequest = {
    'payload-type': 'postback';
    'user-id'?: UserID;
    epoch?: number; // e.g. 1484771343.01
    // As requested, we're going to mirror the LuisData structure for now
    facets?: any;
    payload: PostbackPayload;
}

export type MagicNlpRequest = LuisRequest | PostbackRequest

/*
| "Results" are what are taked on the payload coming back from
| magicNLP and guide us on what to do. If an utterance is provided,
| we should send this text to the user.
|
| There are actionable items as well, such as "showtime" payloads
| that prompt us to show the user showtimes / etc. In facebook for
| example, this would show movie bubbles.
*/


export type showtimes = {
    'payload-type': 'showtimes';
    utterance: string;
}

export type movieInfo = {
    'payload-type': 'movie-info';
    utterance: string;
}

export type MagicNlpResult = showtimes | movieInfo;

export type MagicNlpLuisResponse = {
    "epoch": number; // e.g. 1484771343.01
    "mnlp-lambda-timestamp": string;
    "payload": ILuisData;
    "payload-type": 'luis';
    "result-aux": any;
    "result-payload": MagicNlpResult;
    "result-payload-type": 'showtimes' | 'movie-info';
    "user-id": UserID;
    "utterance": string;
}

export type MagicNlpPostbackResponse = {
    "epoch": number; // e.g. 1484771343.01
    "mnlp-lambda-timestamp": string;
    "payload": ILuisData;
    "payload-type": 'postback';
    facets?: any;
    "result-aux": any;
    "result-payload": MagicNlpResult;
    "result-payload-type": 'showtimes' | 'movie-info';
    "user-id"?: UserID;
    "utterance": string;
}

export type MagicNlpResponse = MagicNlpLuisResponse | MagicNlpPostbackResponse;


export default async function query(requestPayload: MagicNlpRequest) {
        
    try {
        const res = await invoke<MagicNlpRequest>("ca2", requestPayload)

        if (res.StatusCode !== 200) {
            throw new Error("failed to query magicNLP!");
        }

        if (typeof res.Payload === "string") {
            const data: MagicNlpResponse = JSON.parse(res.Payload);
            return data;
        }

        throw new Error("invalid payload from magicNLP!");
    } catch (err) {
        throw new err
    }
}
