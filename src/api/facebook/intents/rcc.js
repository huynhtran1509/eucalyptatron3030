import { ILuisData } from '../../../luis/interfaces';
import { sendTextPayload } from '../../../facebook/send';
import { IMessagingReceived } from '../../../../handlers/facebook/webhook-interface';

export default function handleRCCIntent(message: IMessagingReceived, luisData: ILuisData): Promise<{}> {
    return sendTextPayload(
        message.sender.id,
        `View your Regal Crown Club information at: http://www.regmovies.com/regal-crown-club`);
}
