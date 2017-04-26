const moment = require('moment');
const { compose, defaultTo, find, prop, propEq, path } = require('ramda');

import { IButton, sendButtonPayload, sendTextPayload } from '../../../facebook/send';
import { IMovieDetail, getMovieShowtimes, getSimpleMovies } from '../../../handlers/query';

import { ILuisData } from '../../../luis/interfaces';
import { getTheatreCode } from '../../helpers/theatre';
import { sendMoviePayload } from '../send/movies';
import { sendSettingsZipIntent } from '../send/settings';
import { sendShowtimesPayload } from '../send/showtimes';
// import { getCityDataFromUtterance } from '../../../../helpers/cities';

export default function handleShowtimeIntent(message: any, luisData: ILuisData): Promise<{}> {
    // @TODO extract this
    // See issue #16
  const getEntity = type => compose(
        defaultTo({}),
        find(propEq('type', type)),
        prop('entities')
    )(luisData);

  const getEntityValue = compose(prop('entity'), getEntity);
  const getEntityResolution = compose(prop('resolution'), getEntity);

  const luisDateResolution = getEntityResolution('builtin.datetime.date');
  const luisDate = luisDateResolution ? moment(luisDateResolution.date).toDate() : void 0;
  const luisMovie = getEntityValue('movie');
  const luisZip = getEntityValue('zip');

  const senderId = message.sender.id;

    // If we didn't pull out a movie from the query, go ahead and
    // do some checks for zip codes & cities just incase the user
    // wanted to view showtimes for one-off locations
  if (!luisMovie) {
        // If a zip code is provided, go ahead and assume that they want to
        // view a list of movie theatres.
    if (luisZip) {
      return sendSettingsZipIntent(senderId, luisZip);
    }

        // Likewise, if a city is provided, show a list of theatres in that
        // location that they can choose from.
        // const cityData = getCityDataFromUtterance(message.message.text);
        //
        // if (cityData) {
        //     return sendTextPayload(
        //         senderId,
        //         `Showtimes in ${cityData.city}, ${cityData.state}? Sure! Just a moment`
        //     ).then(() => {
        //         return sendSettingsCityIntent(senderId, cityData);
        //     });
        // }
  }

  return getTheatreCode(message.sender.id).then((theatreCode) => {
    if (!theatreCode) {
      return sendTextPayload(
                senderId,
                'You must provide a zip or a city in your query! ' +
                'After this, you can choose to set a default theatre so ' +
                'you don\'t have to tell me again!');
    }

        /* Showtimes on a specific date
           e.g. "what time is batman playing tomorrow?"  */
    if (luisDate && luisMovie) {
            // return sendShowtimesForMovie(senderId, theatreCode, luisMovie, luisDate);
    }

        /* Showtimes for today
           e.g. "what time is batman playing?" */
    if (luisMovie) {
            // return sendShowtimesForMovie(senderId, theatreCode, luisMovie, new Date());
    }

        /* Movie bubbles for given luisDate
           e.g. "what is playing tomorrow?" */
    if (luisDate) {
            // return sendMovieBubbles(senderId, theatreCode, luisDate);
    }

        /* Movie bubbles for today
           e.g. "what is playing?" */
        // return sendMovieBubbles(senderId, theatreCode, new Date());
  });
}
