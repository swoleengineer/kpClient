import React from 'react';
import { connect } from 'react-redux';
import { IStore } from '../state-management/models';
import AuthWrapper from './authWrapper';
import PageWrapper from './pageWrapper';
import { Toaster } from '@blueprintjs/core';
import AuthModal from './authModal';

export const keenToaster = Toaster.create({
  className: 'keenpagesToaster'
})

const Switcher = ({ page }: { 
  page: string
}) => {
  return (
    <>
      {page.startsWith('auth')
        ? <AuthWrapper page={page} />
        : <PageWrapper page={page} />}
      <AuthModal />
    </>
  )
}

const mapStateToProps = (state: IStore) => ({
  page: state.page
});

export default connect(mapStateToProps)(Switcher);
