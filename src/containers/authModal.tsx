import React from 'react';
import { connect } from 'react-redux';
import { IStore, AuthModalTypes } from '../state-management/models';
import { Overlay, Classes, Card, Button } from '@blueprintjs/core';
import '../app.css';
import Logo from '../components/header/logo';
import pageMap from './pageMap';
import { userActionTypes as userTypes } from '../state-management/actions';
import { authSettings } from './authSettings';
import Icon from '../components/icons';

const AuthModal = (props: {
  showModal: boolean;
  activePage: AuthModalTypes;
  setModal: Function;
  changePage: Function;
  data: any
}) => {
  const { showModal, activePage, setModal, changePage, data } = props;
  const Display = pageMap[activePage];
  const pageType = activePage.split('/')[activePage.split('/').length - 1];
  const { cardWidth, pageSubtitle, pageTitle, pageDescription, style = {}, hideHeader = false, outsideClose = false } = authSettings[pageType];
  return (
    <Overlay
      isOpen={showModal}
      autoFocus={true}
      canEscapeKeyClose={true}
      hasBackdrop={true}
      usePortal={true}
      backdropProps={{
        onClick: () => outsideClose ? setModal(false) : undefined
      }}
      className={`${Classes.OVERLAY_SCROLL_CONTAINER} authModalWrapper row`}
      lazy={true}
      transitionName={Classes.OVERLAY}
    >
      <Card elevation={3} className={`${cardWidth} authModalCard`}>
        {!hideHeader && (
          <header className='authModalHeader'>
            <h5>
              <strong><Logo large={true} noText={true} dark={true}/> {pageTitle}</strong>
              <small>{pageSubtitle}</small>
              <small>{pageDescription}</small>
            </h5>
            <Button className='authModalDismissBtn' icon={<Icon icon='fa-times' />} intent='none' minimal={true} onClick={() => setModal(false)} />
          </header>
        )}
        <div className='authModalMiddleLinks'>
          {pageType === 'login' && (
            <div className='authBtnHolder'>
              <Button
                text='Register'
                small={true}
                onClick={() => changePage(AuthModalTypes.register)}
                minimal={true}
              />
              <Button
                text='Forgot password'
                small={true}
                onClick={() => changePage(AuthModalTypes.forgot)}
                minimal={true}
              />
            </div>
          )}
          {['register', 'forgot'].includes(pageType) && (
            <div className='authBtnHolder'>
              <Button
                text='Login'
                small={true}
                onClick={() => changePage(AuthModalTypes.login)}
                minimal={true}
              />
            </div>
          )}
        </div>
        {!hideHeader && <br />}
        <Display goToNext={false} callBack={() => setModal(false)} style={style} data={data}/>
      </Card>
    </Overlay>
  )
}

const mapStateToProps = (state: IStore) => ({
  showModal: state.user.showAuthModal,
  activePage: state.user.authModalActivePage,
  data: state.user.authModalData
});

const mapDispatch = dispatch => ({
  setModal: (shown: boolean) => dispatch({ type: userTypes.toggleAuthModal, payload: shown }),
  changePage: (page: AuthModalTypes) => dispatch({ type: userTypes.setAuthModalPage, payload: page })
})

export default connect(mapStateToProps, mapDispatch)(AuthModal);
