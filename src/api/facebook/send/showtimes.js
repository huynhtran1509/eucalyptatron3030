import moment from 'moment/src/moment';
import { send, sendButtonPayload, sendTextPayload, IButton, ISendAPIRequest } from '../../../facebook/send';
import { getMovieButtons, getMoviesButton, viewRegalMoviesButton, getPurchaseButton, setTheatreLocationButton } from '../buttons';
import { IMovieDetail,  getMovieShowtimes, IPerformance } from '../../../handlers/query';
import { getMoviePrediction } from '../../helpers/movies';
//import {} from /Users/jamesfishwick/Documents/regal-bot/src/api/regal/query.ts

export function sendShowtimesPayload(senderId: string, performances: IPerformance[]): Promise<{}> {

    const request: ISendAPIRequest = {
        recipient: { id: senderId },
        message: {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'generic',
                    // @TODO we need a "load more" functionality.
                    // See issue #3
                    elements: performances.map(s => {
                        const dateStr = moment(s.CalendarShowTime).format('dddd MMM Do');
                        const subtitle = "${dateStr} at ${s.time}";

                        return {
                            title: `${s.Title}`,
                            subtitle,
                            buttons: [
                                getPurchaseButton(s)
                             ]
                        };
                    }).slice(0, 9)
                }
            }
        }
    };

    return send(request);
}

/*
   This function is responsible for responding to a user who
   is requesting showtimes for a movie.

   @param movie -  the raw movie string parsed from LUIS
   @param date - what date the user request showtimes for
 */
// export function sendShowtimesForMovie(senderId: string, theatreCode: string, userMovieTitle: string, date: Date): Promise<{}> {
//     return getSimpleMovies(theatreCode, date).then(movies => {
//         const moviePrediction = getMoviePrediction(userMovieTitle, movies);
// 
//         // Add in a filter for distances that are too low
//         // and most likely not what the user is looking for
// 
//         const prettyDate = moment(date).format('dddd, MMMM Do');
// 
//         if (moviePrediction.score < 0.8) {
//             // Get the Friday for this week
//             const thisFriday = moment(date).day('Friday');
//             // Is the current date given already this Friday?
//             const isFriday = thisFriday.isSame(moment(date), 'day');
// 
//             // If the given date is Friday, there isn't any other
//             // checks that we have to do. Respond with the reason
//             // and a link for the user to search for movies
//             if (isFriday) {
//                 return sendButtonPayload(
//                     senderId,
//                     `I was unable to find showtimes for "${userMovieTitle}" on ${prettyDate}`,
//                     [
//                         getMoviesButton(theatreCode),
//                         viewRegalMoviesButton()
//                     ]);
//             }
// 
//             return sendTextPayload(
//                 senderId,
//                 `Unable to find showtimes for "${userMovieTitle}" on ${prettyDate}\n\n` +
//                 `I'll check Friday showtimes for you.`).then(() =>
//                     sendShowtimesForMovie(senderId, theatreCode, userMovieTitle, thisFriday.toDate()));
//         }
// 
//         // Once we picked that movie, it's simply a matter of
//         // querying for its showtime & sending it to the user.
//         return getMovieShowtimes(
//             theatreCode,
//             moviePrediction.movie.masterMovieCode, date
//         ).then(simpleShowtimes => {
//             return sendShowtimesPayload(senderId, simpleShowtimes);
//         });
//     });
// }
