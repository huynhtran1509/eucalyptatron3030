/**
 * @flow
 */
import { ILuisData } from '../../luis/interfaces';
import { sendCatchAll } from '../send/catchall';
import { listOfGreetings, randomResponse } from './responseContent';

export default function handleGreetingIntent(message: any, luisData: ILuisData): Promise<{}> {
  return sendCatchAll(message, randomResponse(listOfGreetings));
}
