import { store } from '../../store';
import { INewUserRequest, IUserLoginRequest, IStore } from '../models';
import { postNewUser, postUserLogin } from '../../config';
import { userActionTypes as types } from '../actions';
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


export const isLoggedIn = () => {
  const { user: { loggedIn } } = store.getState() as IStore;
  return loggedIn;
}
