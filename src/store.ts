import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';
import { connectRoutes } from 'redux-first-router';
import { routesMap } from './state-management/routesMap';
import * as reducers from './state-management/reducers';
import { IStore } from './state-management/models';
import querySerializer from 'query-string';
import { initialAppState } from './state-management/utils';


const development = process.env.NODE_ENV !== 'development';

const { reducer, middleware, enhancer } = connectRoutes(routesMap, {
  querySerializer,
  title: state => state.appData.pageTitle,
  onAfterChange: (dispatch, getState) => {
    const { page, location: { prev: { type } } } = getState() as IStore;
    console.log(page);
  }
});

const middlewares = applyMiddleware(middleware);

export const rootReducer = combineReducers<IStore>({
  page: reducers.pageReducer,
  location: reducer
});

function configureStore(initialState?: any) {
  const middleWares: any[] = !development ? [ logger ] : [];
  const combinedEnhancers = compose(enhancer, applyMiddleware(...middleWares));
  return createStore(
    rootReducer,
    initialState!,
    development
      ? window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
      : compose(combinedEnhancers, middlewares));
};

export const store = configureStore(initialAppState);

export default store;
