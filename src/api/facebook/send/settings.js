import { putDocument, getDocument } from '../../../../api/aws/dynamo';
import { sendTextPayload, sendButtonPayload } from '../../../facebook/send';
import { getTheatreLocationsZip, getTheatreLocationsLatLng } from '../../query';
import { sendTheatreLocationPayload } from '../send/theatres';
//import { ICityData } from '../../../../helpers/cities';

/**
 * If we're given a zip code in the settings intent, we're going to
 * assume that the user wishes to change their default theature.
 *
 * This is strictly for the demo, as future use cases would assume
 * that they may want to look up times in another location. Who
 * knows---needs strategy which will guide the future implementation.
 */
export function sendSettingsZipIntent(senderId: string, zip: number) {
    return getTheatreLocationsZip(zip).then(locations => {
        return sendTheatreLocationPayload(senderId, locations);
    });
}

export function sendSettingsLatLng(senderId: string, lat: number, lng: number) {
  return getTheatreLocationsLatLng(lat, lng).then(locations => {
    return sendTheatreLocationPayload(senderId, locations)
  })
}

/**
 * Likewise for zip, we're going to assume that the user wishes to change
 * their default theatre, or view movies playing at a given theatre.
 */
// export function sendSettingsCityIntent(senderId: string, city: ICityData) {
//     return getTheatreLocationsZip(city.zip).then(locations => {
//         if (!locations) {
//             return sendTextPayload(senderId,
//                                    `Unable to find theatre locations for ${city.city}, ${city.state}`);
//         }
// 
//         return sendTheatreLocationPayload(senderId, locations);
//     });
// }

export function sendSettingsPayload(senderId: string) {
    return getDocument({
        TableName: 'regalbot',
        Key: { senderId }
    }).then(document => {
        const theatreLocation = document.Item ? document.Item[`theatreLocation`] : void 0;
        const theatreCode = document.Item ? document.Item[`theatreCode`] : void 0;
        const theatreName = document.Item ? document.Item[`theatreName`] : void 0;

        if (!theatreCode) {
            return sendTextPayload(
                senderId,
                `It looks like you haven't registered a default theatre yet.\n\n` +
                `Ask me questions like "What is playing in Washington, DC?" to get started.`);
        }

        return sendButtonPayload(senderId, [
            'Current Theatre:',
            '',
            theatreName,
            theatreLocation
        ].join('\n'), [
            {
                type: 'postback',
                title: 'Change Theatre',
                payload: JSON.stringify({
                    type: 'REQUEST_ZIP'
                })
            }
        ]);
    });
}
