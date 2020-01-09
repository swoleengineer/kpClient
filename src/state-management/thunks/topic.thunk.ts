import { store } from '../../store';
import { ITopicRequest } from '../models';
import { postCreateTopic } from '../../config';
import { topicActionTypes as types } from '../actions';
import { Toaster } from '@blueprintjs/core';
import { redirect } from 'redux-first-router'

const AppToaster = Toaster.create({
  className: 'keenpagesToaster',
})

export const createTopic = (params: ITopicRequest, goToNext: boolean = false, redirectPayload: {
  type: string;
  payload?: any
} = { type: 'HOME' }) => postCreateTopic(params).then(
  (res: any) => {
    const newTopic = res.data;
    store.dispatch({
      type: types.updateSingle,
      payload: {
        type: 'add',
        topic: newTopic
      }
    });
    AppToaster.show({
      message: `'${newTopic.name}' added.`,
      icon: 'tick',
      onDismiss: () => goToNext ? store.dispatch(redirect(redirectPayload)) : null
    });
    return newTopic;
  },
  (err: any) => {
    let message;
    try {
      message = err.response.data.message
    } catch {
      message = 'Could not create this topic. Please try again later'
    }
    AppToaster.show({
      message,
      icon: 'error'
    });
    return Promise.reject(err);
  }
)
