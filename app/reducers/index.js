// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import bpmReducer from './bpmReducer';

const rootReducer = combineReducers({
  bpmReducer,
  routing
});

export default rootReducer;
