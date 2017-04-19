const axios = require('axios');
import { FB_GRAPH_API_ROOT, FB_PAGE_ACCESS_TOKEN } from '../../../../config';
import { IQuickReplyButton } from '../../../facebook/send';
import { listOfDoNotUnderstandQueryResponses, randomResponse } from '../intents/responseContent';

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
  }

  return axios.post(url, request, {
    params: {
      access_token: FB_PAGE_ACCESS_TOKEN
    }
  }).then((response) => {
    return response.data
  }).catch((response) => {

    throw new Error(JSON.stringify(response.data))
  })
}

export function showQuickReplyForErrorHandling(userId: string, errorHandlingPrompt: string): Promise<{}> {
  const url = `${FB_GRAPH_API_ROOT}/me/messages`;
  const request: IQuickReplyButton = {
    recipient: {
      id: userId
    },
    message: {
      text: errorHandlingPrompt,
      quick_replies: [
        {
          content_type: 'text',
          title: "Search Showtimes",
          payload: JSON.stringify({
            type: 'MOVIE_SHOWTIMES',
            display: "Search Showtimes",
            query: "I'd like to see showtimes",
            intents:[{"score": 1.0, "intent": "SeekShowtime"}], 
            entities: [],
          })
        },
        {
          content_type: 'text',
          title: "Seek Movie Info",
          payload: JSON.stringify({
            type: 'MOVIE_DESCRIPTION'
            })
        }
      ]
    }
  }

  return axios.post(url, request, {
    params: {
      access_token: FB_PAGE_ACCESS_TOKEN
    }
  }).then((response) => {
    return response.data
  }).catch((response) => {
    throw new Error(JSON.stringify(response.data))
  })
}


export function showQuickRepliesForDisambiguatingMovieTitles(userId: string, titleList: string[]): Promise<{}> {
  const url = `${FB_GRAPH_API_ROOT}/me/messages`;
  const request: IQuickReplyButton = {
    recipient: {
      id: userId
    },
    message: {
      text: 'I found a few movies that match that description. Which one do you mean?',
      quick_replies: titleList.map((movieTitle) => {
        return {
                  content_type: 'text',
                  title: movieTitle,
                  payload: JSON.stringify({
                    title: movieTitle
                  })
                }
              })
            }
          }

  return axios.post(url, request, {
    params: {
      access_token: FB_PAGE_ACCESS_TOKEN
    }
  }).then((response) => {
    return response.data
  }).catch((response) => {
    throw new Error(JSON.stringify(response.data))
  })
}
