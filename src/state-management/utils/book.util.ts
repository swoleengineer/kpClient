import { IBookState, IBook, IExpandedBook } from '../models';
import { ItemPredicate } from '@blueprintjs/select';



export const sortBooksByViews = (a: IBook, b: IBook) => a.views < b.views
  ? -1
  : a.views > b.views
    ? 1
    : 0;


export const areBooksEqual = (bookA: IExpandedBook, bookB: IExpandedBook) => bookA.isbn === bookB.isbn;

export const doesBookEqualQuery = (book: IExpandedBook, query: string) => book.title.toLowerCase() === query.toLowerCase();

export const arrayContainsBook = (books: Array<IExpandedBook>, bookToFind: IExpandedBook): boolean => books.some(book => book.isbn === bookToFind.isbn);

export const filterBook: ItemPredicate<IExpandedBook> = (query, book, _index, exactMatch) => {
  const { title = '', description = ''} = book
  const normalizedName = title.toLowerCase();
  const normalizedQuery = query.toLowerCase();
  const normalizedDescription = description.toLowerCase();
  return exactMatch
    ? normalizedName === normalizedQuery
    : [normalizedName, normalizedDescription].some(text => text.includes(query))
};

export const initialBookState: IBookState = {
  books: [],
  newBook: {
    title: '',
    writer: {
      id: undefined,
      name: 'Joram Clervius'
    },
    description: '',
    topics: [],
    isbn: '',
    amazon_link: ''
  },
  selectedBook: {},
  googleBooks: []
}


export const bookFilter = query => book => {
  const { title } = book;
  const normalizedTitleArr = title.toLowerCase().split('');
  const normalizedQueryArr = query.toLowerCase().split('');
  const match = normalizedQueryArr.every(letter => normalizedTitleArr.includes(letter));
  return match;
}

export const getAuthorName = book => {
  const { author: writer = { name: ''}, authors = [] } = book;
  return authors.length ? authors.map(el => el.name).join(', ') : writer.name;
}
