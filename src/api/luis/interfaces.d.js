export declare type LuisIntentEnum = 'ExpressThanks' | 'Parting' | 'SeekShowtime' | 'Revise' | 'Assent' | 'AskRCC' | 'Banter' | 'ExpressDelight' | 'SeekMovieInfo' | 'DiscussConcessions' | 'Decline' | 'AskAdvice' | 'Greet' | 'None' | 'ExpressFrustration' | 'SeekShowtime';
export interface ILuisIntent {
    intent: LuisIntentEnum;
    score: number;
}
export interface ILuisEntity {
    entity: string;
    type: string;
    startIndex: number;
    endIndex: number;
    score: number;
    resolution: any;
}
export interface ILuisData {
    query: string | void;
    intents: ILuisIntent[];
    entities: ILuisEntity[];
}
