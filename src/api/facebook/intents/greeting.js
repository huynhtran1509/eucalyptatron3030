import { ILuisData } from '../../../luis/interfaces';
import { IMessagingReceived } from '../../../../handlers/facebook/webhook-interface';
import { sendCatchAll } from '../send/catchall';
import { listOfGreetings, randomResponse } from './responseContent';

export default function handleGreetingIntent(message: IMessagingReceived, luisData: ILuisData): Promise<{}> {
    return sendCatchAll(message, randomResponse(listOfGreetings));
}
