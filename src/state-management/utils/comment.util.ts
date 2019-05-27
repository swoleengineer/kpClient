import { ICommentState, acceptableTypes } from '../models';

export const initialCommentState: ICommentState = {
  newComment: {
    author: '',
    text: '',
    parentId: '',
    parentType: acceptableTypes.book
  }
}
