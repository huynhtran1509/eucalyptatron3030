import { IGenericCallback, IAuthenticationEntry, IMessageReceivedEntry, IMessageDeliveredEntry, IPostbackEntry, isAuthenticationEntry, isMessageReceivedEntry, isMessageDeliveredEntry, isPostbackEntry, IMessaging, IMessagingReceived, IMessagingDelivered, IMessagingPostback } from './webhook-interface';

type MessageAuthenticationHandler = (message: IMessaging) => Promise<{} | void>;
type MessageReceivedHandler = (message: IMessagingReceived) => Promise<{} | void>;
type MessageDeliveredHandler = (message: IMessagingDelivered) => Promise<{} | void>;
type MessagePostbackHandler = (message: IMessagingPostback) => Promise<{} | void>;

function handleAuthenticationEntry(entry: IAuthenticationEntry, messageHandler: MessageAuthenticationHandler): Promise<{}> {
    return Promise.all(entry.messaging.map((message) => messageHandler(message)));
}

function handleMessageDeliveredEntry(entry: IMessageDeliveredEntry, messageHandler: MessageDeliveredHandler): Promise<{}> {
    return Promise.all(entry.messaging.map((message) => messageHandler(message)));
}

function handleMessageReceivedEntry(entry: IMessageReceivedEntry, messageHandler: MessageReceivedHandler): Promise<{}> {
    return Promise.all(entry.messaging.map((message) => messageHandler(message)));
}

function handlePostbackEntry(entry: IPostbackEntry, messageHandler: MessagePostbackHandler): Promise<{}> {
    return Promise.all(entry.messaging.map((message) => messageHandler(message)));
}

interface IMessageHandlers {
    authentication?: MessageAuthenticationHandler;
    received: MessageReceivedHandler;
    delivered?: MessageDeliveredHandler;
    postback?: MessagePostbackHandler;
}

export default function handler(payload: IGenericCallback, messageHandlers: IMessageHandlers): Promise<{}> {
    const proc = payload.entry.map((entry) => {
        if (isAuthenticationEntry(entry)) {
            return handleAuthenticationEntry(entry, messageHandlers.authentication);
        }

        if (isMessageDeliveredEntry(entry)) {
            return handleMessageDeliveredEntry(entry, messageHandlers.delivered);
        }

        if (isMessageReceivedEntry(entry)) {
            return handleMessageReceivedEntry(entry, messageHandlers.received);
        }

        if (isPostbackEntry(entry)) {
            return handlePostbackEntry(entry, messageHandlers.postback);
        }
    });

    return Promise.all(proc);
};
