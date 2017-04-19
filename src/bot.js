/**
 * @flow
 */
// const promiseDelay = require('promise-delay');
// const aws = require('aws-sdk');
// const lambda = new aws.Lambda();
import { /*showLocationQuickReplyButton,*/ showQuickReplyForErrorHandling } from './api/facebook/send/quickReply';
import { sendTextPayload } from './handlers/facebook/send';
import { sendSingleMoviePayload, sendMoviePayload } from './api/facebook/send/movies'



const lambda = require('aws-lambda-invoke');

const botBuilder = require('claudia-bot-builder');

const stackTrace = require('stack-trace');

const R = require('ramda');

// const slackDelayedReply = botBuilder.slackDelayedReply;
const getIntentName = alexaPayload =>
    alexaPayload &&
    alexaPayload.request &&
    alexaPayload.request.type === 'IntentRequest' &&
    alexaPayload.request.intent &&
    alexaPayload.request.intent.name;
    
function sendMNLPUtterance(mnlpUtterance?: string) {
    if (mnlpUtterance) {

        return sendTextPayload(mnlpUtterance)
    } else {
        return false;
    }
}


const api = botBuilder((message, apiRequest) => {
  const Console = {};
  Console.log = console.log.bind(null, '[LOG]');
  Console.info = console.info.bind(null, '[INFO]');
  Console.error = console.error.bind(null, '[ERROR]');
  Console.warn = console.warn.bind(null, '[WARN]');

  Console.info(message, apiRequest);
  Console.log(apiRequest.body);
// TODO: use http://ramdajs.com/0.23.0/docs/#evolve

  const requestData = {
    'user-id': {
      type: message.type,
      ID: message.sender
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
      intents: [{
        intent: 'SeekShowtime',
        score: 1
      }],
      entities: []
    }
  };

  const shapeData = transformations => R.evolve(transformations, requestData);

  if (message.text) {
    return new Promise((resolve, reject) => {
      lambda.raw.invoke({
        FunctionName: 'ca2',
        Payload: JSON.stringify(requestData),
      }, (err, done) => {
        if (err) {
          const trace = stackTrace.parse(err);
          Console.warn(err);
          Console.error(trace);
          return reject(err);
        }
        Console.info(done);
        resolve(done);
        return true;
      });
    }).then((mnlpData) => { // continunity sez
      const payload = JSON.parse(mnlpData.Payload);
      Console.log(payload.utterance);

      if (mnlpData.errorMessage) {
        throw new Error(mnlpData.errorMessage);
      }

      if (mnlpData.Recovery) {
          // showQuickReplyForErrorHandling(senderId, mnlpData.utterance);
        return showQuickReplyForErrorHandling(message.sender, mnlpData.utterance);
      }

      if (mnlpData.AskLocation) {

          // return showLocationQuickReplyButton(senderId, mnlpData.utterance)
      }

      if (mnlpData.ShowtimesFlat) {
        return Promise.all([
          sendMNLPUtterance(mnlpData.context.user_id, mnlpData.utterance),
          sendMoviePayload(mnlpData.context.user_id, mnlpData.ShowtimesFlat, theatreCode, new Date())
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

      return payload.utterance;
    }).catch((error) => {
      const trace = stackTrace.parse(error);
      Console.warn(error);
      Console.error(trace);
      return 'Could not setup';
    });
  } else if (getIntentName(apiRequest.body) === 'ExitApp') {
    return {
      response: {
        outputSpeech: {
          type: 'PlainText',
          text: 'Bye from RegalBot!'
        },
        shouldEndSession: true
      }
    };
  }
  return {};
},
{ platforms: ['facebook', 'slackSlashCommand', 'alexa'] }
);

module.exports = api;
