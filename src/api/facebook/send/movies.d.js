import { IMovieDetail, IShowtimes } from '../../query';
export declare function sendMoviePayload(senderId: string, movies: IMovieDetail[], theatreCode: string, date: Date): Promise<{}>;
export declare function sendSingleMoviePayload(senderId: string, movie: IShowtimes, theatreCode: string, date: Date): Promise<{}>;
