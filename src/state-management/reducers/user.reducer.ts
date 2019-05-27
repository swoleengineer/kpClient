import { userActionTypes as types } from '../actions';
import { IUserState } from '../models';
import { initialUserState  } from '../utils';

export const userReducer = (state: IUserState = initialUserState, action: {
  type: string;
  payload?: any
}): IUserState => {
  switch(action.type) {
    case types.updateUser:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      };
    case types.setUser:
      return {
        ...state,
        user: action.payload
      };
    case types.updateLoggedIn:
      return {
        ...state,
        loggedIn: action.payload.loggedIn,
        jwt: action.payload.jwt
      }
    default:
      return state;
  }
}
