import { store } from '../../store';
import { IBookRequest, ITopic, acceptableTypes, IBook, IExpandedBook, IStore } from '../models';
import { postAddBook, postAddTopicsToBook, putToggleTopicAgree, postQueryBookByTopicAndSort,
  postSearchManyForManyComments, getSearchGoogleBooks, getBookSearch, postCreateBookFromInt, postEditBook  } from '../../config';
import {  bookActionTypes as types, userActionTypes as userTypes, appActionTypes as appTypes } from '../actions';
import { Toaster } from '@blueprintjs/core';
import { redirect } from 'redux-first-router'
import { transformBook, bookSorts } from '../utils';
const AppToaster = Toaster.create({
  className: 'keenpagesToaster',
})




export const engagePrecheck = (book: IBook | IExpandedBook | null, auth: boolean = true, cb) => {
  const { user: { loggedIn, user }} = store.getState() as IStore;
  const { active = false } = book || {};
  if (auth && (!loggedIn || !user || !user.profile)) {
    // not logged in, show popup
    AppToaster.show({
      message: `Let's get you logged in first...`
    });
    store.dispatch({
      type: userTypes.toggleAuthModal,
      payload: true
    });
    cb({
      type: 'auth',
      message: 'You must be logged in to perform this action'
    }, null);
    if (active || !book || book === undefined) {
      return;
    }
  }
  if (!active && book) {
    postCreateBookFromInt(book).then(
      (res: any) => cb(null, res.data),
      (err: any) => cb(err, null)
    );
    return;
  }
  cb(null, book);
}



export const searchGoogle = (text: string) => getSearchGoogleBooks(text).then(
  (response: any) => {
    const { data: { items: payload } = { items: []} } = response;
    store.dispatch({
      type: appTypes.setBookSearchResults,
      payload: payload.map((book, i) => ({
        ...transformBook(book),
        _id: `000${i}`,
      }))
    });
  },
  err => AppToaster.show({
    intent: 'danger',
    message: 'Could not get search results.',
    icon: 'error'
  })
)

export const searchBooks = (text, sendToStore: boolean = false) => getBookSearch(text).then(
  (response: any) => {
    const { data: payload = undefined } = response.data || {};
    if (sendToStore) {
      store.dispatch({
        type: types.gotMoreBooks,
        payload
      })
    }
    return payload;
  },
  (err: any) => Promise.reject(err));
  
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

export const addBookFromInt = (book) => postCreateBookFromInt(book).then(
  (res: any) => {
    store.dispatch({
      type: types.gotMoreBooks,
      payload: [res.data]
    });
    return res.data;
  },
  (err: any) => {
    return Promise.reject(err);
  }
)
export const queryMoreBooks = (sort: { [key: string]: any } = bookSorts[0].sort, topics: string[] = [], already: string[] = []) => {
  const { book: {  books }} = store.getState() as IStore;
  return postQueryBookByTopicAndSort(sort, topics, already && already.length ? already : books.map(book => book.gId) || []).then(
    (res: any) => {
      store.dispatch({
        type: types.gotMoreBooks,
        payload: res.data.data.map(book => ({
          ...book,
          comments: []
        }))
      })
      return res.data.data.map(book => ({
        parentType: acceptableTypes.book,
        parentId: book._id
      }))
    },
    (err: any) => {
      let message;
      try {
        message = err.response.data.message
      } catch {
        message = 'Could not get the books you requested.'
      }
      AppToaster.show({
        message,
        intent: 'danger',
        icon: 'error'
      })
    }
  ).then(
    (bookIds: any) => {
      if (!bookIds.length) {
        return;
      }
      return postSearchManyForManyComments({ allRequests: bookIds }).then(
        (res: any) => store.dispatch({
            type: types.addComments,
            payload: res.data
          }),
      (err: any) => {
        let message;
        try {
          message = err.response.data.message
        } catch {
          message = 'Could not get comments for your books.'
        }
        AppToaster.show({
          message,
          intent: 'danger',
          icon: 'error'
        })
      })
    },
    err => {
      let message;
      try {
        message = err.response.data.message
      } catch {
        message = 'Could not get the books you requested.'
      }
      AppToaster.show({
        message,
        intent: 'danger',
        icon: 'error'
      })
    }
  )
}

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
    debugger;
    const { data } = res;
    
    if (!res || !data) {
      return res
    }
    store.dispatch({
      type: types.updateSelected,
      payload: data
    });
    return res
  },
  (err: any) => Promise.reject(err)
)

export const editBookDetails = (bookId: string, details: { [key: string]: any}) => postEditBook(bookId, details).then(
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
);
