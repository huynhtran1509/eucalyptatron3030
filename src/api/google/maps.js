/**
 * @flow
 */
const axios = require('axios');

export function getMapImageUrl(address: string) {
  return `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(address)}&zoom=16&size=800x600&markers=color:blue%7Clabel:%7C${encodeURIComponent(address)}&key=AIzaSyAsbE-YdnEYTcLR8kAnmURwpk9qyI34B6Y`;
}

interface LatLng {
    lat: number;
    lng: number;
}

interface IGeocodeAPIResponse {
    status: 'OK' | 'ERROR';
    results: Array<{
        address_components: Array<{
            long_name: string;
            short_name: string;
            types: string[];
        }>,
        formatted_address: string;
        geometry: {
            bounds: {
                northeast: LatLng;
                southwest: LatLng;
            },
            location: LatLng;
            location_type: 'APPROXIMATE' | 'EXACT';
            viewport: {
                northeast: LatLng;
                southwest: LatLng;
            }
        },
        place_id: string;
        types: string[];
    }>
}

export function getGeocode(address: string): Promise<IGeocodeAPIResponse> {
  const requestUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

  return axios.get(requestUrl, {
    params: { address }
  }).then(res => res.data).catch((response) => {
    throw new Error(JSON.stringify(response.data));
  });
}
