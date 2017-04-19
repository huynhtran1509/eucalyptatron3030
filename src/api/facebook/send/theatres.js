import { getMapImageUrl } from '../../../google/maps';
import { send, IButton, ISendAPIRequest } from '../../../facebook/send';
import { getMovieButtons, getPurchaseButton, setTheatreLocationButton, getMoviesButton } from '../buttons';
import { ITheatreLocation } from '../../query';

export function sendTheatreLocationPayload(userId: string, theatreLocations: ITheatreLocation[]): Promise<{}> {
    const request: ISendAPIRequest = {
        recipient: { id: userId },
        message: {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'generic',
                    // @TODO we need a "load more" functionality.
                    // See issue #3
                    elements: theatreLocations.map(loc => {
                        return {
                            title: loc.Name,
                            image_url: getMapImageUrl(loc.Address),
                            subtitle: loc.Address,
                            buttons: [
                                getMoviesButton(loc.TheatreCode, `What's playing?`),
                                setTheatreLocationButton(loc)
                            ]
                        };
                    }).slice(0, 9)
                }
            }
        }
    };

    return send(request);
}
