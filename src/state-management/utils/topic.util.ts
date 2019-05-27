import { ITopicState } from '../models';

export const initialTopicState: ITopicState = {
  allTopics: [],
  newTopic: {
    name: '',
    description: ''
  }
};
