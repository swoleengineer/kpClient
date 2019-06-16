import { NOT_FOUND } from 'redux-first-router';
import { initialAppState } from '../utils';

const routes: {[key: string]: string } = {
  HOME: 'main/home',
  LOGIN: 'auth/login',
  REGISTER: 'auth/register',
  FORGOTPASSWORD: 'auth/forgotPw/forgot',
  RESETPASSWORD: 'auth/forgotPw/reset',
  NEWTOPIC: 'auth/topic',
  NEWBOOK: 'auth/newBook',
  NEWQUESTION: 'auth/question',
  ALLBOOKS: 'main/books/all',
  SINGLEBOOK: 'main/books/single',
  ALLQUESTIONS: 'main/questions/all',
  SINGLEQUESTION: 'main/questions/single',
  PROFILE: 'main/profile',
  MYPAGE: 'main/profile',
  [NOT_FOUND]: 'notFound',
}

export const pageReducer = (state: string = initialAppState.page, action: {
  type: string
}): string => routes[action.type.toString()] || state;
