import { sendTextPayload, sendButtonPayload } from '../../../facebook/send';
import { IMessagingReceived } from '../../../../handlers/facebook/webhook-interface';
import { getMoviesButton, viewRegalMoviesButton, getSettingsButton  } from '../buttons';
import { getTheatreCode } from '../../helpers/theatre';

export function sendCatchAll(message: IMessagingReceived, text: string): Promise<{}> {
    return getTheatreCode(message.sender.id).then(theatreCode => {
        if (!theatreCode) {
            return sendTextPayload(
                message.sender.id,
                `${text}\n\n` +
                `Ask me questions like "What is playing in Washington, DC?" to get started.`);
        } else {
            return sendButtonPayload(
                message.sender.id,
                text,
                [
                    getMoviesButton(theatreCode),
                    getSettingsButton(),
                    viewRegalMoviesButton()
                ]);
        }
    });
}
