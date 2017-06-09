import { combineReducers } from 'redux';
import locationReducer from './location';
import annotationReducer from './annotation';
import playlistReducer from './playlist';
import bookmarkReducer from './bookmark';
import gotopageReducer from './gotopage';
import multitaskpanelReducer from './multitaskpanel';

export const makeRootReducer = asyncReducers =>
   combineReducers({
     location: locationReducer,
     annotationReducer,
     playlistReducer,
     bookmarkReducer,
     gotopageReducer,
     multitaskpanelReducer,
     ...asyncReducers
   })
;


export const injectReducer = (store, { key, reducer }) => {
  const myStore = store;
  myStore.asyncReducers[key] = reducer;
  myStore.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
