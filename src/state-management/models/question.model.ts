import { ITopicBodyObj, IUser } from './';

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
