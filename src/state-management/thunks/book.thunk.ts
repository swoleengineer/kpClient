import { store } from '../../store';
import { IBookRequest, ITopic } from '../models';
import { postAddBook, postAddTopicsToBook, putToggleTopicAgree  } from '../../config';
import {  bookActionTypes as types } from '../actions';
import { Toaster } from '@blueprintjs/core';
import { redirect } from 'redux-first-router'

const AppToaster = Toaster.create({
  className: 'keenpagesToaster',
})



export const createBook = (params: IBookRequest, goToNext: boolean = false, redirectPayload: {
  type: string;
  payload?: any
} = { type: 'HOME' }) => postAddBook(params).then(
  (res: any) => {
    const newBook = res.data;
    store.dispatch({
      type: types.updateSingleBook,
      payload: newBook
    });
    AppToaster.show({
      message: `${newBook.title} successfully created.`,
      intent: 'success',
      icon: 'tick',
      onDismiss: () => goToNext ? store.dispatch(redirect(redirectPayload)) : null
    })
    return res.data
  },
  (err: any) => {
    let message;
    try {
      const { message: mesaj =  '' } = { ...err.response.data, ...(err.response.data.data || {}) }
      message = mesaj
    } catch {
      message = 'Could not create this book. Please try again later'
    }
    AppToaster.show({
      message,
      intent: 'danger',
      icon: 'error'
    })
  }
)

export const toggleTopicAgreeBook = (bookId: string, topicId: string) => putToggleTopicAgree(bookId, topicId).then(
  (res: any) => {
    if (!res || !res.data) {
      throw { response: { data: {
        message: 'Error updating topics for this book',
        status: 400,
        data: false
      }}};
      return;
    }
    store.dispatch({
      type: types.updateSelected,
      payload: res.data
    });
  },
  (err: any) => {
    let message;
    try {
      const { message: mesaj =  '' } = { ...err.response.data, ...(err.response.data.data || {}) }
      message = mesaj
    } catch {
      message = 'Could not update topic status'
    }
    AppToaster.show({
      message,
      intent: 'danger',
      icon: 'error'
    })
  }
);

export const addTopicsToBook = (book: string, topics: ITopic[]) => postAddTopicsToBook(book, { topics }).then(
  (res: any) => {
    if (!res || !res.data) {
      throw { response: { data: {
        message: 'Error updating topics for this book',
        status: 400,
        data: false
      }}};
      return;
    }
    store.dispatch({
      type: types.updateSelected,
      payload: res.data
    });
  },
  (err: any) => {
    let message;
    try {
      message = err.response.data.message
    } catch {
      message = 'Could not update topics for this book.'
    }
    AppToaster.show({
      message,
      intent: 'danger',
      icon: 'error'
    })
  }
)
