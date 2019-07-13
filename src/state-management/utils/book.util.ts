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
  selectedBook: {},
  googleBooks: [],
  selectedTopics: []
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

export const transformBook = (item, index = undefined) => {
  const { volumeInfo, id, etag } = item;
  const { title, subtitle = '', description = '', authors: writers = [], publisher = '', publishedDate, categories = [], imageLinks, industryIdentifiers = []} = volumeInfo;
  const authors = writers.map((name, _id) => ({ name, _id }));
  const topics = categories.map((name, _id) => ({
    _id,
    agreed: [],
    topic: {
      _id,
      name,
      similar: [],
      active: false
    }
  }));
  const { thumbnail = undefined , smallThumbnail = undefined } = imageLinks || {};
  const picture = {
    link: thumbnail || smallThumbnail || '',
    public_id: '1804'
  };
  const { identifier: isbn10 = '' } = industryIdentifiers.find(x => x.type === 'ISBN_10') || {};
  const { identifier: isbn13 = '' } = industryIdentifiers.find(x => x.type === 'ISBN_13') || {};
  return {
    title,
    subtitle,
    description,
    gId: id,
    gTag: etag,
    publisher,
    publish_date: publishedDate,
    isbn10,
    isbn13,
    likes: [],
    created: new Date(),
    topics,
    active: false,
    pictures: [picture],
    views: 0,
    authors
  }
}

export const bookSorts = [{
  sort: { 'topicsLength': 1 },
  selected: true,
  sortName: 'Highest topics',
  sortFn: (a, b) => a.topics.length < b.topics.length ? 1 : a.topics.length > b.topics.length ? -1 : 0
}, {
  sort: { 'topicsLength': -1 },
  selected: false,
  sortName: 'Lowest topics',
  sortFn: (a, b) => a.topics.length < b.topics.length ? -1 : a.topics.length > b.topics.length ? -1 : 0
}, {
  sort: { 'likesLength': 1 },
  selected: false,
  sortName: 'Highest likes',
  sortFn: (a, b) => a.likes.length < b.likes.length ? 1 : a.likes.length > b.likes.length ? -1 : 0
}, {
  sort: { 'likesLength': -1 },
  selected: false,
  sortName: 'Lowest likes',
  sortFn: (a, b) => a.likes.length < b.likes.length ? -1 : a.likes.length > b.likes.length ? 1 : 0
}]

export const getSelectedSort = options => options.find(opt => opt.selected);