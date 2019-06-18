import {  ITopicBodyObj, IAuthor, IComment, IReport, ITopic  } from './';


export interface IBookRequest {
  title: string;
  writer: {
    id?: string;
    name?: string;
  };
  description: string;
  topics: Array<ITopicBodyObj | ITopic>;
  isbn: string;
  amazon_link: string;
}

export interface IBookPicture {
  default: boolean;
  link: string;
  public_id: string;
}

export interface IBook {
  _id: string;
  active: boolean;
  authors: IAuthor[];
  created: Date;
  description: string;
  gId: string;
  gTag: string;
  isbn10: string;
  isbn13: string;
  likes: string[]
  pictures: IBookPicture[];
  publish_date: string;
  publisher: string;
  subtitle: string;
  title: string;
  topics: ITopicBodyObj[];
  views: number;
  affiliate_link: string;
}

export interface IExpandedBook extends IBook {
  comments: IComment[];
  reports: IReport[];
}
export interface IBookState {
  books: IExpandedBook[];
  googleBooks: any[];
  newBook: IBookRequest;
  selectedBook: IExpandedBook | {};
}
