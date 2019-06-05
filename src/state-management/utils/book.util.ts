import { IBookState, IBook, IExpandedBook } from '../models';
import { ItemPredicate } from '@blueprintjs/select';



export const sortBooksByViews = (a: IBook, b: IBook) => a.views < b.views
  ? -1
  : a.views > b.views
    ? 1
    : 0;

export const mockBooks: IExpandedBook[] = [{
  comments: [],
  reports: [],
  _id: '1234',
  author: {
    _id: '1234',
    picture: {
      link: '',
      public_id: ''
    },
    created: new Date(),
    presence: [],
    name: 'Joram Clervius',
    website: 'https://swoleengineer.com'
  },
  views: 10,
  pictures: [{
    default: true,
    link: 'https://christianaudio.com/media/catalog/product/cache/1/image/1050x1050/170ec19af00183b5e0368529fc2daa2f/9/7/9780718074326.jpg',
    public_id: 'hf7qph4f'
  }],
  affiliate_link: 'https://amazon.com',
  active: true,
  likes: ['1234', '2234'],
  created: new Date(),
  title: 'How To Win',
  writer: { },
  description: 'Fake book used in here yeah',
  topics: [{
    topic: 'Entrepreneurship',
    agreed: ['1', '2', '3'],
    created: new Date()
  }],
  isbn: '548799865',
  amazon_link: 'https://amazon.com'
}, {
  comments: [],
  reports: [],
  _id: '5678',
  author: {
    _id: '1234',
    picture: {
      link: '',
      public_id: ''
    },
    created: new Date(),
    presence: [],
    name: 'Michelle Obama',
    website: 'https://swoleengineer.com'
  },
  views: 10,
  pictures: [{
    default: true,
    link: 'https://images-na.ssl-images-amazon.com/images/I/51FyrCUjKOL._SX342_.jpg',
    public_id: 'hf7qph4f'
  }],
  affiliate_link: 'https://amazon.com',
  active: true,
  likes: ['1234', '2234'],
  created: new Date(),
  title: 'Michelle book',
  writer: { },
  description: 'Fake book used in here yeah',
  topics: [{
    topic: 'Entrepreneurship',
    agreed: ['1', '2', '3'],
    created: new Date()
  }],
  isbn: '15656',
  amazon_link: 'https://amazon.com'
}, {
  comments: [],
  reports: [],
  _id: '654',
  author: {
    _id: '1234',
    picture: {
      link: '',
      public_id: ''
    },
    created: new Date(),
    presence: [],
    name: 'Melisha Clervius',
    website: 'https://swoleengineer.com'
  },
  views: 10,
  pictures: [],
  affiliate_link: 'https://amazon.com',
  active: true,
  likes: ['1234', '2234'],
  created: new Date(),
  title: 'How To Lose',
  writer: { },
  description: 'Fake book used in here yeah',
  topics: [{
    topic: 'Entrepreneurship',
    agreed: ['1', '2', '3'],
    created: new Date()
  }],
  isbn: '548799865',
  amazon_link: 'https://amazon.com'
}, {
  comments: [],
  reports: [],
  _id: '434564',
  author: {
    _id: '1234',
    picture: {
      link: '',
      public_id: ''
    },
    created: new Date(),
    presence: [],
    name: 'Swole Engineer',
    website: 'https://swoleengineer.com'
  },
  views: 10,
  pictures: [],
  affiliate_link: 'https://amazon.com',
  active: true,
  likes: ['1234', '2234'],
  created: new Date(),
  title: 'First Coding Books To Have',
  writer: { },
  description: 'Fake book used in here yeah',
  topics: [{
    topic: 'Entrepreneurship',
    agreed: ['1', '2', '3'],
    created: new Date()
  }],
  isbn: '548799865',
  amazon_link: 'https://amazon.com'
}, {
  comments: [],
  reports: [],
  _id: '54yu-vs',
  author: {
    _id: '1234',
    picture: {
      link: '',
      public_id: ''
    },
    created: new Date(),
    presence: [],
    name: 'John Doe',
    website: 'https://swoleengineer.com'
  },
  views: 10,
  pictures: [],
  affiliate_link: 'https://amazon.com',
  active: true,
  likes: ['1234', '2234'],
  created: new Date(),
  title: 'Dont Give A Damn',
  writer: { },
  description: 'Fake book used in here yeah',
  topics: [{
    topic: 'Entrepreneurship',
    agreed: ['1', '2', '3'],
    created: new Date()
  }],
  isbn: '548799865',
  amazon_link: 'https://amazon.com'
}, {
  comments: [],
  reports: [],
  _id: 'vfsdpo9548g',
  author: {
    _id: '1234',
    picture: {
      link: '',
      public_id: ''
    },
    created: new Date(),
    presence: [],
    name: 'Parov Stelar',
    website: 'https://swoleengineer.com'
  },
  views: 10,
  pictures: [],
  affiliate_link: 'https://amazon.com',
  active: true,
  likes: ['1234', '2234'],
  created: new Date(),
  title: 'The Very Best In Music',
  writer: { },
  description: 'Fake book used in here yeah',
  topics: [{
    topic: 'Entrepreneurship',
    agreed: ['1', '2', '3'],
    created: new Date()
  }],
  isbn: '548799865',
  amazon_link: 'https://amazon.com'
}]



export const areBooksEqual = (bookA: IExpandedBook, bookB: IExpandedBook) => bookA.isbn === bookB.isbn;

export const doesBookEqualQuery = (book: IExpandedBook, query: string) => book.title.toLowerCase() === query.toLowerCase();

export const arrayContainsBook = (books: Array<IExpandedBook>, bookToFind: IExpandedBook): boolean => books.some(book => book.isbn === bookToFind.isbn);

export const filterBook: ItemPredicate<IExpandedBook> = (query, book, _index, exactMatch) => {
  const { title, description } = book
  const normalizedName = title.toLowerCase();
  const normalizedQuery = query.toLowerCase();
  const normalizedDescription = description.toLowerCase();
  return exactMatch
    ? normalizedName === normalizedQuery
    : [normalizedName, normalizedDescription].some(text => text.includes(query))
};

export const initialBookState: IBookState = {
  books: mockBooks,
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
  selectedBook: {}
}
