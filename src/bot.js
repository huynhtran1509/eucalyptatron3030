const promiseDelay = require('promise-delay');
const aws = require('aws-sdk');
const lambda = new aws.Lambda();
const botBuilder = require('claudia-bot-builder');
const slackDelayedReply = botBuilder.slackDelayedReply;
// async function invoke(functionName, requestData) {
//   console.log('INVOKE', requestData);
//   return new Promise((resolve) => lambda.invoke(functionName, requestData)
//   .then((result) => {
//     console.log(result);
//   }
//     {
//   FunctionName: functionName,
//   Payload: JSON.stringify(requestData),
// }, (err, data) => {
//   if (err) {
//     context.fail(err);
//     reject(err);
//   } else {
//     context.succeed(`Lambda_B said ${data.Payload}`);
//     resolve(data);
//   }
// }
// ));
// }

const api = botBuilder((message, apiRequest) => {
  console.log = console.log.bind(null, '[LOG]');
  console.info = console.info.bind(null, '[INFO]');
  console.error = console.error.bind(null, '[ERROR]');
  console.warn = console.warn.bind(null, '[WARN]');

  console.info('REQUEST', message);
  console.info('ORIG', apiRequest);

  const requestData = {
    'user-id': {
      type: message.originalRequest.type,
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

  return new Promise((resolve, reject) => {
    lambda.invoke({
      FunctionName: 'ca2',
      InvocationType: 'Event',
      Payload: JSON.stringify(requestData)
    }, (err, done) => {
      console.info('INFO', err);
      console.info('DONE', done);
      if (err) return reject(err);
      resolve(done);
    });
  }).then((result) => { // the initial response
    console.log(result);
    return "Ok, I'll ping you";
  }).catch((error) => {
    console.error(error);
    return 'Could not setup';
  });
});

module.exports = api;
