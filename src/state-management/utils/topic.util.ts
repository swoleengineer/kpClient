import { ITopicState, ITopic } from '../models';

export const initialTopicState: ITopicState = {
  allTopics: [],
  newTopic: {
    name: '',
    description: ''
  }
};


export const sortTopicsByName = (a: ITopic, b: ITopic) => a.name < b.name
  ? -1
  : a.name > b.name
    ? 1
    : 0;
