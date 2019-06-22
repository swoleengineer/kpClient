import { appActionTypes as types } from '../actions';
import { IAppState } from '../models';
import { appInitialState } from '../utils';


export const appReducer = (state: IAppState = appInitialState, action: {
  type: string;
  payload?: any
}): IAppState => {
  switch(action.type) {
    case types.updateSearchText:
      return {
        ...state,
        home: {
          ...state.home,
          searchText: action.payload
        }
      };
    case types.updateSearchCategory:
      return {
        ...state,
        home: {
          ...state.home,
          selectedSearchCategory: action.payload
        }
      };
    case types.updateBookSearchResults:
      return {
        ...state,
        home: {
          ...state.home,
          bookResults: state.home.bookResults.filter(book => !action.payload.bookGIds.includes(book.gId)).concat(...action.payload.books)
        }
      };
    case types.setBookSearchResults:
      return {
        ...state,
        home: {
          ...state.home,
          bookResults: action.payload
        }
      };
    case types.updateTopicSearchResults:
      return {
        ...state,
        home: {
          ...state.home,
          topicResults: state.home.topicResults.filter(topic => !action.payload.topicNames.includes(topic.name)).concat(...action.payload.topics)
        }
      };
    case types.setTopicSearchResults:
      return {
        ...state,
        home: {
          ...state.home,
          topicResults: action.payload
        }
      }
    default:
      return state;
  }
}
