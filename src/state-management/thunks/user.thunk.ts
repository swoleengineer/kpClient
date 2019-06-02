import { store } from '../../store';
import { INewUserRequest } from '../models';
import { postNewUser } from '../../config';
import { userActionTypes as types } from '../actions';
import { Toaster } from '@blueprintjs/core'
import { redirect } from 'redux-first-router'

const AppToaster = Toaster.create({
  className: 'keenpagesToaster',
})

export const register = (params: INewUserRequest) => postNewUser(params).then(
  (res: any) => {
    store.dispatch({
      type: types.setUser,
      payload: res.user
    });
    store.dispatch({
      type: types.updateLoggedIn,
      payload: {
        loggedIn: true,
        jwt: res.jwt
      }
    });
    AppToaster.show({
      message: 'Successfully registered.',
      intent: 'success',
      icon: 'tick',
      onDismiss: () => store.dispatch(redirect({ type: 'HOME'}))
    });
  },
  (err: any) => {
    debugger;
    console.log(err);
  }
)
