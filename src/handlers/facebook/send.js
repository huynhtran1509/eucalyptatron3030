import axios from 'axios';
import { FB_GRAPH_API_ROOT, FB_PAGE_ACCESS_TOKEN } from '../../config';

/*
Documentation for the FB Send API:

https://developers.facebook.com/docs/messenger-platform/send-api-reference
 */

interface IImagePayload {
    url: string;
}

export interface IButton {
    type: 'web_url' | 'postback';
    title: string;
    url?: string; // required if type is web_url
    payload?: string; // required if type is postback
}

interface IGenericPayload {
    template_type: 'generic';
    elements: Array<{
        title: string;
        item_url?: string;
        image_url?: string;
        subtitle?: string;
        buttons?: IButton[];
    }>
}

interface IButtonPayload {
    template_type: 'button';
    text: string;
    buttons?: IButton[];
}

interface IReceiptPayload {
    template_type: 'receipt';
    recipient_name: string;
    order_number: string;
    currenty: string;
    payment_method: string;
    timestamp?: string;
    order_url?: string;
    elements: Array<{
        title: string;
        subtitle?: string;
        quantity?: number;
        price?: number;
        currency?: string;
        image_url?: string;
    }>,
    address?: {
        street_1: string;
        street_2?: string;
        city: string;
        postal_code: string;
        state: string;
        country: string;
    },
    summary: {
        subtotal?: number;
        shipping_cost?: number;
        total_tax?: number;
        total_cost: number;
    },
    adjustments?: Array<{
        name?: string;
        amount?: number;
    }>
}

interface IVideoPayload {
    url: string; // e.g. "https://website.com/bin/clip.mp4"
}

type PayloadType = IVideoPayload | IImagePayload | IGenericPayload | IButtonPayload | IReceiptPayload;

export type NotificationType = 'REGULAR' | 'SILENT_PUSH' | 'NO_PUSH';

export interface ISendAPIRequest {
    // phone_number or id must be set
    recipient: {
        phone_number?: string; // Format: +1(212)555-2368
        id?: string;
    },
    // text or attachment must be set
    message: {
        text?: string; // must be UTF-8, 320 character limit
        attachment?: {
            type: 'image' | 'template' | 'video';
            payload: PayloadType;
        }
    },
    notification_type?: NotificationType
}

export interface ISendAPIResponse {
    recipient_id?: string;
    message_id?: string;
    error?: {
        message: string;
        type: string;
        code: number;
        error_data: string;
        fbtrace_id: string;
    }
}

interface IQuickReplyPayload {
  content_type: string;
  title?: string;
  payload?: string;
  image_url?: string;
}


export interface IQuickReplyButton {
  recipient: {
    id: string;
  };
  message: {
    text: string;
    quick_replies: IQuickReplyPayload[]
  }
}


export function send(request: ISendAPIRequest): Promise<ISendAPIResponse> {
  const url = `${FB_GRAPH_API_ROOT}/me/messages`;

  return axios.post(url, request, {
    params: {
      access_token: FB_PAGE_ACCESS_TOKEN
    }
  }).then(response => response.data).catch((response) => {
    throw new Error(JSON.stringify(response.data));
  });
}


export function sendTextPayload(userId: string, text: string, notificationType?: NotificationType) {
  const request: ISendAPIRequest = {
    recipient: { id: userId },
    message: { text }
  };

  if (notificationType) {
    request.notification_type = notificationType;
  }

  return send(request);
}

export function sendButtonPayload(userId: string, text: string, buttons: IButton[], notificationType?: NotificationType) {
  const request: ISendAPIRequest = {
    recipient: { id: userId },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text,
          buttons
        }
      }
    }
  };

  return send(request);
}

export function sendVideoPayload(userId: string, videoUrl: string): Promise<{}> {
  const request: ISendAPIRequest = {
    recipient: { id: userId },
    message: {
      attachment: {
        type: 'video',
        payload: {
          url: videoUrl
        }
      }
    }
  };

  return send(request);
}
