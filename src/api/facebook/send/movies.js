import { IMovieDetail, IPerformance } from '../../../handlers/query';
import { ISendAPIRequest, send } from '../../../handlers/facebook/send';
import { find, propEq } from 'ramda';
import { getMovieButtons, getPurchaseButton } from '../buttons';

const moment = require('moment');

const botBuilder = require('claudia-bot-builder');
const fbTemplate = botBuilder.fbTemplate;

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


export function sendMoviePayload(movies: IMovieDetail[], theatreCode: string, type: string): Promise<{}> {
  
    const carousel = movies.slice(0, 9);
    const generic = new fbTemplate.Generic();

    return carousel.reduce((acc, val) => {
      const buttons = getMovieButtons(val);
      acc
        .addBubble(val.Title, `${val.Rating}, ${val.GenrePrimary}, ${getMovieRuntime(val)}`)
          .addImage(find(propEq('DimensionWidth', '640'))(val.Media).Url);
      buttons.forEach(button => acc.addButton(button.title, button.payload));

      return acc;
    }, generic).get();

}

export function sendSingleMoviePayload(movies: IPerformance[], theatreCode: string, type: string): Promise<{}> {
  
    const carousel = movies.slice(0, 9);
    const generic = new fbTemplate.Generic();

    return carousel.reduce((acc, val) => {
      const button = getPurchaseButton(val, theatreCode);
      console.info('butt', button);
      acc
        .addBubble(moment(val.BizDateShowTime).calendar())
        .addButton(button.title, button.url);

      return acc;
    }, generic).get();

}
