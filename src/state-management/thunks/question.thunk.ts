import { store } from '../../store';
import { IQuestionRequest } from '../models';
import { postCreateQuestion } from '../../config';
import { questionActionTypes as types } from '../actions';
import { Toaster } from '@blueprintjs/core';
import { redirect } from 'redux-first-router'

const AppToaster = Toaster.create({
  className: 'keenpagesToaster',
})


export const createQuestion = (params: IQuestionRequest, goToNext: boolean = false, redirectPayload: {
  type: string;
  payload?: any
} = { type: 'HOME' }) => postCreateQuestion(params).then(
  (res: any) => {
    const { data: payload = undefined } = res;
    if (!payload) {
      AppToaster.show({
        message: 'Something went wrong with this request.',
        intent: 'warning',
        icon: 'error'
      });
      return;
    }
    store.dispatch({ type: types.updateSingleQuestion, payload });
    AppToaster.show({
      message: 'Question added.',
      intent: 'success',
      icon: 'tick',
      onDismiss: () => goToNext ? store.dispatch(redirect(redirectPayload)) : null
    });
    return payload;
  },
  (err: any) => {
    let message;
    try {
      message = err.response.data.message
    } catch {
      message = 'Could not create this question. Please try again later'
    }
    AppToaster.show({ message, intent: 'danger', icon: 'error' })
  }
);
