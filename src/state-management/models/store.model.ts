import { LocationState } from 'redux-first-router';
import { IUserState, ITopicState, IReportState,
  IQuestionState, ICommentState, IBookState, IAuthorState } from '.';

export interface IStore {
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
