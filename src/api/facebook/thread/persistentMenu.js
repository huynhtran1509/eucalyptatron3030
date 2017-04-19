import { upsertPersistentMenu, IPersistentMenuItem } from '../../../facebook/thread';
import { getTheatreCode } from '../../helpers/theatre';
import { IMessagingReceived } from '../../../../handlers/facebook/webhook-interface';

export function showAuthenticatedMenu(senderId: string): Promise<{}> {
    return getTheatreCode(senderId).then(theatreCode => {
        let menuItems: IPersistentMenuItem[] = [{
            type: "postback",
            title: "Change Default Theatre",
            payload: JSON.stringify({
                type: 'VIEW_SETTINGS'
            })
        }, {
            type: "web_url",
            title: "Regal Website ↗",
            url: "http://www.regmovies.com/"
        }, {
            type: "postback",
            title: "RCC Status",
            payload: JSON.stringify({
                type: 'RCC'
            })
        }];

        if (theatreCode) {
            menuItems.unshift({
                type: "postback",
                title: "What's playing?",
                payload: JSON.stringify({
                    type: 'GET_MOVIES',
                    payload: { theatreCode: theatreCode }
                })
            });
        }

        return upsertPersistentMenu(menuItems);
    });
}

export function showUnauthenticatedMenu(senderId: string): Promise<{}> {
    return getTheatreCode(senderId).then(theatreCode => {
        const menuItems: IPersistentMenuItem[] = [{
            type: "web_url",
            title: "Regal Website ↗",
            url: "http://www.regmovies.com/"
        }];

        return upsertPersistentMenu(menuItems);
    });
}
