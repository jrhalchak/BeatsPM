// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import tapReducer from './tapReducer';

const rootReducer = combineReducers({
  tapReducer,
  routing
});

export default rootReducer;
