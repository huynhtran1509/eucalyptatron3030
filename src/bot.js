/**
 * @flow
 */
 import { showQuickReplyForErrorHandling } from './api/facebook/send/quickReply';
 import { sendSingleMoviePayload, sendMoviePayload } from './api/facebook/send/movies';
// const promiseDelay = require('promise-delay');

// const aws = require('aws-sdk');
 const R = require('ramda');
 const botBuilder = require('claudia-bot-builder');
 const lambda = require('aws-lambda-invoke');


// const lambda = new aws.Lambda();


// const slackDelayedReply = botBuilder.slackDelayedReply;
 const getIntentName = alexaPayload =>
    alexaPayload &&
    alexaPayload.request &&
    alexaPayload.request.type === 'IntentRequest' &&
    alexaPayload.request.intent &&
    alexaPayload.request.intent.name;

 function sendMNLPUtterance(mnlpUtterance?: string) {
   if (mnlpUtterance) {
     return mnlpUtterance;
   }
   return false;
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
           Console.warn(err);
           return reject(err);
         }
         Console.info(done);
         resolve(done);
         return true;
       });
     }).then((mnlpData) => { // continunity sez
       const payload = JSON.parse(mnlpData.Payload);
       Console.log(mnlpData);

       if (mnlpData.errorMessage) {
         throw new Error(mnlpData.errorMessage);
       }

       if (mnlpData.Recovery) {
          // showQuickReplyForErrorHandling(message.sender, mnlpData.utterance);
         return showQuickReplyForErrorHandling(message.sender, mnlpData.utterance);
       }

       if (mnlpData.AskLocation) {

          // return showLocationQuickReplyButton(message.sender, mnlpData.utterance)
       }

       if (mnlpData.ShowtimesFlat) {
         return Promise.all([
           sendMNLPUtterance(mnlpData.utterance),
           sendMoviePayload(mnlpData.context.user_id, mnlpData.ShowtimesFlat, mnlpData.sessions.facets['ity.location']['ity.code'], new Date())
         ]);
       }

       if (mnlpData.Showtimes) {
          // get performance arrays from each Showtime and flatten them
         const performances = [].concat.apply([], mnlpData.Showtimes.map(obj => obj.Performances));
         return Promise.all([
           sendMNLPUtterance(message.sender, mnlpData.utterance),
           sendSingleMoviePayload(message.sender, performances, mnlpData.sessions.facets['ity.location']['ity.code'], new Date())
         ]);
       }
      // Text messages returns a simple text. In case you don't need to add
      // quick responses reply with a simple text and Cluaudia Bot Builder will
      // do the rest.
       return payload.utterance;
     }).catch((error) => {
       Console.warn(error);
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
