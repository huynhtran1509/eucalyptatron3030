import pingHandler from './src/handlers/ping';
import fbVerifyTokenHandler from './src/handlers/facebook/verify-token';
import fbWebhookHandler from './src/handlers/facebook/webhook';
import { messageReceivedHandler, postbackHandler } from './src/api/regal/facebook/fbMessageHandlers';
import { sendTextPayload } from './src/api/facebook/send';
import { isMessageReceivedEntry, isPostbackEntry } from './src/handlers/facebook/webhook-interface';
import { showGreetingText, showGetStartedButton } from './src/api/facebook/thread'
/*
   Entry point for AWS
   
   Wrap handler and bind log levels for easier filtering of cloudwatch logs written from lambda functions

*/
export function handler(event, context, callback){
  console.log = console.log.bind(null, '[LOG]');
  console.info = console.info.bind(null, '[INFO]');
  console.error = console.error.bind(null, '[ERROR]');
  console.warn = console.warn.bind(null, '[WARN]');
  
  main(event, context, callback);
}

function main(event, context, callback) {
    // Add as many types of event types as your wish. If you
    // need to support Slack, SMS, or other interfaces this
    // is where you would tie it in.
    //
    // The "ping" handler is for testing purposes and serves
    // as the bare minimum interface for testing. It does not
    // reach out to any clients.
    //
    console.log(event, context, callback);
    const proc = (() => {
        switch (event.type) {
            case 'ping':
                return pingHandler();
            case 'fb-verify-token':
                return fbVerifyTokenHandler(event.payload);
            case 'fb-webhook':
                return fbWebhookHandler(event.payload, {
                    received: messageReceivedHandler,
                    postback: postbackHandler,
                    delivered: () => Promise.resolve(),
                    authentication: () => Promise.resolve()
                });
        }

        return Promise.reject(new Error('Invalid Event Provided'));
    })();

    proc.then(showWelcomeScreen).then((result) => {
        // We always want to return a string from this handler
        // and avoid blindly calling stringify on something that's
        // already a string
        const response = typeof result === 'object' ? JSON.stringify(result) : result;
        callback(null, response);
    }).catch((error) => {
        return Promise.all([
            logError(error),
             apologize(event)
        ]).then(() => callback(error))
          .catch(() => callback(error));
    });
}

/*
   Log the error so we can debug it later.

   @TODO Add in AWS alert's here.
   See issue #12
*/
function logError(error) {
    console.error(error);
    console.log(error.stack);
}

/*
   Send out a message to all clients in this current payload
   and apoligize for the error.
 */
function apologize(event) {
    const msg = `Sorry, I seem to be having some trouble finding that right now. In the meantime, why not check on our website: www.regmovies.com`;

    /*
       FB clients
     */
    if (event.type === 'fb-webhook') {
        // Only respond to user actions and _not_ message delivered
        // or authentication entries
        return Promise.all(event.payload.entry.map((entry) => {
            if (isPostbackEntry(entry)) {
                return entry.messaging.map((message) => {
                    const senderId = message.sender.id;
                    return sendTextPayload(senderId, msg);
                });
            }

            if (isMessageReceivedEntry(entry)) {
                return entry.messaging.map((message) => {
                    const senderId = message.sender.id;
                    return sendTextPayload(senderId, msg);
                });
            }
        }));
    }

    return Promise.reject(new Error('No suitable client to apologize to'));
}

function showWelcomeScreen() {
  return Promise.all([
    showGreetingText(),
    showGetStartedButton()
  ])
}
