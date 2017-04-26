import { ILuisData } from './interfaces';

const axios = require('axios');

export default function query(luisAPIRoot: string, utterance: string): Promise<ILuisData> {
  return axios.get(luisAPIRoot, {
    params: { q: utterance }
  }).then(res => res.data).catch((response) => {
    throw new Error(JSON.stringify(response.data));
  });
}
