import { ILuisData } from '../../../luis/interfaces';
import { IMessagingReceived } from '../../../../handlers/facebook/webhook-interface';
export default function handleGreetingIntent(message: IMessagingReceived, luisData: ILuisData): Promise<{}>;