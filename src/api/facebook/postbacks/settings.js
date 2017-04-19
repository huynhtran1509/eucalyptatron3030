//
// Postback handlers for any single "setting" query
//

import { sendShowtimesPayload } from '../send/showtimes';
import { sendButtonPayload, sendTextPayload } from '../../../facebook/send';
import { sendSettingsPayload } from '../send/settings';
import { getMoviesButton } from '../buttons';
import { IMovieDetail, getMovieShowtimes } from '../../query';
import { putDocument, getDocument } from '../../../../api/aws/dynamo';
import { showAuthenticatedMenu } from '../thread/persistentMenu';
import { showLocationQuickReplyButton } from '../send/quickReply';
import { shareLocationDuringConversationPrompt } from '../intents/responseContent';
//
// postback 'REQUEST_ZIP'
//
export function requestZip(senderId: string): Promise<{}> {
    return showLocationQuickReplyButton(senderId, shareLocationDuringConversationPrompt);
}

//
// postback 'SET_MOVIE_THEATRE'
//
interface ISetMovieTheatre {
    theatreName: string;
    theatreLocation: string;
    theatreCode: string;
}

export function setMovieTheatre(senderId: string, payload: ISetMovieTheatre): Promise<{}> {
    return putDocument({
        TableName: 'regalbot',
        Item: {
            senderId,
            theatreName: payload.theatreName,
            theatreLocation: payload.theatreLocation,
            theatreCode: payload.theatreCode,
        }
    }).then(() => {
        return showAuthenticatedMenu(senderId).then(() => {
            return sendButtonPayload(
                senderId,
                `Awesome, thanks! I'll remember that theatre for you. In the future, you can ask what is playing without a city or zip and I'll know to look here.`,
                [getMoviesButton(payload.theatreCode)]);
        });
    });
}

//
// postback "VIEW_SETTINGS"
//
export function viewSettings(senderId: string): Promise<{}> {
    return sendSettingsPayload(senderId);
}
