// src/store/store.js
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger'; // Only used in dev

// Placeholder root reducer
const rootReducer = combineReducers({
  // example: exampleReducer,
});

let enhancer;

if (import.meta.env.MODE === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) =>
  createStore(rootReducer, preloadedState, enhancer);

export default configureStore;
