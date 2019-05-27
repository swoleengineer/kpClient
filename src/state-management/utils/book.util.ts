import { IBookState, IBook } from '../models';

export const initialBookState: IBookState = {
  books: [],
  newBook: {
    title: '',
    writer: {
      id: undefined,
      name: undefined
    },
    description: '',
    topics: [],
    isbn: '',
    amazon_link: ''
  },
  selectedBook: {}
}

export const sortBooksByViews = (a: IBook, b: IBook) => a.views < b.views
  ? -1
  : a.views > b.views
    ? 1
    : 0;
