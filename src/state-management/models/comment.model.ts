import { IUser, acceptableTypes, IBook  } from './';

export interface ICommentRequest {
  author: string | IUser;
  text: string;
  parentId: string;
  parentType: acceptableTypes;
  created: Date;
  suggested_book?: string
}

export interface ICommentSearch {
  parentType: acceptableTypes;
  parentId: string;
}

export interface IComment {
  _id: string;
  created: Date;
  author: IUser;
  accepted: boolean;
  suggested_book: string | IBook;
  parentType: acceptableTypes;
  parentId: string;
  text: string;
}


export interface ICommentState {
  newComment: ICommentRequest
}
