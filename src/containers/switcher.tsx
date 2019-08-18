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

const Switcher = ({ page, updateViewPort }: { 
  page: string;
  updateViewPort: Function;
}) => {
  return (
    <ResizeSensor onResize={() => updateViewPort()}>
      <>
        {page.startsWith('auth')
          ? <AuthWrapper page={page} />
          : <PageWrapper page={page} />}
        <AuthModal />
      </>
    </ResizeSensor>
  );
}

const mapStateToProps = (state: IStore) => ({
  page: state.page
});

const mapDispatch = dispatch => ({
  updateViewPort: () => dispatch({ type: appActionTypes.updateViewPort })
})
export default connect(mapStateToProps, mapDispatch)(Switcher);
