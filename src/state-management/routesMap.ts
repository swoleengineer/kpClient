import { getSingleBook, postSearchManyComments } from '../config'
import { IBook, acceptableTypes } from './models';
import { bookActionTypes as bookTypes } from './actions';
import { Toaster } from '@blueprintjs/core';
import { redirect } from 'redux-first-router';
// const wait = (seconds: number) => new Promise((resolve) => setTimeout(() => resolve(), seconds * 1000));


const AppToaster = Toaster.create({
  className: 'keenpagesToaster',
})

const routesMap = { 
  HOME: {
    path: '/',
    thunk: (dispatch: Function, getState: Function) => {
    }
  },
  LOGIN: {
    path: '/login'
  },
  FORGOTPASSWORD: {
    path: '/forgot',
    thunk: (dispatch, getState) => {
    }
  },
  REGISTER: {
    path: '/register',
    thunk: (dispatch, getState) => {
    }
  },
  RESETPASSWORD: {
    path: '/pwReset/:token',
    thunk: (dispatch: Function, getState: Function) => {
    }
  },
  NEWTOPIC: {
    path: '/newTopic'
  },
  NEWBOOK: {
    path: '/newBook',
  },
  NEWQUESTION: {
    path: '/newQuestion'
  },
  ALLBOOKS: {
    path: '/books'
  },
  SINGLEBOOK: {
    path: '/book/:id',
    thunk: (dispatch, getState) => {
      console.log('In the single book thunjk')
      const { location: { payload: { id }}} = getState();
      getSingleBook(id).then(
        ({ data }: { data: IBook }) => {
          console.log('got the book data')
          dispatch({
            type: bookTypes.selectBook,
            payload: { ...data, comments: [] }
          });
          return data;
        },
        (err) => {
          AppToaster.show({
            message: 'Could not load book details. Please try again later.',
            intent: 'danger',
            icon: 'error'
          })
        }
      ).then((book) => postSearchManyComments({ parentId: book._id, parentType: acceptableTypes.book }).then(
        (res: any) => {
          dispatch({
            type: bookTypes.updateSelected,
            payload: {
              comments: res.data.data
            }
          })
        },
        (err: any) => {
          let message;
          try {
            message = err.response.data.message
          } catch {
            message = 'Could not get comments for this book.'
          };
          console.log(message, err);
        }
      )
      ).catch(() => AppToaster.show({
        message: 'Error getting the details for this book',
        intent: 'danger',
        icon: 'error',
        onDismiss: () => dispatch(redirect({ type: 'HOME' }))
      }))
    }
  },
  PROFILE: {
    path: '/profile',
    thunk: (dispatch, getState) => {
    }
  },
}

export { routesMap }
