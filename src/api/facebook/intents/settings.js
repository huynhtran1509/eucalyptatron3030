import { compose, defaultTo, find, prop, propEq } from 'ramda';
import { sendSettingsPayload, sendSettingsZipIntent } from '../send/settings';

import { ILuisData } from '../../luis/interfaces';

export default function handleSettingsIntent(message: any, luisData: ILuisData): Promise<{}> {
  const senderId = message.sender.id;

    // @TODO extract this
    // See issue #16
  const getEntity = type => compose(
        defaultTo({}),
        find(propEq('type', type)),
        prop('entities')
    )(luisData);

  const getEntityValue = compose(prop('entity'), getEntity);
  const getEntityResolution = compose(prop('resolution'), getEntity);

  const luisZip = getEntityValue('zip');

  if (luisZip) {
    return sendSettingsZipIntent(senderId, parseInt(luisZip, 10)/* 😱*/);
  }

    // const cityData = getCityDataFromUtterance(message.message.text);
    //
    // if (cityData) {
    //     return sendSettingsCityIntent(senderId, cityData);
    // }

  return sendSettingsPayload(senderId);
}
