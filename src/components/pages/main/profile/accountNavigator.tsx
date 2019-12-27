import React from 'react';
import { connect } from 'react-redux';
import { redirect } from 'redux-first-router';
import { IStore, ProfileNavOptions, AuthModalTypes, IShelfDetail } from '../../../../state-management/models';
import { showAuthModal } from '../../../../state-management/thunks';
import { LocationState } from 'redux-first-router';
import Icon, { IconTypeEnum } from '../../../icons';

interface IProps {
  linkTo: Function;
  location: LocationState;
  myShelves: Array<IShelfDetail>
}

const accountNav = (props: IProps) => {
  const { linkTo, location: { payload: { page, part, id } = { page: undefined, part: undefined }}, myShelves = []} = props;
  const setActiveState = (level: 'topLevel' | 'lowerLevel', activeString: string): string => {
    const mainClass = level === 'topLevel' ? 'userProfileNav_top_item' : 'userProfileNav_bottom_list_item';
    const checkClass = level === 'topLevel' ? page : part;
    return activeString === checkClass ? `${mainClass} nav_active` : mainClass;
  }
  const statLinks = [{
    text: <span><Icon icon='fa-poll-people' iconSize={13} /> In Progress</span>,
    onClick: () => linkTo(ProfileNavOptions.stats, 'inProgress'),
    className: setActiveState('lowerLevel', 'inProgress')
  }, {
    text: <span><Icon icon='fa-award' iconSize={13} /> Completed</span>,
    onClick: () => linkTo(ProfileNavOptions.stats, 'completed'),
    className: setActiveState('lowerLevel', 'completed')
  }, {
    text: <span><Icon icon='fa-tasks-alt' iconSize={13} /> All</span>,
    onClick: () => linkTo(ProfileNavOptions.stats, 'all'),
    className: setActiveState('lowerLevel', 'all')
  }]
  const listLinks = [{
    text: <span><Icon type={IconTypeEnum.solid} icon='fa-heart' iconSize={13} /> Liked Books</span>,
    onClick: () => linkTo(ProfileNavOptions.lists, 'likedBooks'),
    className: setActiveState('lowerLevel', 'likedBooks')
  }, {
    text: <span><Icon icon='fa-bookmark' iconSize={13} /> Read Books</span>,
    onClick: () => linkTo(ProfileNavOptions.lists, 'readBooks'),
    className: setActiveState('lowerLevel', 'readBooks')
  }]
  const accountLinks = [{
    text: 'My Account',
    onClick: () => linkTo(ProfileNavOptions.account, 'account'),
    className: setActiveState('lowerLevel', 'account')
  }, {
    text: 'Notifications',
    onClick: () => linkTo(ProfileNavOptions.account, 'notifications'),
    className: setActiveState('lowerLevel', 'notifications')
  }]
  const generateLink = (link, i) => ( <li key={i} className={link.className} onClick={link.onClick}>{link.text}</li> );
  const linkFromShelf = (shelf: IShelfDetail, i) => (
    <li
      key={i}
      className={`userProfileNav_bottom_list_item ${part && part === shelf.id ? 'nav_active' : ''}`}
      onClick={() => linkTo(ProfileNavOptions.lists, shelf.id)}
    >
      <span><Icon icon='fa-books' /> {shelf.title} [{shelf.books}]</span>
    </li>
  );
  return (
    <div className='userProfileNav'>
      <div className='userProfileNav_top'>
        <span 
          className={setActiveState('topLevel', 'stats')}
          onClick={() => linkTo(ProfileNavOptions.stats, 'inProgress')}
        >
          <Icon icon='fa-tasks-alt' /> <span className='hidden-xs'><span className='hidden-sm'>My </span>Stats</span>
        </span>
        <span
          className={setActiveState('topLevel', ProfileNavOptions.lists)}
          onClick={() => linkTo(ProfileNavOptions.lists, 'likedBooks')}
        >
          <Icon icon='fa-books' /> <span className='hidden-xs'><span className='hidden-sm'>My </span>Library</span>
        </span>
        <span
          className={setActiveState('topLevel', 'profile')}
          onClick={() => linkTo(ProfileNavOptions.account, 'account')}
        >
          <Icon icon='fa-user-circle' /> <span className='hidden-xs'><span className='hidden-sm'>My </span>Profile</span>
        </span>
      </div>
      <div
        className='userProfileNav_bottom'
        style={{
          overflowX: page === ProfileNavOptions.lists ? 'scroll' : 'hidden',
          paddingRight: page === ProfileNavOptions.lists ? '150px' : '10px'
        }}
      >
        {page === ProfileNavOptions.stats && <ul className='userProfileNav_bottom_list'> {statLinks.map(generateLink)} </ul>}
        {page === ProfileNavOptions.lists && (
          <ul className='userProfileNav_bottom_list userProfileNav_shelves'>
            {listLinks.map(generateLink)}
            {myShelves.map(linkFromShelf)}
            <li className='userProfileNav_bottom_list_item blankItem'>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </li>
          </ul>
        )}
        {page === ProfileNavOptions.account && <ul className='userProfileNav_bottom_list'> {accountLinks.map(generateLink)} </ul>}
      </div>
      {page === ProfileNavOptions.lists && (
        <li className='userProfileNav_bottom_list_item lockedBtn'>
          <span className='nav_btn' onClick={() => showAuthModal(AuthModalTypes.newShelf)}>
            <Icon icon='fa-plus-circle' type={IconTypeEnum.light} />
            New Shelf
          </span>
        </li>
      )}
    </div>
  );
}



const mapStateToProps = ({ location, user }: IStore) => ({
  location,
  myShelves: user.user.myShelves
});

const mapDispatch = dispatch => ({
  linkTo: (page: ProfileNavOptions, part: string) => dispatch(redirect({ type: 'MYPAGE', payload: { page, part }}))
})
export default connect(mapStateToProps, mapDispatch)(accountNav);
