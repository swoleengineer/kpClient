import { NOT_FOUND } from 'redux-first-router';
import { initialAppState } from '../utils';

const routes: {[key: string]: string } = {
  HOME: 'main/home',
  LOGIN: 'auth/login',
  REGISTER: 'auth/register',
  NEWTOPIC: 'auth/topic',
  NEWBOOK: 'auth/newBook',
  NEWQUESTION: 'auth/question',
  ALLBOOKS: 'main/books/all',
  SINGLEBOOK: 'main/books/single',
  [NOT_FOUND]: 'notFound',
}

export const pageReducer = (state: string = initialAppState.page, action: {
  type: string
}): string => routes[action.type.toString()] || state;
