const botBuilder = require('claudia-bot-builder');
const fbTemplate = botBuilder.fbTemplate;

import { IQuickReplyButton } from '../../../handlers/facebook/send';

export function showLocationQuickReplyButton(userId: string, locationPrompt?: string): Promise<{}> {
  const url = `${FB_GRAPH_API_ROOT}/me/messages`;

  const request: IQuickReplyButton = {
    recipient: {
      id: userId
    },
    message: {
      text: locationPrompt,
      quick_replies: [
        {
          content_type: 'location'
        }
      ]
    }
  };
}

export function showQuickReplyForErrorHandling(errorHandlingPrompt: string) {
  
  const newMessage = new fbTemplate.Text(errorHandlingPrompt);

    return newMessage
      .addQuickReply('Search Showtimes', JSON.stringify({
        type: 'MOVIE_SHOWTIMES',
        display: 'Search Showtimes',
        query: "I'd like to see showtimes",
        intents: [{ score: 1.0, intent: 'SeekShowtime' }],
        entities: [],
      }))
      .addQuickReply('Seek Movie Info', JSON.stringify({
        type: 'MOVIE_DESCRIPTION'
      }))
      .get();
}


export function showQuickRepliesForDisambiguatingMovieTitles(userId: string, titleList: string[]): Promise<{}> {
  const url = `${FB_GRAPH_API_ROOT}/me/messages`;
  const request: IQuickReplyButton = {
    recipient: {
      id: userId
    },
    message: {
      text: 'I found a few movies that match that description. Which one do you mean?',
      quick_replies: titleList.map(movieTitle => ({
        content_type: 'text',
        title: movieTitle,
        payload: JSON.stringify({
          title: movieTitle
        })
      }))
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
