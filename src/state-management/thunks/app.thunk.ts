import { store } from '../../store';
import { AuthModalTypes } from '../models';
import { userActionTypes as userTypes } from '../actions';



export const showModal = (page: AuthModalTypes) => {
  store.dispatch({
    type: userTypes.toggleAuthModal,
    payload: true
  });
  store.dispatch({
    type: userTypes.setAuthModalPage,
    payload: page
  })
}
