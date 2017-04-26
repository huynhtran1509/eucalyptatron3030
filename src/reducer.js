import * as core from './core';

import {Map} from 'immutable';

const R = require('ramda');

export default function reducer(state = core.INITIAL_STATE, action) {
  switch (action.type) {
  case 'SET_ID':
    return core.setID(state, action.Id);
  case 'SET_FACETS':
    return core.setFacets(state, action.facets);
  case 'SET_QUERY':
    return core.setQuery(state, action.query);
  case 'SET_INTENTS':
      return core.intents(state, action.intents);
  case 'SET_STATE':
      return core.setState(state, action.state);
  }
  return state;
}