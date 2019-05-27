import { ITopicState } from '../models';
import { topicActionTypes as types } from '../actions';
import { initialTopicState, sortTopicsByName } from '../utils';

export const topicReducer = (state: ITopicState = initialTopicState, action: {
  type: string;
  payload?: any
}): ITopicState => {
  switch(action.type) {
    case types.updateAll:
      return {
        ...state,
        allTopics: action.payload.sort(sortTopicsByName)
      }
    case types.updateSingle:
      return {
        ...state,
        allTopics: action.payload.type === 'add'
          ? state.allTopics.concat(action.payload).sort(sortTopicsByName)
          : state.allTopics.filter(topic => topic._id !== action.payload._id)
      }
    case types.updateNew:
      return {
        ...state,
        newTopic: {
          ...state.newTopic,
          ...action.payload
        }
      };
    case types.clearNew:
      return {
        ...state,
        newTopic: initialTopicState.newTopic
      }
    default:
      return state;
  }
}
