import { FB_GRAPH_API_ROOT, FB_PAGE_ACCESS_TOKEN } from '../../config';

const axios = require('axios');

export interface IPersistentMenuItem {
    type: "web_url" | "postback";
    title: string; // button title
    url?: string;
    payload?: string;
    webview_height_ratio?: "compact" | "tall" | "full";
    messenger_extensions?: boolean; // must be true if using Messenger Extensions
}

interface IPersistentMenuPayload {
    setting_type: "call_to_actions";
    thread_state: "existing_thread";
    call_to_actions?: IPersistentMenuItem[];
}

interface IGreetingText {
  setting_type: "greeting";
  greeting: {
    text: string;
  }
}

interface IGetStartedButton {
  setting_type: "call_to_actions";
  thread_state: "new_thread";
  call_to_actions: [
    {
      type: "postback";
      payload: string;
    }
  ]
}

export function showGreetingText(): Promise<{}> {
  const url = `${FB_GRAPH_API_ROOT}/me/thread_settings`;

  const request: IGreetingText = {
    setting_type: 'greeting',
    greeting: {
      text: 'Find movie showtimes and purchase tickets on-the-go.'
    }
  };

  return axios.post(url, request, {
    params: {
      access_token: FB_PAGE_ACCESS_TOKEN
    }
  }).then(response => response.data).catch((response) => {
    throw new Error(JSON.stringify(response.data));
  });
}

export function showGetStartedButton(): Promise<{}> {
  const url = `${FB_GRAPH_API_ROOT}/me/thread_settings`;

  const request: IGetStartedButton = {
    setting_type: 'call_to_actions',
    thread_state: 'new_thread',
    call_to_actions: [
      {
        type: 'postback',
        payload: JSON.stringify({
          type: 'GET_STARTED'
        })
      }
    ]
  };

  return axios.post(url, request, {
    params: {
      access_token: FB_PAGE_ACCESS_TOKEN
    }
  }).then(response => response.data).catch((response) => {
    throw new Error(JSON.stringify(response.data));
  });
}

export function upsertPersistentMenu(menuItems: IPersistentMenuItem[]): Promise<{}> {
  const url = `${FB_GRAPH_API_ROOT}/me/thread_settings`;

  const request: IPersistentMenuPayload = {
    setting_type: 'call_to_actions',
    thread_state: 'existing_thread',
    call_to_actions: menuItems
  };

  return axios.post(url, request, {
    params: {
      access_token: FB_PAGE_ACCESS_TOKEN
    }
  }).then(response => response.data).catch((response) => {
    throw new Error(JSON.stringify(response.data));
  });
}

export function deletePersistentMenu(): Promise<{}> {
  const url = `${FB_GRAPH_API_ROOT}/me/thread_settings`;

  const request: IPersistentMenuPayload = {
    setting_type: 'call_to_actions',
    thread_state: 'existing_thread'
  };

  return axios.delete(url, {
    params: {
      access_token: FB_PAGE_ACCESS_TOKEN
    }
  }).then(response => response.data).catch((response) => {
    throw new Error(JSON.stringify(response.data));
  });
}
