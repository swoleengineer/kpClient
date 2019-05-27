import { IAuthorState } from '../models';
import { authorActionTypes as types } from '../actions';
import { initialAuthorState, sortByAuthorName } from '../utils';

export const authorReducer = (state: IAuthorState = initialAuthorState, action: {
  type: string;
  payload?: any
}): IAuthorState => {
  switch(action.type) {
    case types.selectAuthor:
      return {
        ...state,
        selectedAuthor: action.payload
      };
    case types.updatedSelected:
      return {
        ...state,
        selectedAuthor: {
          ...state.selectedAuthor,
          ...action.payload
        }
      }
    case types.updateAuthor:
      return {
        ...state,
        authors: state.authors
          .filter(author => author._id !== action.payload._id)
          .concat(action.payload)
          .sort(sortByAuthorName)
      }
    case types.setAuthors:
      return {
        ...state,
        authors: action.payload.sort(sortByAuthorName)
      };
    case types.updateNewAuthor:
      return {
        ...state,
        newAuthor: {
          ...state.newAuthor,
          ...action.payload
        }
      };
    case types.clearNew:
      return {
        ...state,
        newAuthor: initialAuthorState.newAuthor
      }
    default:
      return state;
  }
}
