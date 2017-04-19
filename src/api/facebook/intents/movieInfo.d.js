import { ILuisData } from '../../../luis/interfaces';
import { IMessagingReceived } from '../../../../handlers/facebook/webhook-interface';
export default function handleMovieInfoIntent(message: IMessagingReceived, luisData: ILuisData): Promise<{}>;
