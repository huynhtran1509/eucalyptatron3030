import moment from 'moment/src/moment';
import { compose, defaultTo, find, prop, propEq, path } from 'ramda';
//import { getCityDataFromUtterance } from '../../../../helpers/cities';
import { sendSettingsZipIntent, sendSettingsPayload } from '../send/settings';

import { IMessagingReceived } from '../../../../handlers/facebook/webhook-interface';
import { ILuisData } from '../../../luis/interfaces';

export default function handleSettingsIntent(message: IMessagingReceived, luisData: ILuisData): Promise<{}> {
    const senderId = message.sender.id;

    // @TODO extract this
    // See issue #16
    const getEntity = (type) => compose(
        defaultTo({}),
        find(propEq('type', type)),
        prop('entities')
    )(luisData);

    const getEntityValue = compose(prop('entity'), getEntity);
    const getEntityResolution = compose(prop('resolution'), getEntity);

    const luisZip = getEntityValue('zip');

    if (luisZip) {
        return sendSettingsZipIntent(senderId, parseInt(luisZip, 10)/*😱*/);
    }

    // const cityData = getCityDataFromUtterance(message.message.text);
    // 
    // if (cityData) {
    //     return sendSettingsCityIntent(senderId, cityData);
    // }

    return sendSettingsPayload(senderId);
}
