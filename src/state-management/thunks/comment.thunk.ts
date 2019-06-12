import { store } from '../../store';
import { ICommentRequest, acceptableTypes, IComment } from '../models';
import { postCreateComment, deleteComment } from '../../config';
import { bookActionTypes as bookTypes } from '../actions';
import { Toaster } from '@blueprintjs/core';
import { redirect } from 'redux-first-router';

const actionTypes = {
  [acceptableTypes.book]: bookTypes,
}

const AppToaster = Toaster.create({
  className: 'keenpagesToaster',
})

export const createComment = (params: ICommentRequest, goToNext: boolean = false, redirectPayload: {
  type: string;
  payload?: any
} = { type: 'HOME' }) => postCreateComment({ ...params }).then(
  (res: any) => {
    const { parentType } = params;
    const comment = res.data || undefined;
    if (!comment) {
      throw {
        response: { data: {
          message: 'Comment could not be created.',
          status: 500,
        }}};
        return;
    }
    store.dispatch({
      type: actionTypes[parentType].updateComment,
      payload: {
        type: 'add',
        data: comment
      }
    });
    if (goToNext) {
      store.dispatch(redirect(redirectPayload));
    }
  },
  (err: any) => {
    let message;
    try {
      const { message: mesaj =  '' } = { ...err.response.data, ...(err.response.data.data || {}) }
      message = mesaj
    } catch {
      message = 'Could not add your comment. Please try again later'
    }
    AppToaster.show({ message, intent: 'danger', icon: 'error' });
  }
)

export const removeComment = (comment: IComment) => deleteComment(comment._id).then(
  (res: any) => {
    store.dispatch({
      type: actionTypes[comment.parentType].updateComment,
      payload: {
        type: 'remove',
        data: comment
      }
    })
  },
  (err: any) => {
    let message;
    try {
      message = err.response.data.message
    } catch {
      message = 'Could not delete comment.'
    }
    AppToaster.show({
      message,
      intent: 'danger',
      icon: 'error'
    })
  }
)
