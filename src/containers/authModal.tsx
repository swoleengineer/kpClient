import React from 'react';
import { connect } from 'react-redux';
import { IStore, AuthModalTypes } from '../state-management/models';
import { Overlay, Classes, Card, Button, ButtonGroup } from '@blueprintjs/core';
import '../app.css';
import Logo from '../components/header/logo';
import pageMap from './pageMap';
import { userActionTypes as userTypes } from '../state-management/actions';
import { authSettings } from './authSettings';

const AuthModal = (props: {
  showModal: boolean;
  activePage: AuthModalTypes;
  setModal: Function;
  changePage: Function;
}) => {
  const { showModal, activePage, setModal, changePage } = props;
  const Display = pageMap[activePage];
  const pageType = activePage.split('/')[activePage.split('/').length - 1];
  const { cardWidth, pageSubtitle, pageTitle, pageDescription, style = {} } = authSettings[pageType];
  return (
    <Overlay
      isOpen={showModal}
      autoFocus={true}
      canEscapeKeyClose={true}
      hasBackdrop={true}
      usePortal={true}
      className={`${Classes.OVERLAY_SCROLL_CONTAINER} authModalWrapper row`}
    >
      <Card elevation={3} className={`${cardWidth} authModalCard`}>
        <header className='authModalHeader'>
          <Logo large={true} />
          <h5>
            <strong>{pageTitle}</strong>
            <small>{pageSubtitle}</small>
            <small>{pageDescription}</small>
          </h5>
          <Button className='authModalDismissBtn' icon='cross' intent='danger' minimal={true} onClick={() => setModal(false)} />
        </header>
        <div className='authModalMiddleLinks'>
          {pageType === 'login' && <ButtonGroup fill={true}>
            <Button
              text='Register'
              small={true}
              onClick={() => changePage(AuthModalTypes.register)}
            />
            <Button
              text='Forgot password'
              small={true}
              onClick={() => changePage(AuthModalTypes.forgot)}
            />
          </ButtonGroup>}
          {['register', 'forgot'].includes(pageType) && <ButtonGroup fill={true}>
            <Button
              text='Login'
              small={true}
              onClick={() => changePage(AuthModalTypes.login)}
            />
          </ButtonGroup>}
        </div>
        <br />
        <Display goToNext={false} callBack={() => setModal(false)} style={style}/>
      </Card>
    </Overlay>
  )
}

const mapStateToProps = (state: IStore) => ({
  showModal: state.user.showAuthModal,
  activePage: state.user.authModalActivePage
});

const mapDispatch = dispatch => ({
  setModal: (shown: boolean) => dispatch({ type: userTypes.toggleAuthModal, payload: shown }),
  changePage: (page: AuthModalTypes) => dispatch({ type: userTypes.setAuthModalPage, payload: page })
})

export default connect(mapStateToProps, mapDispatch)(AuthModal);
