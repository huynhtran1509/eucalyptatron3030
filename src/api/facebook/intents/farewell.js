import { ILuisData } from '../../../luis/interfaces';
import { IMessagingReceived } from '../../../../handlers/facebook/webhook-interface';
import { sendCatchAll } from '../send/catchall';
import { listOfFarewells, randomResponse } from './responseContent';


export default function handleFarewellIntent(message: IMessagingReceived, luisData: ILuisData): Promise<{}> {
    return sendCatchAll(message, randomResponse(listOfFarewells));
}
