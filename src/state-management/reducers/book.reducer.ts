import { bookActionTypes as types } from '../actions';
import { IBookState } from '../models';
import { initialBookState, sortBooksByViews } from '../utils';

export const bookReducer = (state: IBookState = initialBookState, action: {
  type: string;
  payload?: any
}): IBookState => {
  switch(action.type) {
    case types.updateAllBooks:
      return {
        ...state,
        books: action.payload.sort(sortBooksByViews)
      };
    case types.updateSingleBook:
      return {
        ...state,
        books: state.books
          .filter(book => book._id !== action.payload._id)
          .concat(action.payload)
          .sort(sortBooksByViews)
      };
    case types.updateNewBook:
      return {
        ...state,
        newBook: {
          ...state.newBook,
          ...action.payload
        }
      };
    case types.clearNewBook:
      return {
        ...state,
        newBook: initialBookState.newBook
      };
    case types.selectBook:
      return {
        ...state,
        selectedBook: action.payload
      };
    case types.updateSelected:
      return {
        ...state,
        selectedBook: {
          ...state.selectedBook,
          ...action.payload
        }
      }
    default:
      return state;
  }
}
