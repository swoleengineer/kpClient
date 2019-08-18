import React from 'react';
import Logo from './logo';
import { connect } from 'react-redux';
import { IStore, IUserState, IAppState } from 'src/state-management/models';
import { Button, Popover, Menu, MenuItem, MenuDivider } from '@blueprintjs/core';
// import Link from 'redux-first-router-link';
import { redirect } from 'redux-first-router';
import KeenIcon from '../icons';
import { showAuthModal } from '../../state-management/thunks';
import { AuthModalTypes } from '../../state-management/models';

// interface IHeaderMenuItem {
//   text: string;
//   icon?: any;
//   navPayload: {
//     type: string;
//     payload?: any;
//   }
// }
const Header = (props: { user: IUserState; style: any; linkTo: Function; viewPort: IAppState['viewPort'] }) => {
  const { loggedIn, user } = props.user;
  const linkTo = props.linkTo;
  const { username } = user || { username: undefined };
  return (
    <header className={'appHeader loggedInHeader'} style={props.style}>
      <div className='container headerWrapper'>
        <div className='row'>
          <div className='col-12'>
            <div className='logoArea'>
              <Logo large={false} dark={true} noText={props.viewPort === 'mobile' && loggedIn} />
            </div>
            <div className='menuArea'>
              <div className='authStatusWrapper'>
                {loggedIn
                  ? <div className='headerUserBtns'>
                      <Button
                        small={true}
                        minimal={true}
                        icon={<KeenIcon icon='fa-tasks-alt' />}
                        text={<span className='hidden-sm'>Stats</span>}
                        onClick={() => linkTo({ type: 'MYPAGE' })}
                      />
                      <Popover popoverClassName='headerUserMenu'>
                        <Button
                          small={true}
                          minimal={true}
                          text={username}
                          icon={'user'}
                        />
                        <Menu>
                          <MenuItem
                            icon={<KeenIcon icon='fa-tasks-alt' color={true} />}
                            text='My Stats'
                          />
                          <MenuItem
                            icon={<KeenIcon icon='fa-books' color={true} />}
                            text='My Library'
                          />
                          <MenuItem
                            icon={<KeenIcon icon='fa-user-circle' color={true} />}
                            text='My Profile'
                          />
                          <MenuDivider />
                          <MenuItem
                            icon={<KeenIcon icon='fa-books-medical' color={true} />}
                            text='Track Topic'
                          />
                          <MenuItem
                            icon={<KeenIcon icon='fa-hands-helping' color={true} />}
                            text='Get Suggestion'
                          />
                          <MenuDivider />
                          <MenuItem
                            icon={<KeenIcon icon='fa-sign-out-alt' color={true} />}
                            text='Log out'
                          />
                        </Menu>
                      </Popover>
                    </div>
                  : <div className='loggedOutLinks'>
                    <span onClick={() => showAuthModal(AuthModalTypes.login)}>Login</span> | <span onClick={() => showAuthModal(AuthModalTypes.register)}>Register</span>
                  </div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

const mapStateToProps = (state: IStore) => ({
  user: state.user,
  viewPort: state.app.viewPort
})

const mapDispatch = dispatch => ({
  linkTo: payload => dispatch(redirect(payload))
});

export default connect(mapStateToProps, mapDispatch)(Header);
