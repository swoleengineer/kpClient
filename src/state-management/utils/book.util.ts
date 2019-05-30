import { IBookState, IBook, IExpandedBook } from '../models';



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
  pictures: [],
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
  pictures: [],
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
}]

export const initialBookState: IBookState = {
  books: mockBooks,
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
