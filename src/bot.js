/**
 * @flow
 */

import { Map, fromJS } from 'immutable';
import { sendMoviePayload, sendSingleMoviePayload } from './api/facebook/send/movies';

import { LUIS_TEMPLATE } from './core';
import makeStore from './store';
import { showQuickReplyForErrorHandling } from './api/facebook/send/quickReply';

const botBuilder = require('claudia-bot-builder');
const lambda = require('aws-lambda-invoke');
const AlexaMessageBuilder = require('alexa-message-builder');

const store = makeStore();
store.subscribe(() =>
  console.log('[STORE', store.getState())
);

store.dispatch({
  type: 'SET_STATE',
  state: LUIS_TEMPLATE
});


// const promiseDelay = require('promise-delay');
// const aws = require('aws-sdk');
// const lambda = new aws.Lambda();
// const slackDelayedReply = botBuilder.slackDelayedReply;

function sendMNLPUtterance(mnlpUtterance?: string) { // TO DO import this
  if (mnlpUtterance) {
    return mnlpUtterance;
  }
  return false;
}


const api = botBuilder((message: any, apiRequest) => {
  const Console = {};
  Console.log = console.log.bind(null, '[LOG]');
  Console.info = console.info.bind(null, '[INFO]');
  Console.error = console.error.bind(null, '[ERROR]');
  Console.warn = console.warn.bind(null, '[WARN]');


// TODO: use http://ramdajs.com/0.23.0/docs/#evolve
// from the front end:
  const immMsg = fromJS(message);
  const alias = apiRequest.lambdaContext.invokedFunctionArn.replace(/.*:/g, '');
  const text = immMsg.get('text'); // TODO this can be an obj, so...
  const senderId = immMsg.get('sender');
  const type = immMsg.get('type');
  const hasPostback = immMsg.get('postback');
  let query;

  Console.info(`[RELEASE] executing: ${apiRequest.lambdaContext.functionName}, alias: ${alias} (version ${apiRequest.lambdaContext.functionVersion})`);
  Console.info('[MSG]', immMsg);

    if (hasPostback) {
      const postback = JSON.parse(text);
      

      if (postback.query === 'Get Description') {
         query = Map( // Get Descriptioni
          'user-id': {
            type,
            ID: senderId
          },
          epoch: 1484771343.01,
          'payload-type': 'luis',
          facets: {
            'ity.movie': {
              'ity.title': postback.payload.title,
              'ity.code': postback.payload.code,
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
        )
      } else if (postback.query === 'Get Showtimes') {
        Console.warn('GET SHOWTIMES', postback);
        const theatreCode = postback.payload.theatreCode;
        const movie = {};

        Object.keys(postback.payload).forEach((key) => {
          movie[`ity.${key}`] = postback.payload[key];
        });
        const facets = Object.keys(movie).length ? {
          'ity.movie': { ...movie }
        } : {};

        query = Map (
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
        );
      }
      store.dispatch({
        type: 'SET_STATE',
        state: query,
      });

    }
    else { 
      const query = Map(
        'user-id': {
          type,
          ID: senderId
        },
        utterance: text,
        payload: {
          query: text
        }
      );
      store.dispatch({
        type: 'SET_STATE',
        state: utterance(),
      });

    };



  if (message.text) { //
    return new Promise((resolve, reject) => {
      lambda.raw.invoke({
        FunctionName: 'ca2',
        Payload: JSON.stringify(store.getState()),
      }, (err, done) => {
        if (err) {
          return reject(err);
        }
        resolve(done);
        return true;
      });
    }).then((mnlpData) => { // continunity sez
      const payload = JSON.parse(mnlpData.Payload);
      const type = payload.context['user-id'].type;
      Console.log('mnlpData', mnlpData);
      Console.info('payload', payload);
      Console.info('type', type);


      if (payload.errorMessage) {
        throw new Error(payload.errorMessage);
      }

      if (payload.Recovery) {
          // showQuickReplyForErrorHandling(message.sender, mnlpData.utterance);
        return showQuickReplyForErrorHandling(payload.utterance);
      }

      // if (payload.AskLocation) {
      //
      //     // return showLocationQuickReplyButton(message.sender, mnlpData.utterance)
      // }

      if (payload.ShowtimesFlat) {
        Console.warn('ShowtimesFlat', payload.ShowtimesFlat);
        if (type === "facebook") {
        return Promise.all([
          sendMNLPUtterance(payload.utterance),
          sendMoviePayload(payload.ShowtimesFlat, payload.context.sessions[0].facets['ity.location']['ity.code'])
        ]);
        }
        else if (type === "alexa-skill") {
          return new AlexaMessageBuilder()
            .addText(payload.utterance)
            // .addStandardCard('Alexa Message Builder', 'Alexa message builder description', {
            //   smallImageUrl: 'http://example.com/small-image-url.png',
            //   largeImageUrl: 'http://example.com/large-image-url.png'
            // })
            .keepSession()
            .get()
        }
        
        return payload.utterance;
      
      }

      if (payload.Showtimes) {
          // get performance arrays from each Showtime and flatten them
        const performances = [].concat.apply([], payload.Showtimes.map(obj => obj.Performances));
        Console.warn('PERFORMANCES', performances);
        if (type === "facebook") {
          return Promise.all([
            sendMNLPUtterance(payload.utterance),
            sendSingleMoviePayload(performances, payload.context.sessions[0].facets['ity.location']['ity.code']) // TODO immutable or rambda
          ]);
        }
        else if (type === "alexa-skill") {
          return new AlexaMessageBuilder()
            .addText(payload.utterance)
            // TODO iterate through movies
            // .addStandardCard('Alexa Message Builder', 'Alexa message builder description', {
            //   smallImageUrl: 'http://example.com/small-image-url.png',
            //   largeImageUrl: 'http://example.com/large-image-url.png'
            // })
            .keepSession()
            .get()
        }
        return 'All this shit';

        }
      // Text messages returns a simple text. In case you don't need to add
      // quick responses reply with a simple text and Cluaudia Bot Builder will
      // do the rest.
      return payload.utterance;
    }).catch((error) => {
      Console.warn(error);
      return 'Sorry, I seem to be having some trouble finding that right now. In the meantime, why not check on our website: regmovies.com';
    });
  }
  return 'No response from AI';
},
{ platforms: ['facebook', 'slackSlashCommand', 'alexa'] }
);

module.exports = api;
