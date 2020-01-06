import { getSingleBook, postSearchManyComments, getSingleQuestion, getSingleShelfReq } from '../config'
import { IBook, acceptableTypes, IQuestion, IUserPages, IStore, ProfileNavOptions } from './models';
import { bookActionTypes as bookTypes, questionActionTypes as questionTypes, userActionTypes as userTypes } from './actions';
import { Toaster } from '@blueprintjs/core';
import { redirect } from 'redux-first-router';
// const wait = (seconds: number) => new Promise((resolve) => setTimeout(() => resolve(), seconds * 1000));

// import { getGoodReadsData } from '../components/pages/main/books/single/utils';
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

  },
  REGISTER: {
    path: '/register',
    thunk: (dispatch, getState) => {
    }
  },
  RESETPASSWORD: {
    path: '/pwReset/:token',
    thunk: (dispatch: Function, getState: Function) => {
      const { location: { payload: { token }}} = getState();
      if (!token) {
        AppToaster.show({
          message: 'You do not have a valid token. Please make sure you have clicked on a link from your email.',
          intent: 'danger',
          icon: 'error',
          onDismiss: () => dispatch(redirect({ type: 'FORGOTPASSWORD' }))
        });
      }
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
  ALLQUESTIONS: {
    path: '/questions'
  },
  SINGLEQUESTION: {
    path: '/question/:id',
    thunk: (dispatch, getState) => {
      const { location: { payload: { id }}} = getState();
      getSingleQuestion(id).then(
        ({ data }: { data: IQuestion }) => {
          dispatch({
            type: questionTypes.setSelected,
            payload: {
              ...data,
              comments: [],
              reports: []
            }
          });
          return data;
        },
        (err) => {
          AppToaster.show({
            message: 'Could not load question details. Please try again later.',
            intent: 'danger',
            icon: 'error'
          })
        }
      ).then((question) => postSearchManyComments({ parentId: question._id, parentType: acceptableTypes.question }).then(
        (res: any) => {
          dispatch({
            type: questionTypes.updateSelected,
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
            message = 'Could not get comments for this question.'
          };
          console.log(message, err);
        }
      )).catch(() => AppToaster.show({
        message: 'Error getting the details for this question',
        intent: 'danger',
        icon: 'error',
        onDismiss: () => dispatch(redirect({ type: 'HOME' }))
      }))
    }
  },
  ALLBOOKS: {
    path: '/books'
  },
  SINGLEBOOK: {
    path: '/book/:id',
    thunk: (dispatch, getState) => {
      const { location: { payload: { id }}} = getState();
      getSingleBook(id).then(
        ({ data }: { data: IBook }) => {
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
    path: '/account',
    thunk: (dispatch, getState) => {
      const { user } = getState() as IStore;
      if (!user.loggedIn && !user.jwt && !Object.keys(user.user || {}).length) {
        AppToaster.show({
          message: 'You must be logged in to access this page.',
          icon: 'lock',
          intent: 'danger'
        });
        dispatch(redirect({ type: 'HOME' }));
        return;
      }
      dispatch(redirect({ type: 'MYPAGE', payload: { page: 'stats' } }));
    }
  },
  INBETWEEN: {
    path: '/account/:page',
    thunk: (dispatch, getState) => {
      console.log('in the in between')
      const { location: { payload: { page, part }}} = getState();
      const defaultPart = {
        [ProfileNavOptions.stats]: 'inProgress',
        [ProfileNavOptions.lists]: 'readBooks',
        [ProfileNavOptions.account]: 'account'
      }
      if (!part) {
        dispatch(redirect({ type: 'MYPAGE', payload: { page, part: defaultPart[page] }}))
      }
    }
  },
  MYPAGE: {
    path: '/account/:page/:part',
    thunk: (dispatch, getState) => {
      const { location: { payload: { page, part }}} = getState();
      const defaultPart = {
        [ProfileNavOptions.stats]: 'inProgress',
        [ProfileNavOptions.lists]: 'readBooks',
        [ProfileNavOptions.account]: 'account'
      }
      if (!part) {
        dispatch(redirect({ type: 'MYPAGE', payload: { page, part: defaultPart[page] }}))
      }
      if (!IUserPages.includes(page) || !page) {
        dispatch(redirect({ type: 'MYPAGE', payload: { page: 'stats' }}));
        return;
      }
      if (page === ProfileNavOptions.lists && part && !['readBooks', 'savedBooks', 'likedBooks'].includes(part)) {
        dispatch({
          type: userTypes.setSelectedShelf,
          payload: null
        })
        getSingleShelfReq(part).then(
          (res: any) => {
            console.log(res.data);
            dispatch({
              type: userTypes.setSelectedShelf,
              payload: res.data
            })
          },
          err => {
            console.error(err)
            AppToaster.show({
              message: 'Error retrieving shelf details.',
              intent: 'danger',
              icon: 'error',
              onDismiss: () => dispatch(redirect({
                type: 'MYPAGE',
                payload: { page, part: defaultPart[page] }
              }))
            })
          }
        )
      }
    }
  },
  PRIVACY: '/privacy-statement',
  TERMS: '/terms-service'
}

export { routesMap }
