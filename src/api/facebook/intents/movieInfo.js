const moment = require('moment');
const { compose, defaultTo, find, prop, propEq, path } = require('ramda');
import { getTheatreCode } from '../../helpers/theatre';
import { sendSingleMoviePayload } from '../send/movies';
import { getMovieShowtimes, IMovieDetail } from '../../query';
import { ILuisData } from '../../../luis/interfaces';
import { sendTextPayload, sendButtonPayload, IButton } from '../../../facebook/send';
import { IMessagingReceived } from '../../../../handlers/facebook/webhook-interface';
import { sendSettingsZipIntent} from '../send/settings';
//import { getCityDataFromUtterance } from '../../../../helpers/cities';
import { listOfCannotFindMovieInfoResponses, randomResponse } from './responseContent';

const DEFAULT_THEATURE_CODE = '1969';

export default function handleMovieInfoIntent(message: IMessagingReceived, luisData: ILuisData): Promise<{}> {
    const senderId = message.sender.id;

    // @TODO extract this
    // See issue #16
    const getEntity = (type) => compose(
        defaultTo({}),
        find(propEq('type', type)),
        prop('entities')
    )(luisData);

    const getEntityValue = compose(prop('entity'), getEntity);
    const luisMovie = getEntityValue('movie');

    if (!luisMovie) {
        return sendTextPayload(senderId, randomResponse(listOfCannotFindMovieInfoResponses));
    }

    return getTheatreCode(senderId).then((theatreCode) => {
        theatreCode = theatreCode || DEFAULT_THEATURE_CODE;

        //return sendMovieInfo(senderId, theatreCode, luisMovie, new Date());
        return true;
    });
}
