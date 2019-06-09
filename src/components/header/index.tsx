import React from 'react';
import Logo from './logo';
import { connect } from 'react-redux';
import { IStore, IUserState } from 'src/state-management/models';
import { Icon, Popover, Menu, MenuItem } from '@blueprintjs/core';
import Link from 'redux-first-router-link';
import { logUserOut } from '../../state-management/thunks'

const Header = (props: { user: IUserState }) => {
  const { loggedIn, user } = props.user;
  const { username } = user || { username: undefined };
  return (
    <header className='appHeader'>
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
                        <MenuItem icon='user' text={'My Profile'} />
                        <Menu.Divider />
                        <MenuItem icon='log-out' text={'Log out'} onClick={() => logUserOut()}/>
                      </Menu>
                  </Popover>
                  : <div className='loggedOutLinks'>
                    <span><Link to={{ type: 'LOGIN' }}>Login</Link></span> | <span><Link to={{ type: 'REGISTER' }}>Register</Link></span>
                  </div>}
              </div>
              <Link to={{ type: 'NEWBOOK'}} className='bp3-button'>&nbsp;<Icon icon='add' />&nbsp;&nbsp;&nbsp; Add Book</Link>
              {/* <Button icon='add' text={'Add Book'} /> */}
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

export default connect(mapStateToProps)(Header);
