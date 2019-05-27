import { ITopicBodyObj, IUser, IComment } from './';
import { IReport } from './report.model';

export interface IQuestionRequest {
  topics: string[] | ITopicBodyObj[];
  title: string;
  text: string;
}

export interface IQuestion extends IQuestionRequest {
  _id: string;
  author: IUser | string;
  created: Date;
}

export interface IExpandedQuestion extends IQuestion {
  comments: IComment[];
  reports: IReport[];
}

export interface IQuestionState {
  questions: IExpandedQuestion[];
  newQuestion: IQuestionRequest;
  selectedQuestion: IExpandedQuestion | {}
}
