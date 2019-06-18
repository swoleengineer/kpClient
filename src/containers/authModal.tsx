import React from 'react';
import { connect } from 'react-redux';
import { IStore } from '../state-management/models';
import { Overlay, Classes, Card, Button } from '@blueprintjs/core';
import '../app.css';
import Logo from '../components/header/logo';
import pageMap from './pageMap';
import { userActionTypes as userTypes } from '../state-management/actions';

const AuthModal = (props: {
  showModal: boolean;
  activePage: 'auth/login' | 'auth/register' | 'auth/forgotPw/forgot';
  setModal: Function;
}) => {
  const { showModal, activePage, setModal } = props;
  console.log(`inmodal: ${showModal}`)
  const Display = pageMap[activePage];
  return (
    <Overlay
      isOpen={showModal}
      autoFocus={true}
      canEscapeKeyClose={true}
      hasBackdrop={true}
      usePortal={true}
      className={`${Classes.OVERLAY_SCROLL_CONTAINER} authModalWrapper`}
    >
      <Card elevation={3} className='authModalCard'>
        <header className='authModalHeader'>
          <Logo large={true} />
          <h6><strong>Keen Pages is way better when you're logged in</strong></h6>
          <Button className='authModalDismissBtn' icon='cross' intent='danger' minimal={true} onClick={() => setModal(false)} />
        </header>
        
        <Display goToNext={false} callBack={() => setModal(false)}/>
      </Card>
    </Overlay>
  )
}

const mapStateToProps = (state: IStore) => ({
  showModal: state.user.showAuthModal,
  activePage: state.user.authModalActivePage
});

const mapDispatch = dispatch => ({
  setModal: (shown: boolean) => dispatch({ type: userTypes.toggleAuthModal, payload: shown })
})

export default connect(mapStateToProps, mapDispatch)(AuthModal);
