import { LocationState } from 'redux-first-router';
import { IUserState, ITopicState, IReportState,
  IQuestionState, ICommentState, IBookState, IAuthorState, IAppState } from '.';

export interface IStore {
  app: IAppState;
  page: string;
  location: LocationState;
  user: IUserState;
  topic: ITopicState;
  report: IReportState;
  question: IQuestionState;
  comment: ICommentState;
  book: IBookState;
  author: IAuthorState;
}

export const IUserPages = ['notifications', 'likedBooks', 'readBooks'];
