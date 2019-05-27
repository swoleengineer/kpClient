import { ICommentState } from '../models';
import { commentActionTypes as types } from '../actions';
import { initialCommentState } from '../utils';



export const commentReducer = (state: ICommentState = initialCommentState, action: {
  type: string;
  payload?: any
}): ICommentState => {
  switch(action.type) {
    case types.updateNewComment:
      return {
        ...state,
        newComment: {
          ...state.newComment,
          ...action.payload
        }
      }
    case types.clearNewComment:
      return {
        ...state,
        newComment: {
          ...initialCommentState.newComment,
          author: state.newComment.author
        }
      }
    default:
      return state;
  }
}
