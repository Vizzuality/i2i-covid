import { createStore, combineReducers, applyMiddleware } from 'redux';
import { connectRoutes } from 'redux-first-router';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import routesMap from 'config/router';
import pageReducer from 'modules/page/reducer';
import filtersReducer from 'modules/filters/reducer';
import countryReducer from 'modules/country/reducer';

export default function configureStore(preloadedState = {}) {
  const { reducer, middleware, enhancer } = connectRoutes(routesMap);
  const rootReducer = combineReducers({
    location: reducer,
    page: pageReducer,
    filters: filtersReducer,
    country: countryReducer,
  });
  const middlewares = applyMiddleware(middleware);
  const enhancers = composeWithDevTools(enhancer, middlewares);
  const store = createStore(rootReducer, preloadedState, enhancers);

  return { store };
}
