// src/store/store.js
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import sessionReducer, { login } from './session';

// Placeholder root reducer
const rootReducer = combineReducers({
  session: sessionReducer
});

let enhancer;

if (import.meta.env.MODE === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  const store = createStore(rootReducer, preloadedState, enhancer);

  if (import.meta.env.MODE !== 'production') {
    window.store = store;
    window.login = login;
  }

  return store;
};

export default configureStore;
