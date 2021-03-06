import { Map } from 'immutable';
const R = require('ramda');

export function setEntries(state, entries) {
  return state.set('entries', entries);
}

export function next(state) {
  const entries = state.get('entries');
  return state.merge({
    vote: Map({ pair: entries.take(2) }),
    entries: entries.skip(2)
  });
}

export function vote(state, entry) {
  return state.updateIn(
    ['vote', 'tally', entry],
    0,
    tally => tally + 1
  );
}

export function setState(state, newState) {
  return state.merge(newState);
}

export const INITIAL_STATE = Map();



export const LUIS_TEMPLATE = {
  'user-id': {},
  epoch: 1484771343.01,
  'payload-type': 'luis',
};
