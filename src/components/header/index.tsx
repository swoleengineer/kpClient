import React from 'react';
import Logo from './logo';
import { connect } from 'react-redux';
import { IStore, IUserState } from 'src/state-management/models';
import { Icon, Popover, Menu, MenuItem, Button } from '@blueprintjs/core';

const Header = (props: { user: IUserState }) => {
  const { loggedIn, user: { username } } = props.user;
  return (
    <header className='appHeader'>
      <div className='container headerWrapper'>
        <div className='row'>
          <div className='col-12'>
            <div className='logoArea'>
              <Logo />
            </div>
            <div className='menuArea'>
              <div className='authStatusWrapper'>
                {loggedIn
                  ? <Popover>
                    <span><Icon icon={'user'} /> &nbsp;{username} | Log Out</span>
                    <Menu>
                      <MenuItem icon='user' text={'My Profile'} />
                      <Menu.Divider />
                      <MenuItem icon='log-out' text={'Log out'} />
                    </Menu>
                  </Popover>
                  : <div>
                    I will put something in here to encourage you to create an account.
                  </div>}
              </div>
              <Button icon='add' text={'Add Book'} />
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
