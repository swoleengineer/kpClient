import React from 'react';
import { connect } from 'react-redux';
import { IStore, AlertIntents } from '../state-management/models';
import { showMessage } from '../state-management/thunks'
import { IUserState } from '../state-management/models/user.state';
import { LocationState, redirect } from 'redux-first-router';
import AuthWrapper from './authWrapper';
import PageWrapper from './pageWrapper';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store } from '../store';
import { AppDataActionTypes } from '../state-management/actions';
import { pick, has } from 'lodash';

const Switcher = ({ page, user, location,
}: { 
  page: string;
  user: IUserState;
  location: LocationState;
}) => {
  const authPage = page.startsWith('auth');
  if (!authPage && !user.jwt) {3
    // showMessage(AlertIntents.warning, 'Restricted', 'You must be logged in to access the dashboard.');
    // use alert module to let them know they have to be logged in to access this resource.
    store.dispatch({
      type: AppDataActionTypes.ADD_ROUTE,
      payload: { ...pick(store.getState().location, ['type', 'payload'])}
    });
    store.dispatch(redirect({ type: 'HOME' }));
    return null;
  }
  if (has(store.getState().appData, 'nextRoute')) {
    store.dispatch({ type: AppDataActionTypes.CLEAR_ROUTE });
  } 
  return (
    <div className=''>
      {authPage ? <AuthWrapper page={page} /> : <PageWrapper page={page} />}
      <ToastContainer />
    </div>
  )
  
}


const mapStateToProps = (state: IStore) => ({
  page: state.page,
  user: state.user,
  location: state.location
});
export default connect(mapStateToProps)(Switcher);
