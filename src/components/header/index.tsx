import React, { useState, useEffect } from 'react';
import Logo from './logo';
import { connect, useSelector, useDispatch } from 'react-redux';
import { Button, Popover, Menu, MenuItem, MenuDivider } from '@blueprintjs/core';
import Link from 'redux-first-router-link';
import { redirect } from 'redux-first-router';
import Icon, { IconTypeEnum } from '../icons';
import { keenToaster } from '../../containers/switcher';
import { showAuthModal, logUserOut, searchBooks } from '../../state-management/thunks';
import { AuthModalTypes, IStore, IUserState, IAppState, ProfileNavOptions } from '../../state-management/models';
import { appActionTypes } from '../../state-management/actions';
import SearchPopup from './search_popup';
import Avatar from '../avatar';
import SearchOver from './searchOver';



const Header = (props: { user: IUserState; style?: any; linkTo: Function; viewPort: IAppState['viewPort'], setProfileNav: Function }) => {
  const { loggedIn, user } = props.user;
  const linkTo = props.linkTo;
  const searchText = useSelector((store: IStore) => store.app.home.searchText);
  const [searchResults, setSearchResults] = useState<Array<any>>([]);
  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      setSearchResults([]);
    }
  }, [searchText]);
  
  const performSearch = () => {
    if (!searchText || !searchText.length) {
      return;
    }
    searchBooks(searchText.trim()).then(
      res => setSearchResults(res),
      err => {
        let message
        try {
          const { message: mesaj =  '' } = { ...err.response.data, ...(err.response.data.data || {}) }
          message = mesaj
        } catch {
          message = 'Could not create this book. Please try again later'
        }
        keenToaster.show({
          message,
          icon: 'error'
        })
      }
    );
  }
  return (
    <>
      <header className={'appHeader loggedInHeader'} style={props.style}>
        <div className='container headerWrapper'>
          <div className='row'>
            <div className='col-12 kp_header_wrapper'>
              <div className='logoArea'>
                <Logo large={true} dark={true} noText={true} />
              </div>
              <div className='search_combo_wrapper'>
                <div className='search_combo_container'>
                  <SearchPopup
                    searchText={searchText}
                    performSearch={performSearch}
                  />
                </div>
              </div>
              <div className='kp_header_nav_wrapper'>
                <div className='kp_header_nav_container'>
                  <nav
                    className='kp_header_nav'
                  >
                    <ul
                      className='kp_header_nav_items'
                    >
                      <li
                        className='kp_header_nav_item selected_item'
                      >
                        <Link
                          to={{
                            type: 'HOME'
                          }}
                        >
                          <Icon icon='fa-home' type={IconTypeEnum.regular} />
                        </Link>
                      </li>
                      <li
                        className='kp_header_nav_item'
                      >
                        <Link
                          to={{
                            type: 'HOME'
                          }}
                        >
                          <Icon icon='fa-book' type={IconTypeEnum.regular} />
                          <span className='kp_header_nav_item_text'>Books</span>
                        </Link>
                      </li>
                      <li
                        className='kp_header_nav_item'
                      >
                        <Link
                          to={{
                            type: 'HOME'
                          }}
                        >
                          <Icon icon='fa-hands-helping' />
                          <span className='kp_header_nav_item_text'>Suggestions</span>
                        </Link>
                      </li>
                    </ul>
                  </nav>
                  <div className='kp_header_nav_actions'>
                    {!user && (
                      <div className='kp_header_nav_action'>
                        <span
                          onClick={() => showAuthModal(AuthModalTypes.login)}
                          className='kp_header_auth kp_header_auth_loggedout'
                        >
                          <span>User?</span>
                          <span
                            className='kp_header_auth_action' 
                          >
                            Log in
                          </span>
                        </span>
                      </div>
                    )}
                    {user && (
                      <>
                        <div className='kp_header_nav_action'>
                          <span
                            className='kp_header_auth'
                            style={{
                              fontSize: '15px',
                              paddingTop: '6px',
                              textShadow: '0px 2px 3px rgba(0,0,0,.13)'
                            }}
                          >
                            <Icon icon='fa-bell' type={IconTypeEnum.solid} />
                          </span>
                        </div> 
                        <div className='kp_header_nav_action' >
                          <Popover 
                            popoverClassName='headerUserMenu'
                            position='bottom-right'
                            modifiers={{
                              arrow: { enabled: false }
                            }}
                          >
                            <span className='kp_header_auth' style={{ display: 'flex'}} >
                              <Avatar
                                user={user}
                                style={{
                                  width: '20px',
                                  backgroundColor: 'rgba(255,255,255,1)',
                                  boxShadow: '0px 2px 3px rgba(0,0,0,.1)'
                                  }}
                              />
                              <span
                                style={{
                                  marginLeft: '10px'
                                }}
                              >
                                Me
                              </span>
                            </span>
                            <Menu>
                              <MenuItem
                                icon={<Icon icon='fa-tasks-alt' color={true} />}
                                text='My Stats'
                                onClick={() => {
                                  linkTo({ type: 'MYPAGE', payload: { page: ProfileNavOptions.stats }});
                                }}
                              />
                              <MenuItem
                                icon={<Icon icon='fa-books' color={true} />}
                                text='My Library'
                                onClick={() => {
                                  linkTo({ type: 'MYPAGE', payload: { page: ProfileNavOptions.lists }});
                                }}
                              />
                              <MenuItem
                                icon={<Icon icon='fa-user-circle' color={true} />}
                                text='My Profile'
                                onClick={() => {
                                  linkTo({ type: 'MYPAGE', payload: { page: ProfileNavOptions.account }});
                                }}
                              />
                              <MenuDivider />
                              <MenuItem
                                icon={<Icon icon='fa-books-medical' color={true} />}
                                text='Track Topic'
                                onClick={() => showAuthModal(AuthModalTypes.topicToStat)}
                              />
                              <MenuItem
                                icon={<Icon icon='fa-hands-helping' color={true} />}
                                text='Get Suggestion'
                                onClick={() => showAuthModal(AuthModalTypes.question)}
                              />
                              <MenuDivider />
                              <MenuItem
                                icon={<Icon icon='fa-sign-out-alt' color={true} />}
                                text='Log out'
                                onClick={() => logUserOut()}
                              />
                            </Menu>
                          </Popover>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {searchText.length > 0 && (
        <SearchOver
          searchText={searchText}
          searchResults={searchResults}
        />
      )}
      
    </>
    
  );
}

const mapStateToProps = (state: IStore) => ({
  user: state.user,
  viewPort: state.app.viewPort
})

const mapDispatch = dispatch => ({
  linkTo: payload => dispatch(redirect(payload)),
  setProfileNav: (payload: { topLevel: ProfileNavOptions; lowerLevel: {[key: string]: string; }}) => dispatch({ type: appActionTypes.setProfileNav, payload })
});

export default connect(mapStateToProps, mapDispatch)(Header);
