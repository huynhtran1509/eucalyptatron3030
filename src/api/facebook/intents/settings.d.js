import { IMessagingReceived } from '../../../../handlers/facebook/webhook-interface';
import { ILuisData } from '../../../luis/interfaces';
export default function handleSettingsIntent(message: IMessagingReceived, luisData: ILuisData): Promise<{}>;
