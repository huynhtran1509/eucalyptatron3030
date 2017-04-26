const moment = require('moment');

import { IMovieDetail, IPerformance, IShowtimes, ITheatreLocation } from '../../handlers/query';
import { find, propEq } from 'ramda';

import { IButton } from '../../handlers/facebook/send';
import { getTicketPurchaseDeepLinkUrl } from '../../config';

export function getMoviesButton(theatreCode: string, title?: string): IButton {
  return {
    type: 'postback',
    title: title || 'What\'s playing?',
    payload: JSON.stringify({
      type: 'GET_MOVIES',
      payload: { theatreCode }
    })
  };
}

export function getShowtimeButton(m: IMovieDetail): IButton {
  return {
    type: 'postback',
    title: 'Get Showtimes',
    payload: JSON.stringify({
      query: 'Get Showtimes',
      payload: {
        theatreCode: m.theatreCode,
        title: m.Title,
        code: m.FilmCode,
                //date: moment(date).toString()
      }
    })
  };
}

export function getMovieDescriptionButton(m: IMovieDetail): IButton {
  return {
    type: 'postback',
    title: 'Get Description',
    payload: JSON.stringify({
      query: 'Get Description',
      payload: {
        theatreCode: m.theatreCode,
        title: m.Title,
        code: m.FilmCode,
      }
    })
  };
}

export function getWatchYoutubeTrailerButton(url: string): IButton {
  return {
    type: 'web_url',
    title: 'YouTube Trailer ↗',
    payload: url
  };
}

export function getWatchEmbedTrailerButton(m: IMovieDetail): IButton {
  return {
    type: 'postback',
    title: 'Watch Trailer',
    payload: JSON.stringify({
      query: 'Watch Trailer',
      payload: {
        url: m.embedTailerUrl,
        title: m.title
      }
    })
  };
}

export function getMovieButtons(m: IMovieDetail, date: Date): IButton[] {
  const buttons: IButton[] = [
    getShowtimeButton(m, date)
  ];

  const ytt = find(propEq('SubType', 'Trailer_Youtube'))(m.Media);
  const youtubeTrailerUrl = ytt ? ytt.Url : null;


  if (youtubeTrailerUrl) {
    buttons.push(getWatchYoutubeTrailerButton(youtubeTrailerUrl));
  }

  buttons.push(getMovieDescriptionButton(m));
  return buttons;
}

export function getPurchaseButton(s: IPerformance, theatreCode?: string): IButton {
  const showTime = moment(s.BizDateShowTime).toDate();
  const button: IButton = {
    type: 'web_url',
    title: 'Purchase Tickets ↗',
    url: getTicketPurchaseDeepLinkUrl(showTime, theatreCode, s.PurchaseURL.Fandango, s.PerformanceId)
  };

  return button;
}

export function setTheatreLocationButton(loc: ITheatreLocation) {
  const button: IButton = {
    type: 'postback',
    title: 'Set as default',
    payload: JSON.stringify({
      query: 'Set Movie Theatre',
      payload: {
        theatreCode: loc.TheatreCode,
        theatreName: loc.Name,
        theatreLocation: loc.Address
      }
    })
  };

  return button;
}

export function getSettingsButton() {
  const button: IButton = {
    type: 'postback',
    title: 'View Settings',
    payload: JSON.stringify({
      type: 'GET_SETTINGS'
    })
  };

  return button;
}


export function viewRegalMoviesButton() {
  const button: IButton = {
    type: 'web_url',
    title: 'Regal Website ↗',
    url: 'http://www.regmovies.com/Movies'
  };

  return button;
}
