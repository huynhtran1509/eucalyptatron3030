import { ILuisData } from './interfaces';
export default function query(luisAPIRoot: string, utterance: string): Promise<ILuisData>;
