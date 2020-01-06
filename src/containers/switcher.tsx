import React from 'react';
import { connect } from 'react-redux';
import { IStore } from '../state-management/models';
import { appActionTypes } from '../state-management/actions';
import AuthWrapper from './authWrapper';
import PageWrapper from './pageWrapper';
import { Toaster, ResizeSensor } from '@blueprintjs/core';
import AuthModal from './authModal';

export const keenToaster = Toaster.create({
  className: 'keenpagesToaster'
})

const Switcher = ({ page, updateViewPort, searchText }: { 
  page: string;
  updateViewPort: Function;
  searchText: string
}) => {
  return (
    <ResizeSensor onResize={() => updateViewPort()}>
      <>
        {page.startsWith('auth')
          ? <AuthWrapper page={page} />
          : <PageWrapper page={page} searchText={searchText} />}
        <AuthModal />
      </>
    </ResizeSensor>
  );
}

const mapStateToProps = (state: IStore) => ({
  page: state.page,
  searchText: state.app.home.searchText
});

const mapDispatch = dispatch => ({
  updateViewPort: () => dispatch({ type: appActionTypes.updateViewPort })
})
export default connect(mapStateToProps, mapDispatch)(Switcher);
