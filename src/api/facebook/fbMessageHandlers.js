/**
 * @flow
 */
import { listOfDoNotUnderstandQueryResponses, randomResponse } from './intents/responseContent';
import { sendMoviePayload, sendSingleMoviePayload } from './send/movies';

import LUIS_API_ROOT from '../../config';
import mnlpQuery from '../magic-nlp/query';
import { path } from 'ramda';
import query from '../../handlers/query';
import sendTextPayload from '../../handlers/facebook/send';

export function messageReceivedHandler(message: any) {
  const text = message.message.text;
  const senderId = message.sender.id;
  const msgPath = path(['message', 'quick_reply', 'payload'], message);

  function sendMNLPUtterance(senderId: string, mnlpUtterance?: string) {
    if (mnlpUtterance) {
      return sendTextPayload(senderId, mnlpUtterance);
    }
    return sendTextPayload(senderId, randomResponse(listOfDoNotUnderstandQueryResponses));
  }

  if (msgPath) {
    if (typeof msgPath.type !== 'undefined' && msgPath.type === 'MOVIE_SHOWTIMES') {
      return mnlpQuery({
        'user-id': {
          type: 'facebook',
          ID: senderId
        },
        epoch: 1484771343.01,
        'payload-type': 'luis',
        payload: {
          query: "I'd like to see showtimes",
          topScoringIntent: { intent: 'SeekShowtime', score: 1 },
          intents: [
                                { intent: 'SeekShowtime', score: 1 },
          ],
          entities: []
        }
      }).then(mnlpData => Promise.all([
        sendTextPayload(senderId, mnlpData.utterance)
      ]));
    }
  }

  return query(LUIS_API_ROOT, text).then(luisData => mnlpQuery({
    'user-id': {
      type: 'facebook',
      ID: senderId
    },
    epoch: 1484771343.01, // TODO
    'payload-type': 'luis',
    payload: luisData
  }).then((mnlpData) => {
            // temporary settings trigger
    const theatreCode = mnlpData.context.sessions[0].facets['ity.location']['ity.code'];

    if (mnlpData.errorMessage) {
      throw new Error(mnlpData.errorMessage);
    }

    if (mnlpData.Recovery) {
                // showQuickReplyForErrorHandling(senderId, mnlpData.utterance);
      // return showQuickReplyForErrorHandling(senderId, mnlpData.utterance);
    }

    if (mnlpData.AskLocation) {

                // return showLocationQuickReplyButton(senderId, mnlpData.utterance)
    }

    if (mnlpData.ShowtimesFlat) {
      return Promise.all([
        sendMNLPUtterance(senderId, mnlpData.utterance),
        sendMoviePayload(senderId, mnlpData.ShowtimesFlat, theatreCode, new Date())
      ]);
    }

    if (mnlpData.Showtimes) {
                // get performance arrays from each Showtime and flatten them
      const performances = [].concat.apply([], mnlpData.Showtimes.map(obj => obj.Performances));
      return Promise.all([
        sendMNLPUtterance(senderId, mnlpData.utterance),
        sendSingleMoviePayload(senderId, performances, theatreCode, new Date())
      ]);
    }

    const mnlpUtterance = mnlpData.utterance;
    return sendTextPayload(senderId, mnlpUtterance);
  }).catch((response) => {
    throw new Error(JSON.stringify(response.data));
  }));
}

export function postbackHandler(message: IMessagingPostback) {
  const data = JSON.parse(message.postback.payload);
  const senderId = message.sender.id;


  if (data.type === 'GET_STARTED') {
    return mnlpQuery({
      'user-id': {
        type: 'facebook',
        ID: senderId
      },
      epoch: 1484771343.01,
      'payload-type': 'luis',
      facets: {},
      utterance: 'Seek Showtimes',
      payload: {
        query: 'Seek Showtime',
        topScoringIntent: {
          intent: 'SeekShowtime',
          score: 1.0
        },
        intents: [
          {
            intent: 'SeekShowtime',
            score: 1
          },
        ],
        entities: []
      }
    }).then((mnlpData) => {
      const mnlpUtterance = mnlpData.utterance;
      return sendTextPayload(senderId, mnlpUtterance);
    })
         .catch((response) => {
           throw new Error(JSON.stringify(response.data));
         });
  }

  if (data.type === 'WATCH_EMBED_TRAILER') {
    return sendWatchTrailer(senderId, data.payload);
  }

  if (data.type === 'MOVIE_DESCRIPTION') {
    return mnlpQuery({
      'user-id': {
        type: 'facebook',
        ID: senderId
      },
      epoch: 1484771343.01,
      'payload-type': 'luis',
      facets: {
        'ity.movie': {
          'ity.title': data.payload.title,
          'ity.code': data.payload.code,
        }
      },
      utterance: 'Get Description',
      payload: {
        query: 'Get Description',
        topScoringIntent: {
          intent: 'SeekMovieInfo',
          score: 1.0
        },
        intents: [
          {
            intent: 'SeekMovieInfo',
            score: 1
          },
        ],
        entities: []
      }
    }).then((mnlpData) => {
      const mnlpUtterance = mnlpData.utterance;
      return sendTextPayload(senderId, mnlpUtterance);
    }).catch((response) => {
      throw new Error(JSON.stringify(response.data));
    });
  }

  if (data.type === 'MOVIE_SHOWTIMES') {
    const theatreCode = data.payload.theatreCode;
    const movie = {};

    Object.keys(data.payload).forEach((key) => {
      movie[`ity.${key}`] = data.payload[key];
    });
    const facets = Object.keys(movie).length ? {
      'ity.movie': { ...movie }
    } : {};


    const sendPerformances = (theatreCode, mnlpData) => {
      if (mnlpData.Showtimes && theatreCode) {
                 // get performance arrays from each Showtime and flatten them
        const performances = [].concat.apply([], mnlpData.Showtimes.map(obj => obj.Performances));
        return Promise.all([
          sendMNLPUtterance(mnlpData.utterance),
          sendSingleMoviePayload(senderId, performances, theatreCode, new Date())
        ]);
      }
    };

    return mnlpQuery({
      'user-id': {
        type: 'facebook',
        ID: senderId
      },
      epoch: 1484771343.01,
      'payload-type': 'luis',
      facets,
      utterance: 'Get Showtimes',
      payload: {
        query: 'Get Showtimes',
        topScoringIntent: {
          intent: 'SeekShowtime',
          score: 1.0
        },
        intents: [
          {
            intent: 'SeekShowtime',
            score: 1
          },
        ],
        entities: []
      }
    }).then(mnlpData => sendPerformances(theatreCode, mnlpData)
        ).catch((response) => {
          throw new Error(JSON.stringify(response.data));
        });
  }

  return sendTextPayload(senderId, 'I live but to serve you, my liege.');
}

