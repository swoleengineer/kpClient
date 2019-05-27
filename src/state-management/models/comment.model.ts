import  {IUser, acceptableTypes}  from './';

export interface ICommentRequest {
  author: string | IUser;
  text: string;
  parentId: string;
  parentType: acceptableTypes;
}

export interface ICommentSearch {
  parentType: acceptableTypes;
  parentId: string;
}

export interface IComment {
  _id: string;
  created: Date;
}


export interface ICommentState {
  newComment: ICommentRequest
}
