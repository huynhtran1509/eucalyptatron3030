export type LuisIntentEnum =
    'ExpressThanks'
    | 'Parting'
    | 'SeekShowtime'
    | 'Revise'
    | 'Assent'
    | 'AskRCC'
    | 'Banter'
    | 'ExpressDelight'
    | 'SeekMovieInfo'
    | 'DiscussConcessions'
    | 'Decline'
    | 'AskAdvice'
    | 'Greet'
    | 'None'
    | 'ExpressFrustration'
    | 'SeekShowtime';

export interface ILuisIntent {
    intent: LuisIntentEnum;
    score: number; // float
}

export interface ILuisEntity {
    entity: string;
    type: string;
    startIndex: number; // int
    endIndex: number; // int
    score: number; // float
    resolution: any; // arbitrary object, e.g. { date: "2014-02-10" }
}

export interface ILuisData {
    query: string | void; // 'null' with empty search param
    intents: ILuisIntent[];
    entities: ILuisEntity[];
}
