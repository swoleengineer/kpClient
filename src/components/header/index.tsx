import React from 'react';
import Logo from './logo';
import { connect } from 'react-redux';
import { IStore, IUserState } from 'src/state-management/models';
import { OverflowList, Button } from '@blueprintjs/core';
import Link from 'redux-first-router-link';
import { redirect } from 'redux-first-router';


{/* <Popover>
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
</Popover> */}
interface IHeaderMenuItem {
  text: string;
  icon?: any;
  navPayload: {
    type: string;
    payload?: any;
  }
}
const Header = (props: { user: IUserState, style: any, linkTo: Function }) => {
  const { loggedIn, user } = props.user;
  const linkTo = props.linkTo;
  const { username } = user || { username: undefined };

  const menuItems: IHeaderMenuItem[] = [{
    text: username,
    icon: 'user',
    navPayload: {
      type: 'PROFILE'
    }
  }, {
    text: 'My Stats',
    icon: <i className='fa fa-award' style={{ position: 'relative', top: '1px'}}/>,
    navPayload: {
      type: 'STATS'
    }
  }]
  return (
    <header className={loggedIn ? 'appHeader loggedInHeader' : 'appHeader'} style={props.style}>
      <div className='container headerWrapper'>
        <div className='row'>
          <div className='col-12'>
            <div className='logoArea'>
              <Logo large={false} dark={loggedIn} />
            </div>
            <div className='menuArea'>
              <div className='authStatusWrapper'>
                {loggedIn
                  ? <OverflowList
                      collapseFrom='end'
                      minVisibleItems={1}
                      tagName='div'
                      items={menuItems}
                      visibleItemRenderer={(item, index) => {
                        return (
                          <Button
                            key={index}
                            small={true}
                            minimal={true}
                            text={item.text}
                            icon={item.icon ? item.icon : null}
                            onClick={() => linkTo(item.navPayload)}
                          />
                        )
                      }}
                      overflowRenderer={(items) => {
                        return (<span>something to show</span>)
                      }}
                  />
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
