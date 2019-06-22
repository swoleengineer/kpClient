import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';
import { connectRoutes } from 'redux-first-router';
import { routesMap } from './state-management/routesMap';
import * as reducers from './state-management/reducers';
import { IStore } from './state-management/models';
import querySerializer from 'query-string';
import { initialAppState, siteName, pageTitleMap } from './state-management/utils';


const development = process.env.NODE_ENV === 'development';

const { reducer, middleware, enhancer } = connectRoutes(routesMap, {
  querySerializer,
  title: (state: IStore ) => {
    const { location: { type }, book: { selectedBook }, question: { selectedQuestion }} = state;
    if (pageTitleMap[type] === 'string') {
      return `${pageTitleMap[type]} ${siteName}`;
    }
    if (type === 'SINGLEQUESTION') {
      return `${pageTitleMap[type](selectedQuestion)}`;
    }
    if (type === 'SINGLEBOOK') {
      console.log(selectedBook.title, 'from store page')
      return `${pageTitleMap[type](selectedBook)}`;
    }
    return 'Keen Pages';
  },
  onAfterChange: (dispatch, getState) => {
    const { page, location: { prev: { type } } } = getState() as IStore;
    console.log(page, type);
  }
});

const middlewares = applyMiddleware(middleware);

export const rootReducer = combineReducers<IStore>({
  app: reducers.appReducer,
  page: reducers.pageReducer,
  location: reducer,
  user: reducers.userReducer,
  topic: reducers.topicReducer,
  report: reducers.reportReducer,
  question: reducers.questionReducer,
  comment: reducers.commentReducer,
  book: reducers.bookReducer,
  author: reducers.authorReducer
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
