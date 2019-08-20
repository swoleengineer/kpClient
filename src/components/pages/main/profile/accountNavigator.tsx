import React from 'react';
import { connect } from 'react-redux';
import { redirect } from 'redux-first-router';
import { IStore, ProfileNavOptions, IAppState } from '../../../../state-management/models';
import { LocationState } from 'redux-first-router';
import { appActionTypes } from '../../../../state-management/actions';
import Icon, { IconTypeEnum } from '../../../icons';

interface IProps {
  topLevel: ProfileNavOptions;
  lowerLevel: IAppState['profile']['lowerLevel'];
  linkTo: Function;
  location: LocationState;
  setProfileNav: Function;
}

const accountNav = (props: IProps) => {
  const { topLevel, linkTo, location: { payload = { page: undefined }}, setProfileNav } = props;
  const setActiveState = (level: 'topLevel' | 'lowerLevel', activeString: string): string => {
    const mainClass = level === 'topLevel' ? 'userProfileNav_top_item' : 'userProfileNav_bottom_list_item';
    const checkClass = level === 'topLevel' ? payload['page'] || props['topLevel'] : props['lowerLevel'][payload['page'] === 'profile' ? 'account' : payload['page'] || topLevel];
    return activeString === checkClass ? `${mainClass} nav_active` : mainClass;
  }
  const statLinks = [{
    text: 'In Progress',
    onClick: () => setProfileNav({ topLevel: ProfileNavOptions.stats, lowerLevel: { [ProfileNavOptions.stats]: 'inProgress' }}),
    className: setActiveState('lowerLevel', 'inProgress')
  }, {
    text: 'Completed',
    onClick: () => setProfileNav({ topLevel: ProfileNavOptions.stats, lowerLevel: { [ProfileNavOptions.stats]: 'completed' }}),
    className: setActiveState('lowerLevel', 'completed')
  }, {
    text: 'All',
    onClick: () => setProfileNav({ topLevel: ProfileNavOptions.stats, lowerLevel: { [ProfileNavOptions.stats]: 'all' }}),
    className: setActiveState('lowerLevel', 'all')
  }]
  const listLinks = [{
    text: <span><Icon type={IconTypeEnum.solid} icon='fa-heart' iconSize={13} /> Liked Books</span>,
    onClick: () => setProfileNav({ topLevel: ProfileNavOptions.lists, lowerLevel: { [ProfileNavOptions.lists]: 'likedBooks' }}),
    className: setActiveState('lowerLevel', 'likedBooks')
  }, {
    text: <span><Icon icon='fa-bookmark' iconSize={13} /> Read Books</span>,
    onClick: () => setProfileNav({ topLevel: ProfileNavOptions.lists, lowerLevel: { [ProfileNavOptions.lists]: 'readBooks' }}),
    className: setActiveState('lowerLevel', 'readBooks')
  }]
  const accountLinks = [{
    text: 'My Account',
    onClick: () => setProfileNav({ topLevel: ProfileNavOptions.account, lowerLevel: { [ProfileNavOptions.account]: 'account' }}),
    className: setActiveState('lowerLevel', 'account')
  }, {
    text: 'Notifications',
    onClick: () => setProfileNav({ topLevel: ProfileNavOptions.account, lowerLevel: { [ProfileNavOptions.account]: 'notifications' }}),
    className: setActiveState('lowerLevel', 'notifications')
  }]
  const generateLink = (link, i) => ( <li key={i} className={link.className} onClick={link.onClick}>{link.text}</li> );
  return (
    <div className='userProfileNav'>
      <div className='userProfileNav_top'>
        <span 
          className={setActiveState('topLevel', 'stats')}
          onClick={() => {
            linkTo({ type: 'MYPAGE', payload: { page: 'stats' }});
            setProfileNav({ topLevel: ProfileNavOptions.stats, lowerLevel: { [ProfileNavOptions.stats]: 'inProgress' }});
          }}
        >
          <Icon icon='fa-tasks-alt' /> <span className='hidden-xs'><span className='hidden-sm'>My </span>Stats</span>
        </span>
        <span
          className={setActiveState('topLevel', 'lists')}
          onClick={() => {
            linkTo({ type: 'MYPAGE', payload: { page: 'lists' }});
            setProfileNav({ topLevel: ProfileNavOptions.lists, lowerLevel: { [ProfileNavOptions.lists]: 'likedBooks' }});
          }}
        >
          <Icon icon='fa-books' /> <span className='hidden-xs'><span className='hidden-sm'>My </span>Library</span>
        </span>
        <span
          className={setActiveState('topLevel', 'profile')}
          onClick={() => {
            linkTo({ type: 'MYPAGE', payload: { page: 'profile' }});
            setProfileNav({ topLevel: ProfileNavOptions.account, lowerLevel: { [ProfileNavOptions.account]: 'account' }});
          }}
        >
          <Icon icon='fa-user-circle' /> <span className='hidden-xs'><span className='hidden-sm'>My </span>Profile</span>
        </span>
      </div>
      <div className='userProfileNav_bottom'>
        {[payload['page'], topLevel].includes('stats') && <ul className='userProfileNav_bottom_list'> {statLinks.map(generateLink)} </ul>}
        {[payload['page'], topLevel].includes('lists') && <ul className='userProfileNav_bottom_list'> {listLinks.map(generateLink)} </ul>}
        {[payload['page'], topLevel].includes('profile') && <ul className='userProfileNav_bottom_list'> {accountLinks.map(generateLink)} </ul>}
      </div>
    </div>
  );
}



const mapStateToProps = (state: IStore) => ({
  topLevel: state.app.profile.topLevel,
  lowerLevel: state.app.profile.lowerLevel,
  location: state.location
});

const mapDispatch = dispatch => ({
  linkTo: payload => dispatch(redirect(payload)),
  setProfileNav: (payload: { topLevel: ProfileNavOptions; lowerLevel: {[key: string]: string; }}) => dispatch({ type: appActionTypes.setProfileNav, payload })
})
export default connect(mapStateToProps, mapDispatch)(accountNav);
