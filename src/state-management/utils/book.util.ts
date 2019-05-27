import { IBookState } from '../models';

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
