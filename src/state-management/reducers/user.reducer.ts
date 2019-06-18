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
    case types.userLogout:
      return initialUserState;
    case types.updateSavedBook:
      return {
        ...state,
        user: {
          ...state.user,
          [action.payload.list]: action.payload.type === 'add'
            ? state.user[action.payload.list].filter(book => book._id !== action.payload.book._id).concat(action.payload.book)
            : state.user[action.payload.list].filter(book => book._id !== action.payload.book._id)
        }
      }
    case types.toggleAuthModal:
      return {
        ...state,
        showAuthModal: action.payload
      };
    case types.setAuthModalPage:
      return {
        ...state,
        authModalActivePage: action.payload
      }
    default:
      return state;
  }
}
