import React from 'react';
import './profile.css';
import { IStore, IUser, IStat, IAppState, ProfileNavOptions, IShelf, IComment } from '../../../../state-management/models';
import { connect } from 'react-redux';
import { LocationState, redirect } from 'redux-first-router';
import Profile from './profile';
import BookList from './bookList';
// import NotificationSettings from './notifications';
import TopSection from './profileTopSection';
import Nav from './accountNavigator';
import StatPage from './stats';
import { keenToaster } from '../../../../containers/switcher';
import { updateProfilePicture } from '../../../../state-management/thunks';


const ProfilePage = (props: {
  location: LocationState;
  linkTo: Function;
  user: IUser;
  loggedIn: boolean;
  stats: IStat;
  viewPort: IAppState['viewPort'];
  profileNav: IAppState['profile'];
  selectedShelf: IShelf;
  shelfComments: Array<IComment>
}) => {
  const { location, location: { payload = { page: undefined }},  user, loggedIn, stats, profileNav, viewPort, selectedShelf, shelfComments } = props;
  const { page } = payload as any;
  const processImg = (err, result) => {
    if (err) {
      let message;
      try {
        message = err.message;
      } catch {
        message = 'Could not upload your image'
      }
      keenToaster.show({
        message,
        icon: 'error'
      });
      return;
    }
    if (result.event !== 'success') {
      return;
    }
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
              <TopSection user={user} processImg={processImg} stats={stats} />
              <Nav />
            </div>
            {page === ProfileNavOptions.stats && <StatPage user={user}  viewPort={viewPort} />}
            {page === ProfileNavOptions.lists && <BookList location={location} profileNav={profileNav} viewPort={viewPort} user={user} selectedShelf={selectedShelf} shelfComments={shelfComments} />}
            {page === ProfileNavOptions.account && <Profile profileNav={profileNav} viewPort={viewPort} user={user}  />}            
          </div>
        </div>
      </div>
    </section>
  );
}

export const mapStateToProps = (state: IStore) => ({
  location: state.location,
  user: state.user.user,
  loggedIn: state.user.loggedIn,
  stats: state.user.userStats,
  viewPort: state.app.viewPort,
  profileNav: state.app.profile,
  selectedShelf: state.user.selectedShelf,
  shelfComments: state.user.selectedShelfComments
})
export const mapDispatch = dispatch => ({
  linkTo: payload => dispatch(redirect(payload))
})
export default connect(mapStateToProps, mapDispatch)(ProfilePage);
