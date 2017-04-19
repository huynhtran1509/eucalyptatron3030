/*
   See:

   https://developers.facebook.com/docs/messenger-platform/webhook-reference#auth
 */

export interface IMessaging {
    sender: { id: string; };
    recipient: { id: string; };
}

interface quickReplyLocationCoordinates {
  lat: number;
  long: number;
}

export interface IMessagingReceived extends IMessaging {
    message: {
        mid: string; // message id
        seq: number; // message sequence number
        text?: string; // text of the message
        attachments?: Array<{
            type: 'image' | 'video' | 'audio' | 'location',
            payload: {
                url?: string;
                coordinates?: quickReplyLocationCoordinates;
            }
        }>
    };
}

export interface IMessagingDelivered extends IMessaging {
    delivery: {
        mids?: string[]; // array of message ids. not always present
        watermark: number; // All messages that were sent before this timestamp were delivered
        seq: number; // sequence number
    }
}

export interface IMessagingPostback extends IMessaging {
    timestamp: number;
    // payload parameter that was defined w/ button
    postback: { payload: string; }
}

interface ICommonMessageEntry {
    id: number;
    time: number;
}

export interface IAuthenticationEntry extends ICommonMessageEntry {
    optin: {
        // data-ref parameter that was defined with the entry point
        ref: string;
    };
    messaging: IMessaging[];
}

export interface IMessageReceivedEntry extends ICommonMessageEntry {
    messaging: IMessagingReceived[];
}


export interface IMessageDeliveredEntry extends ICommonMessageEntry {
    messaging: IMessagingDelivered[];
}

export interface IPostbackEntry extends ICommonMessageEntry {
    messaging: IMessagingPostback[];
}

export interface IGenericCallback {
    object: 'page';
    entry: {}[];
}

export function isAuthenticationEntry(entry): entry is IAuthenticationEntry {
    return entry && entry.optin && entry.optin.ref;
}

export function isMessageReceivedEntry(entry): entry is IMessageReceivedEntry {
    return entry.messaging &&
           entry.messaging[0] &&
           entry.messaging[0].message;
}

export function isMessageDeliveredEntry(entry): entry is IMessageDeliveredEntry {
    return entry.messaging &&
           entry.messaging[0] &&
           entry.messaging[0].delivery;
}

export function isPostbackEntry(entry): entry is IPostbackEntry {
    return entry.messaging &&
           entry.messaging[0] &&
           entry.messaging[0].timestamp &&
           entry.messaging[0].postback;
}
