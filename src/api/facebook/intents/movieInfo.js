import { listOfCannotFindMovieInfoResponses, randomResponse } from './responseContent';

import { ILuisData } from '../../luis/interfaces';
import { sendTextPayload } from '../../../handlers/facebook/send';

const DEFAULT_THEATURE_CODE = '1969';

const { compose, defaultTo, find, prop, propEq } = require('ramda');

export default function handleMovieInfoIntent(message: any, luisData: ILuisData): Promise<{}> {
  const senderId = message.sender.id;

    // @TODO extract this
    // See issue #16
  const getEntity = type => compose(
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

        // return sendMovieInfo(senderId, theatreCode, luisMovie, new Date());
    return true;
  });
}
