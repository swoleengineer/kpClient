export * from './author.util';
export * from './book.util';
export * from './comment.util';
export * from './question.util';
export * from './report.util';
export * from './topic.util';
export * from './user.util';

import { LocationState, Location } from 'redux-first-router';
import { IStore } from '../models';
import { initialAuthorState, initialBookState, initialCommentState,
  initialQuestionState, initialReportState, initialTopicState, initialUserState } from './';


const initialLocation: Location = {
  pathname: '/',
  type: 'HOME',
  payload: {}
} 
export const initialLocationState: LocationState = {
  ...initialLocation,
  payload: {},
  prev: { ...initialLocation },
  kind: null,
  history: null,
  routesMap: {}
}

export const initialAppState: IStore = {
  page: 'main/home',
  location: initialLocationState,
  author: initialAuthorState,
  book: initialBookState,
  comment: initialCommentState,
  question: initialQuestionState,
  report: initialReportState,
  topic: initialTopicState,
  user: initialUserState
}
