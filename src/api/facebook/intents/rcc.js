import { ILuisData } from '../../luis/interfaces';
import { sendTextPayload } from '../../../handlers/facebook/send';

export default function handleRCCIntent(message: IMessagingReceived,
  luisData: ILuisData): Promise<{}> {
  return sendTextPayload(
        message.sender.id,
        'View your Regal Crown Club information at: http://www.regmovies.com/regal-crown-club');
}
