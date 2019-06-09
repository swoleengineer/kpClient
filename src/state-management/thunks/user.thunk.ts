import { store } from '../../store';
import { INewUserRequest, IUserLoginRequest, IStore } from '../models';
import { postNewUser, postUserLogin, postSaveBookToUser, postRmBookFrUser,
  postUserAutoAuth, postUserForgotPass, postUserResetPassword
} from '../../config';
import { userActionTypes as types, bookActionTypes as bookTypes } from '../actions';
import { Toaster } from '@blueprintjs/core'
import { redirect } from 'redux-first-router'

const AppToaster = Toaster.create({
  className: 'keenpagesToaster',
})

export const register = (params: INewUserRequest, goToNext: boolean = false, redirectPayload: {
  type: string;
  payload?: any
} = { type: 'HOME' }) => postNewUser(params).then(
  (res: any) => {
    const { user, jwt } = res.data;
    store.dispatch({
      type: types.setUser,
      payload: user
    });
    store.dispatch({
      type: types.updateLoggedIn,
      payload: { loggedIn: true, jwt }
    });
    localStorage.setItem('x-access-token', jwt);
    AppToaster.show({
      message: 'Successfully registered.',
      intent: 'success',
      icon: 'tick',
      onDismiss: () => goToNext ? store.dispatch(redirect(redirectPayload)) : null
    });
  },
  (err: any) => {
    console.log(err, err.response.data);
    AppToaster.show({
      message: err.response.data.message || 'Could not register your account. Please try again later.',
      intent: 'danger',
      icon: 'error'
    })
  }
)

export const login = (params: IUserLoginRequest, goToNext: boolean = false, redirectPayload: {
  type: string;
  payload?: any
} = { type: 'HOME' }) => postUserLogin(params).then(
  ({ data }) => {
    const { user, jwt } = data;
    store.dispatch({
      type: types.setUser,
      payload: user
    });
    store.dispatch({
      type: types.updateLoggedIn,
      payload: { loggedIn: true, jwt }
    });
    localStorage.setItem('x-access-token', jwt);
    AppToaster.show({
      message: `Welcome ${user.profile.first_name}`,
      intent: 'success',
      icon: 'tick',
      onDismiss: () => goToNext ? store.dispatch(redirect(redirectPayload)) : null
    });
  },
  err => {
    console.log(err, err.response.data);
    AppToaster.show({
      message: err.response.data.message || 'Could not log you in. Please try again later.',
      intent: 'danger',
      icon: 'error'
    })
  }
)

export const autoLogin = () => {
  const token = localStorage.getItem('x-access-token');
  if (!token) {
    return;
  }
  postUserAutoAuth({ token }).then(
    (res: any) => {
      const { user, jwt } = res.data || { jwt: undefined, user: undefined };
      store.dispatch({
        type: types.setUser,
        payload: user
      });
      store.dispatch({
        type: types.updateLoggedIn,
        payload: { loggedIn: true, jwt }
      });
      localStorage.setItem('x-access-token', jwt);
      AppToaster.show({
        message: `Welcome ${user.profile.first_name}`,
        intent: 'success',
        icon: 'tick',
      });
    },
    (err: any) => {
      localStorage.removeItem('x-access-token');
    }
  )
}

export const toggleUserBook = (id: string, list: 'readBooks' | 'savedBooks', type: 'add' | 'remove') => ({
  add: postSaveBookToUser,
  remove: postRmBookFrUser
}[type])(id, list).then(
  (res: any) => {
    const { book, user } = res.data || { book: undefined, user: undefined};
    if (!book || !user) {
      throw { response: { data: { message: 'Could not manage this book in your account.'}}};
      return;
    }
    store.dispatch({
      type: types.updateSavedBook,
      payload: { type, list, book }
    });
    if (list === 'savedBooks') {
      store.dispatch({
        type: bookTypes.updateBookLike,
        payload: {
          type,
          like: user._id,
          book: id
        }
      });
    }
    
    
    AppToaster.show({
      message: `'${book.title}' ${type === 'add' ? 'saved to' : 'removed from'} your ${list === 'readBooks' ? 'library' : 'saved books'}.`,
      intent: 'none',
      icon: type === 'add' && user.savedBooks.includes(id)
        ? 'book'
        : list === 'savedBooks'
          ? 'bookmark'
          : 'book'
    })
  },
  (err: any) => {
    console.log(err.response.data);
    AppToaster.show({
      message: 'Could not update this book in your account.',
      intent: 'danger',
      icon: 'error'
    })
  }
);

export const isLoggedIn = () => {
  const { user: { loggedIn } } = store.getState() as IStore;
  return loggedIn;
}

export const logUserOut = () => {
  localStorage.removeItem('x-access-token');
  store.dispatch({ type: types.userLogout });
  AppToaster.show({
    message: `You've been logged out.`,
    intent: 'none',
    icon: 'log-out'
  })
}

export const submitForgotPass = (params: { email: string }, goToNext: boolean = false, redirectPayload: {
  type: string;
  payload?: any
} = { type: 'HOME' }) => postUserForgotPass(params).then(
  () => 'If we have an account for that address, you should receive a reset link soon. Please check your email (Check spam/junk too!) for a link to reset your password.',
  (err: any) => {
    let message;
    try {
      message = err.response.data.message
    } catch {
      message = 'Could not generate and send token to reset your password. Please try again later.'
    }
    return message;
  }
)


export const submitResetPass = (params: { password: string }, goToNext: boolean = false, redirectPayload: {
  type: string;
  payload?: any
} = { type: 'HOME' }) => {
  const { ocation: { payload: { token }}} = store.getState();
  return postUserResetPassword({ password: params.password, token }).then(
    (res: any) => {
      const { user, jwt } = res.data || { jwt: undefined, user: undefined };
      store.dispatch({
        type: types.setUser,
        payload: user
      });
      store.dispatch({
        type: types.updateLoggedIn,
        payload: { loggedIn: true, jwt }
      });
      localStorage.setItem('x-access-token', jwt);
      AppToaster.show({
        message: `Password updated. You are now logged in.`,
        intent: 'success',
        icon: 'tick',
        onDismiss: () => goToNext ? store.dispatch(redirect(redirectPayload)) : null
      });
    },
    (err: any) => {
      let message;
      try {
        message = err.response.data.message
      } catch {
        message = 'Application error resetting your password.'
      }
      AppToaster.show({
        message,
        intent: 'danger',
        icon: 'error'
      })
    }
  )
}
