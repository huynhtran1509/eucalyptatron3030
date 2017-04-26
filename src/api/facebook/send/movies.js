import { IMovieDetail, IPerformance } from '../../../handlers/query';
import { ISendAPIRequest, send } from '../../../handlers/facebook/send';
import { find, propEq } from 'ramda';
import { getMovieButtons, getPurchaseButton } from '../buttons';

const moment = require('moment');

function getMovieRuntime(movie: IMovieDetail): string {
  const duration = moment.duration(movie.Duration, 'minutes');
  const hours = duration.hours();
  const minutes = duration.minutes();
  const runtimeDisplay = `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minutes`;

  return runtimeDisplay;
}

function closest(arr: Array<number>, closestTo: number): number {
  let closest = Math.max.apply(null, arr); // Get the highest number in arr in case it matches nothing.

  arr.forEach((currentValue, index, array) => {
    if (currentValue >= closestTo && currentValue < closest) {
      closest = currentValue;
    }
  });

  return closest; // return the value
}


export function sendMoviePayload(senderId: string, movies: IMovieDetail[], theatreCode: string, date: Date): Promise<{}> {
  const request: ISendAPIRequest = {
    recipient: { id: senderId },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
                    // @TODO we need a "load more" functionality.
                    // See issue #3
          elements: movies.map((movie) => {
            movie.theatreCode = theatreCode;
            return {
              title: movie.Title,
              image_url: find(propEq('DimensionWidth', '640'))(movie.Media).Url,
              subtitle: `${movie.Rating}, ${movie.GenrePrimary}, ${getMovieRuntime(movie)}`,
              buttons: getMovieButtons(movie, date),
            };
          }).slice(0, 9)
        }
      }
    }
  };
  return send(request);
}

export function sendSingleMoviePayload(senderId: string, movies: IPerformance[], theatreCode: string, date: Date): Promise<{}> {
  const request: ISendAPIRequest = {
    recipient: { id: senderId },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: movies.map(performance => ({
            title: moment(performance.BizDateShowTime).calendar(),
            buttons: [getPurchaseButton(performance, theatreCode)]
          })).slice(0, 9)
        }
      }
    }
  };
  return send(request);
}
