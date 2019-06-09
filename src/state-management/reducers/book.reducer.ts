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
        books: action.payload.map(book => ({
          ...book,
          comments: [],
          reports: []
        })).sort(sortBooksByViews)
      };
    case types.updateSingleBook:
      return {
        ...state,
        books: state.books
          .filter(book => book._id !== action.payload._id)
          .concat(action.payload)
          .sort(sortBooksByViews),
        selectedBook: state.selectedBook && Object.keys(state.selectedBook).length && state.selectedBook._id === action.payload._id
          ? action.payload
          : state.selectedBook
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
    case types.addComments:
      return {
        ...state,
        books: state.books.map(book => ({
          ...book,
          comments: action.payload[book._id]
        }))
      };
    case types.updateComment:
      return {
        ...state,
        books: state.books.map(book => ({
          ...book,
          comments: book._id === action.payload.data.parentId
            ? action.payload.type === 'add'
              ? book.comments.concat(action.payload.data)
              : book.comments.filter(comment => comment._id !== action.payload.data._id)
            : book.comments
        })),
        selectedBook: state.selectedBook && Object.keys(state.selectedBook).length && state.selectedBook._id === action.payload.data.parentId
          ? {
            ...state.selectedBook,
            comments: action.payload.type === 'add'
              ? state.selectedBook.comments.concat(action.payload.data)
              : state.selectedBook.comments.filter(comment => comment._id !== action.payload.data._id)
          }
          : state.selectedBook
      };
    case types.updateBookLike:
      return {
        ...state,
        books: state.books.map((book, i) => ({
          ...book,
          likes: book._id === action.payload.book
            ? action.payload.type === 'add'
              ? book.likes.filter(like => like !== action.payload.like).concat(action.payload.like)
              : book.likes.filter(like => like !== action.payload.like)
            : book.likes
          })),
        selectedBook: state.selectedBook && Object.keys(state.selectedBook).length && state.selectedBook._id === action.payload.book
          ? {
            ...state.selectedBook,
            likes: action.payload.type === 'add'
              ? state.selectedBook.likes.filter(like => like !== action.payload.like).concat(action.payload.like)
              : state.selectedBook.likes.filter(like => like !== action.payload.like)
          }
          : state.selectedBook
      };
    default:
      return state;
  }
}
