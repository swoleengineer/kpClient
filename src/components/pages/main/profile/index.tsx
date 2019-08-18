import React from 'react';
import './profile.css';
import { IStore, IUser, IStat } from '../../../../state-management/models';
import { connect } from 'react-redux';
import { LocationState, redirect } from 'redux-first-router';
// import Profile from './profile';
// import BookList from './bookList';
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
  stats: IStat
}) => {
  const { location: { payload = { page: undefined }},  user, loggedIn, stats } = props;
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
        intent: 'danger',
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
              <TopSection user={user} processImg={processImg} stats={stats} />
              <Nav />
            </div>
            {page === 'stats' && <StatPage user={user}/>}
              {/* <BookList listType={page} /> */}
            
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
  stats: state.user.userStats
})
export const mapDispatch = dispatch => ({
  linkTo: payload => dispatch(redirect(payload))
})
export default connect(mapStateToProps, mapDispatch)(ProfilePage);
