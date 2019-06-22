import React from 'react';
import Logo from './logo';
import { connect } from 'react-redux';
import { IStore, IUserState } from 'src/state-management/models';
import { Icon, Popover, Menu, MenuItem } from '@blueprintjs/core';
import Link from 'redux-first-router-link';
import { logUserOut } from '../../state-management/thunks';
import { redirect } from 'redux-first-router';

const Header = (props: { user: IUserState, style: any, linkTo: Function }) => {
  const { loggedIn, user } = props.user;
  const linkTo = props.linkTo;
  const { username } = user || { username: undefined };
  return (
    <header className='appHeader' style={props.style}>
      <div className='container headerWrapper'>
        <div className='row'>
          <div className='col-12'>
            <div className='logoArea'>
              <Logo large={false}/>
            </div>
            <div className='menuArea'>
              <div className='authStatusWrapper'>
                {loggedIn
                  ? <Popover>
                      <span><Icon icon={'user'} /> &nbsp;{username} | Log Out</span>
                      <Menu>
                        <MenuItem icon='user' text={'Edit Account'} onClick={() => linkTo({ type: 'PROFILE' })}/>
                        <MenuItem icon='book' text={'Saved Books'}  label={`${user.savedBooks.length || 0}`} onClick={() => linkTo({ type: 'MYPAGE', payload: { page: 'likedBooks' }})}/>
                        <MenuItem icon='bookmark' text={`Books I've Read`} label={`${user.readBooks.length || 0}`} onClick={() => linkTo({ type: 'MYPAGE', payload: { page: 'readBooks' }})}/>
                        <Menu.Divider />
                        <MenuItem icon='settings' text={`Notification Settings`} onClick={() => linkTo({ type: 'MYPAGE', payload: { page: 'notifications' }})}/>
                        <Menu.Divider />
                        <MenuItem icon='log-out' text={'Log out'} onClick={() => logUserOut()} />
                      </Menu>
                  </Popover>
                  : <div className='loggedOutLinks'>
                    <span><Link to={{ type: 'LOGIN' }}>Login</Link></span> | <span><Link to={{ type: 'REGISTER' }}>Register</Link></span>
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
  user: state.user
})

const mapDispatch = dispatch => ({
  linkTo: payload => dispatch(redirect(payload))
});

export default connect(mapStateToProps, mapDispatch)(Header);
