const url = require('url');

//
// AWS
//

export const AWS_REGION = 'us-east-1';
export const AWS_REGALBOT_API_GATEWAY_BASE = process.env.AWS_REGALBOT_API_GATEWAY_BASE || 'https://m7b20rb86k.execute-api.us-east-1.amazonaws.com/dev'

//
// LUIS
//

export const LUIS_API_ROOT = process.env.LUIS_API_ROOT || 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/c35eb522-f30a-4eef-9a8f-79926b6bbd76?subscription-key=92779c851cdd400ab8ea44ead3b93241&verbose=true';

//
// FACEBOOK
//

/* Insert this token in the "Verify Token" field on Facebook when
   setting up the webhook. */
export const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN || 'reagal-fb-verify-token-totes-legit';
export const FB_GRAPH_API_ROOT = 'https://graph.facebook.com/v2.6';

/* I am literally the worst */
export const FB_PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN || 'EAAKPNZCDsA5EBAKTWn1M1fFKznklqdZBHL5RvvXBwIzN0Cif05q24GOZC41yFbBeaR32COWJKZAlRNBB5YK9DJCpz5ACAqAqL7hyw7m3YxtxHJue0LW2wOew6QNoudfiLfH9G4Cm9fJrZAXyHUEywQKgy7CyzTXnQXTutc2ZBzFQZDZD';


//
// REGAL
//

/*
   Super bad. Will remove from git with

   https://rtyley.github.io/bfg-repo-cleaner/
*/
export const REGAL_API_ROOT = 'https://api.regmovies.com/v1';
export const REGAL_AUTH_USER = process.env.REGAL_AUTH_USER || 'MobileApp1410';
export const REGAL_OCP_APIM_SUBSCRIPTION_KEY = process.env.REGAL_OCP_APIM_SUBSCRIPTION_KEY || '7e924cd46dbf4284836b97bd73606285';
export const REGAL_ONELINK_DEEPLINK_BASE = process.env.REGAL_ONELINK_DEEPLINK_BASE || 'https://regmovies.onelink.me/4207629222';
export const REGAL_ONELINK_PID = process.env.REGAL_ONELINK_PID || 'TestDeepLinks';

export function getTicketPurchaseDeepLinkUrl(date: Date, theatreCode: string, webUrl: string, performanceId: number) {
    const urlDate = date.toISOString().split('T')[0];
    const mobileUrl = `regmovies://checkout/${theatreCode}/${urlDate}/${performanceId}`;
    const combineUrl = url.parse(REGAL_ONELINK_DEEPLINK_BASE, true);
    combineUrl.query = {
        pid: REGAL_ONELINK_PID,
        af_dp: mobileUrl, // mobile link snippet
        af_web_dp: webUrl // web link snippet
    };

    return combineUrl.format();
}
