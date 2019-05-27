import React from 'react';
import { connect } from 'react-redux';
import { IStore } from '../state-management/models';
import { LocationState } from 'redux-first-router';
import AuthWrapper from './authWrapper';
import PageWrapper from './pageWrapper';

const Switcher = ({ page, location,
}: { 
  page: string;
  location: LocationState;
}) => {
  console.log('whats in here', page)
  const authPage = page.startsWith('auth');
  // if (has(store.getState().appData, 'nextRoute')) {
  //   store.dispatch({ type: AppDataActionTypes.CLEAR_ROUTE });
  // } 
  return (
    <div className=''>
      {authPage ? <AuthWrapper page={page} /> : <PageWrapper page={page} />}
    </div>
  )
  
}


const mapStateToProps = (state: IStore) => ({
  page: state.page,
  user: state.user,
  location: state.location
});
export default connect(mapStateToProps)(Switcher);
