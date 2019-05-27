import {  ITopicBodyObj, IAuthor, IComment, IReport } from './';

export interface IBookRequest {
  title: string;
  writer: {
    id?: string;
    name?: string;
  };
  description: string;
  topics: ITopicBodyObj[];
  isbn: string;
  amazon_link: string;
}

export interface IBookPicture {
  default: boolean;
  link: string;
  public_id: string;
}

export interface IBook extends IBookRequest {
  _id: string;
  author: string | IAuthor;
  views: number;
  pictures: IBookPicture[];
  affiliate_link: string;
  active: boolean;
  likes: string[];
  created: Date;
}

export interface IExpandedBook extends IBook {
  comments: IComment[];
  reports: IReport[];
}
export interface IBookState {
  books: IExpandedBook[];
  newBook: IBookRequest;
  selectedBook: IExpandedBook | {};
}
