import React from 'react';
import { Icon, Tab, Tabs } from '@blueprintjs/core';
import './profile.css';
import { IStore, IUserPages, IUser } from '../../../../state-management/models';
import { connect } from 'react-redux';
import { LocationState, redirect } from 'redux-first-router';
import moment from 'moment';
import Profile from './profile';
import BookList from './bookList';
import { uploadToCloudinary } from './profile.util';
import { keenToaster } from '../../../../containers/switcher';
import { updateProfilePicture } from '../../../../state-management/thunks';
import NotificationSettings from './notifications';


const ProfilePage = (props: {
  location: LocationState;
  linkTo: Function;
  user: IUser;
  loggedIn: boolean
}) => {
  const { location: { type, payload = { page: undefined }}, linkTo, user, loggedIn } = props;
  const { page } = payload as any;
  const processImg = (err, result) => {
    if (err) {
      console.log(err);
      let message;
      try {
        message = err.message;
      } catch {
        message = 'Could not upload your image'
      }
      keenToaster.show({
        message,
        intent: 'danger',
        icon: 'error'
      });
      return;
    }
    if (result.event !== 'success') {
      console.log('event fired:', result.event);
      return;
    }
    console.log(result);
    const { public_id, url: link } = result.info
    updateProfilePicture(user._id, { public_id, link }).then(
      () => {
        keenToaster.show({
          message: 'Picture has been uploaded',
          intent: 'none',
          icon: 'mugshot'
        });
      },
      () => keenToaster.show({
        message: 'Could not update your pictures',
        intent: 'danger',
        icon: 'error'
      })
    )
  }
  if (!loggedIn) {
    return null
  }
  return (
    <section className='section_gray section_padding'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-8' style={{ margin: '0 auto'}}>
            <div className='profileHeader'>
              <div className='profile_picture_name'>
                <div className='profile_picture_img' onClick={() => uploadToCloudinary(processImg)}>
                  {user.profile.picture && ![undefined, null].includes(user.profile.picture.link)
                    ? <div className='user_profile_wrapper' style={{ backgroundImage: `url(${user.profile.picture.link})`}} />
                    : <Icon icon='user' iconSize={60} />
                  }
                  
                </div>
                <div className='profile_picture_nm'>
                  <span>{user.profile.first_name} {user.profile.last_name}</span>
                </div>
              </div>
              <div className='profile_header_meta'>
                <div>
                  <span><strong>@{user.username}</strong></span>
                  <span>Member since {moment(user.created).format('MMM DD, YYYY')}</span>
                </div>
              </div>
            </div>
            <div className='row profile_tabs_wrapper'>
              <div className='col-12'>
                <Tabs
                  id='profilePageTabs'
                  selectedTabId={type === 'PROFILE' || (!page || !IUserPages.includes(page)) ? 'profile' : page}
                  renderActiveTabPanelOnly={true}
                  large={true}
                  onChange={(newTab, prevTab, event) => {
                    const pageTogo = {
                      type: IUserPages.includes(`${newTab}`) ? 'MYPAGE' : 'PROFILE',
                      ...(IUserPages.includes(`${newTab}`) ? {
                        payload: { page: newTab }
                      } : {})
                    }
                    linkTo(pageTogo);
                  }}  
                >
                  <Tab id='profile' title={<span className='profile_tab_title'><Icon icon='user' /> Account</span>} panel={<Profile />} />
                  <Tab id='likedBooks' title={<span className='profile_tab_title'><Icon icon='book' /> Saved Books <small>{user.savedBooks.length}</small></span>} panel={<BookList listType='Liked Books' />} />
                  <Tab id='readBooks' title={<span className='profile_tab_title'><Icon icon='bookmark' /> Books I've Read <small>{user.readBooks.length}</small></span>} panel={<BookList listType='Read Books' />} />
                  <Tabs.Expander />
                  <Tab id='notifications' title={<span className='profile_tab_title'><Icon icon='settings' /> Settings</span>} panel={<NotificationSettings />} />
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const mapStateToProps = (state: IStore) => ({
  location: state.location,
  user: state.user.user,
  loggedIn: state.user.loggedIn
})
export const mapDispatch = dispatch => ({
  linkTo: payload => dispatch(redirect(payload))
})
export default connect(mapStateToProps, mapDispatch)(ProfilePage);
