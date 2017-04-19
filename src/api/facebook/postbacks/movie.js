//
// Postback handlers for any single "movie" query
//

import * as moment from 'moment';
import { sendShowtimesPayload } from '../send/showtimes';
import { sendTextPayload, sendVideoPayload } from '../../../facebook/send';
import { IMovieDetail, getMovieShowtimes } from '../../query';
import { randomResponse, listOfCannotFindShowtimesResponses } from '../intents/responseContent';

//
// postback 'MOVIE_SHOWTIMES'
//
interface IMovieShowtimePayload {
    theatreCode: string;
    title?: string;
    masterMovieCode: string;
    date: string;
    time?: string[];
}

//
// postback 'MOVIE_DESCRIPTION'
//
interface IMovieDescription {
    title: string;
    description: string;
}

export function getMovieDescription(movieDesc: IMovieDescription): string {
    return `${movieDesc.title}\n\n${movieDesc.description}`;
}

export function sendMovieDescription(senderId: string, payload: IMovieDescription): Promise<{}> {
    return sendTextPayload(senderId, getMovieDescription(payload));
}

//
// postback 'GET_MOVIES'
//

interface IGetMoviesPayload {
    theatreCode: string;
}

interface IWatchEmbedTrailerPayload {
    url: string;
    title: string;
}

export function sendWatchTrailer(senderId: string, payload: IWatchEmbedTrailerPayload): Promise<{}> {
    return sendTextPayload(senderId, `Alright, fetching the trailer for ${payload.title}, just a moment...`).then(() => {
        return sendVideoPayload(senderId, payload.url);
    });
}
