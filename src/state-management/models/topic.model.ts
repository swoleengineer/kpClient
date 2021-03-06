import { IUser } from './';

export interface ITopicBodyObj {
  topic: ITopic;
  agreed: Array<IUser | string>;
  created: Date;
  _id: string;
}

export interface ITopicRequest {
  name: string;
  description: string;
}

export interface ITopic extends ITopicRequest {
  _id: string;
  active: boolean;
  similar: Array<ITopic|string>;
}


export interface ITopicState {
  allTopics: ITopic[];
  newTopic: ITopicRequest;
}
