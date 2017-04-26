const moment = require('moment');
const axios = require('axios');
const urlLib = require('url');

import { AWS_REGALBOT_API_GATEWAY_BASE, REGAL_API_ROOT, REGAL_AUTH_USER, REGAL_OCP_APIM_SUBSCRIPTION_KEY } from '../config';
const { any, filter, map, compose, values } = require('ramda');

export function query(url: string, queryParams?: { [key: string]: any }): Promise<{}> {
  return axios.get(url, {
    params: queryParams,
    headers: {
      'Ocp-Apim-Subscription-Key': REGAL_OCP_APIM_SUBSCRIPTION_KEY,
      AuthUser: REGAL_AUTH_USER
    }
  }).then(res => res.data).catch((response) => {
    const status = response.status;
    const errorData = JSON.stringify(response.data);
    throw new Error(`data: ${errorData}\nstatus: ${status}`);
  });
}

export type RegalDateTime = string; // YYYY-MM-DDTHH:MM:SS

export interface ITheatreLocation {
    TheatreCode: string;
    Name: string;
    Address: string;
    City: string;
    State: string;
    Zipcode: string;
    Phone: string;
    IANATimezone: string;
    Latitude: number; // float
    Longitude: number; // float
    StraightLineDistanceMiles: number; // float
    Priority: number;
    FandangoID: string;
    EDIID: string;
    AmenitiesList: Array<{ [key: string]: any }>
}

interface IMedia {
    Id: number;
    Type: 'Image' | 'Video',
    SubType: 'TV_SmallPosterImage' | 'POS_PortraitTopPane' | 'TV_TopShelfPosterImage' | 'TV_LargePosterImage' | 'TV_CarouselFeature' | 'TV_FullScreenFeature' | 'Trailer' | 'Trailer_Youtube' | 'Mobile_MovieFeed',
    Url: string;
    Title: string;
    Description: string;
    DimensionHeight: string;
    DimensionWidth: string;
    Format: string;
    MovieCode: string;
    FileSize: string; // bytes?
}

export interface IMovieDetail {
    FilmCode: string;
    RentrakID: string;
    Title: string;
    Rating: string;
    OpeningDate: RegalDateTime;
    RegalOpeningDate: RegalDateTime;
    Duration: number;
    Description: string;
    LongDescription: string;
    Studio: string;
    GraphicUrl: string;
    TrailerUrl: string;
    TwitterTag: string;
    Actors: string[];
    Directors: string[];
    GenrePrimary: string;
    GenreSecondary: string;
    Media: IMedia[];
    theatreCode?: string;
    masterMovieCode?: string;
}

export interface IPerformance {
    SortHashCode?: string;
    Auditorium?: number;
    VistaMovieCode?: string;
    MasterMovieCode?: string;
    Title: string;
    CalendarShowTime?: RegalDateTime;
    PerformanceAttributes?: string[],
    PerformanceId: number;
    Status: string;
    Display: boolean;
    SneakPreview: boolean;
    StopSales: boolean;
    SeatAllocationType: string;
    PaymentGroupCode: string;
    PaymentGroupName: string;
    AdvertiseMovieCode: string;
    BizDateShowTime: string;
    AdvertiseShowTime: string;
    AdvertiseSortOrder: string;
    AdvertiseAmenityID?: string;
    PerformanceLastUpdated?: RegalDateTime;
    ScheduleBusinessDay?: RegalDateTime;
    ScheduleActiveDate?: RegalDateTime;
    ScheduleDateCreatedGMT?: RegalDateTime;
    PurchaseURL: Array<{
        Fandango: string,
        Flixster: string;
    }>;
    PerformanceGroup: string;
}

interface IFlatShowtimes {
    TheatreCode: string;
    AdvertiseShowDate: RegalDateTime;
    Performances: IPerformance[];
    movie: IMovieDetail[];
}

export interface IShowtimes {
    Title: string;
    ScheduleBusinessDay: string;
    Performances: IPerformance[];
    MasterMovieCode: string,
    SortHashCode:'string'
}
//
// "Pure" Regal API calls
//

export function getTheatreLocationsZip(zip: number): Promise<ITheatreLocation[]> {
  return query(`${REGAL_API_ROOT}/MTS/TheatreLocations/${zip}`);
}

export function getTheatreLocationsLatLng(lat: number, lng: number): Promise<ITheatreLocation[]> {
  return query(`${REGAL_API_ROOT}/MTS/TheatreLocations/${lat}/${lng}`);
}

export function getFlatShowtimes(theatreCode: string, businessDate: Date): Promise<IFlatShowtimes[]> {
  const date = moment(businessDate).format('YYYY-MM-DD');
  return query(`${REGAL_API_ROOT}/MTS/ShowtimesFlat/${theatreCode}/${date}`);
}

export function getMovieDetails(masterMovieCode: string): Promise<IMovieDetail> {
  return query(`${REGAL_API_ROOT}/MTS/Movies/${masterMovieCode}`);
}


//
// Our custom functions
//

export function getShowtimeDate(showtimeString: string): Date {
  const hour24 = parseInt(showtimeString.substring(0, 2), 10);
  const minute24 = parseInt(showtimeString.substring(2, 4), 10);

  const date = new Date();
  date.setHours(hour24);
  date.setMinutes(minute24);

  return date;
}


export interface IMovieDetail {
    theatreCode?: string;
    businessDate: Date;
    FilmCode: string;
    title: string;
    posterUrl?: string;
    embedTailerUrl?: string;
    youtubeTrailerUrl?: string;
    longDescription?: string;
    genre?: string;
    genre_secondary?: string;
    rating?: string;
    duration?: number;
}

export function getSimpleMovies(theatreCode: string, businessDate: Date): Promise<IMovieDetail[]> {
  return getFlatShowtimes(theatreCode, businessDate).then((showtimes) => {
        // Pull out the base data that we need from the
        // Regal API results.
    const baseData: IMovieDetail[] = values(showtimes.reduce((acc, showtime) => {
      showtime.Performances.forEach((p) => {
        acc[p.MasterMovieCode] = {
          theatreCode,
          businessDate,
          masterMovieCode: p.MasterMovieCode,
          title: p.Title
        };
      });

      return acc;
    }, {}));

    return baseData;
  });
}

export function getMovieShowtimes(theatreCode: string, masterMovieCode: string, businessDate: Date): Promise<IShowtimes[]> {
  return getFlatShowtimes(theatreCode, businessDate).then(showtimes => showtimes.reduce((acc, showtime) => {
    showtime.Performances.filter(p => p.MasterMovieCode === masterMovieCode).forEach((p) => {
      const date = getShowtimeDate(p.AdvertiseShowTime);

      return acc.push({
        theatreCode,
        masterMovieCode,
        performanceId: p.PerformanceId,
        title: p.Title,
        time: moment(date).format('LT'),
        date: businessDate,
        fandangoUrl: p.PurchaseURL[0].Fandango
      });
    });

    return acc;
  }, []));
}
