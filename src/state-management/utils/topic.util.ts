import { ITopicState, ITopic } from '../models';
import { ItemPredicate } from '@blueprintjs/select';


const mockTopics: Array<ITopic> = [{
  _id: '001',
  active: true,
  similar: ['002', '003'],
  name: 'Entrepreneurship',
  description: 'How to start a business'
}, {
  _id: '002',
  active: true,
  similar: ['002', '003'],
  name: 'Leadership',
  description: 'How to  lead a team'
}, {
  _id: '003',
  active: true,
  similar: ['002', '003'],
  name: 'Conjuring',
  description: 'How to  lead a team'
}, {
  _id: '004',
  active: true,
  similar: ['002', '003'],
  name: 'Whispering',
  description: 'How to  lead a team'
}, {
  _id: '005',
  active: true,
  similar: ['002', '003'],
  name: 'Good Days',
  description: 'How to  lead a team'
}, {
  _id: '006',
  active: true,
  similar: ['002', '003'],
  name: 'Distance',
  description: 'How to  lead a team'
}, {
  _id: '007',
  active: true,
  similar: ['002', '003'],
  name: 'Memories',
  description: 'How to  lead a team'
}, {
  _id: '008',
  active: true,
  similar: ['002', '003'],
  name: 'Driving',
  description: 'How to  lead a team'
}, {
  _id: '009',
  active: true,
  similar: ['002', '003'],
  name: 'Risk Management',
  description: 'How to  lead a team'
}]


export const areTopicsEqual = (topicA: ITopic, topicB: ITopic) => {
  // Compare only the titles (ignoring case) just for simplicity.
  return topicA.name.toLowerCase() === topicB.name.toLowerCase();
}

export const doesTopicEqualQuery = (topic: ITopic, query: string) => {
  return topic.name.toLowerCase() === query.toLowerCase();
}

export const arrayContainsTopic = (topics: ITopic[], topicToFind: ITopic): boolean => {
  return topics.some((topic: ITopic) => topic.name === topicToFind.name);
}
export const sortTopicsByName = (a: ITopic, b: ITopic) => a.name < b.name
  ? -1
  : a.name > b.name
    ? 1
    : 0;

export const filterTopic: ItemPredicate<ITopic> = (query, topic, _index, exactMatch) => {
  const { name, description } = topic
  const normalizedName = name.toLowerCase();
  const normalizedQuery = query.toLowerCase();
  console.log('filtering', normalizedName, normalizedQuery)
  const normalizedDescription = description.toLowerCase();
  return exactMatch
    ? normalizedName === normalizedQuery
    : [normalizedName, normalizedDescription].some(text => text.includes(query))
};


export const initialTopicState: ITopicState = {
  allTopics: mockTopics,
  newTopic: {
    name: '',
    description: ''
  }
};
