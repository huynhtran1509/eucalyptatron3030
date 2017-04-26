// List of responses for when Luis recognizes a greeting intent.
export const listOfGreetings: string[] = ['Hi!', 'What\'s up?', 'Howdy.', 'Hey!', 'Why hello there!', 'Greetings!', 'Hiya.', 'Hello!', 'What\'s going on?', 'What\'s good?'];

// List of responses for when Luis recognizes a farewell intent.
export const listOfFarewells: string[] = ['See you later!', 'Bye now!', 'Take care!', 'Have a good one!', 'Adios!', 'Talk to you later!'];

// List of responses for when Luis can't find a movie
export const listOfCannotFindMovieInfoResponses: string[] = ['I was unable to find the requested movie information 😞', 'Sorry, I couldn\'t find any info for the movie you requested.', 'I didn\'t find any information for the movie you requested. Sorry!', 'I couldn\'t find any info for the movie you requested, unfortunately.'];

// List of responses for when Luis doesn't understand a query.
export const listOfDoNotUnderstandQueryResponses: string[] = ['I don\'t understand that query.', 'Sorry, I\'m not sure what you mean.', 'Sorry, I don\'t understand.', 'I don\'t understand what you mean, sorry.', 'Unfortunately, I don\'t understand that query.'];

// List of responses for when user hits yes.
export const listOfUserHitYesResponses: string[] = ['Picking Yes?\n\n\n\nHow about no.', 'You picked yes!', 'I\'m glad you picked yes.', 'I\'m glad that\'s what you wanted.'];

// List of responses for when user hits no.
export const listOfUserHitNoResponses: string[] = ['Fine! I see how it is!', 'No, huh? Fine.', 'Well, OK then. No it is.', 'Alright, I get it.', 'OK, so that\'s a no, then.'];

// List of responses for when Luis doesn't understand the requested payload.
export const listOfDoNotUnderstandRequestedPayloadResponses: string[] = ['I did not understand the requested payload.', 'I\'m not sure what the payload you requested is.', 'I don\'t recognize the payload you requested, sorry.', 'I\'m unfamiliar with the payload you requested.'];

// List of responses for when Luis can't find showtimes for a movie.
export const listOfCannotFindShowtimesResponses: string[] = ['I was unable to find showtimes for that movie 😞', 'Sorry, I couldn\'t find the showtimes for that movie.', 'I couldn\'t locate the showtimes for that movie, sorry.', 'I couldn\'t find that movie\'s showtimes, sorry.', 'I wasn\'t able to find that movie\'s showtimes.'];


// Quick Reply Button Prompts
// Text of message to prompt the user to share their location at start of conversation
export const getStartedShareLocationPrompt: string = 'Please share your location to find theatres and showtimes near you!';

// Text of message to prompt user to share their location during a conversation
export const shareLocationDuringConversationPrompt: string = 'Type something like "Change my location to Washington, DC" or "22902." You could also share your location below.';


// Function for randomly selecting a response from list.
export function randomResponse(responseList: string[]): string {
  const randomIndex: number = Math.floor(Math.random() * responseList.length);
  return responseList[randomIndex];
}
