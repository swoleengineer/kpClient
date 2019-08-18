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
          ...action.payload,
          role: (action.payload.username  && ['swoleengineer', 'clervius'].includes(action.payload.username))
            || (action.payload.email && ['clervius@gmail.com', 'joram@keenpages.com', 'hello@keenpages.com'].includes(action.payload.email))
            || action.payload.role && action.payload.role === 'admin'
            ? 'admin'
            : action.payload.role
        }
      };
    case types.setUser:
      return {
        ...state,
        user: {
          ...action.payload,
          role: (action.payload.username  && ['swoleengineer', 'clervius'].includes(action.payload.username))
            || (action.payload.email && ['clervius@gmail.com', 'joram@keenpages.com', 'hello@keenpages.com'].includes(action.payload.email))
            || action.payload.role && action.payload.role === 'admin'
            ? 'admin'
            : action.payload.role

        }
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
      };
    case types.setUserStats:
      return {
        ...state,
        userStats: action.payload
      };
    case types.updateUserStats:
      return {
        ...state,
        userStats: {
          ...state.userStats,
          ...action.payload
        }
      };
    case types.setTopicToAdd:
      return {
        ...state,
        topicForStat: action.payload
      };    
    default:
      return state;
  }
}
