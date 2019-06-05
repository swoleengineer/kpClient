import { store } from '../../store';
import { IBookRequest } from '../models';
import { postAddBook } from '../../config';
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
