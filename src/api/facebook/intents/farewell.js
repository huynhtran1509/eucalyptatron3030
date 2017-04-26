/**
 * @flow
 */
import { ILuisData } from '../../luis/interfaces';
import { sendCatchAll } from '../send/catchall';
import { listOfFarewells, randomResponse } from './responseContent';


export default function handleFarewellIntent(message: any, luisData: ILuisData): Promise<{}> {
  return sendCatchAll(message, randomResponse(listOfFarewells));
}
