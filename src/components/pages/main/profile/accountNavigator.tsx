import React from 'react';
import { Icon, Popover, Menu, MenuItem } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { redirect } from 'redux-first-router';

const accountNav = ({ linkTo }) => {
  return (
    <div className='userProfileNav'>
      <div className='up_nav_item_nochilden up_nav_item_selected' onClick={() => linkTo({ type: 'MYPAGE', payload: { page: 'stats'}})}> My Stats </div>
      <div className='up_nav_item_childen'>
        <div className='up_nav_item_parent'>
          My Lists
          <span className='up_nav_item_parent_btn'>
            <Popover>
              <Icon icon='more' iconSize={10} />
              <Menu>
                <MenuItem
                  text='Create New List'
                  icon='add'
                />
                <MenuItem
                  text='View All Lists'
                  icon='list-columns'
                />
              </Menu>
            </Popover>

          </span>
        </div>
        <div className='up_nav_item_children_wrapper'>
          <div className='up_nav_item_child' onClick={() => linkTo({ type: 'MYPAGE', payload: { page: 'likedBooks'}})}><Icon iconSize={10} icon='heart' /> Saved Books</div>
          <div className='up_nav_item_child' onClick={() => linkTo({ type: 'MYPAGE', payload: { page: 'readBooks'}})}><Icon iconSize={10} icon='bookmark' /> Read Books</div>
          <div className='up_nav_item_child'><Icon iconSize={10} icon='add' /></div>
        </div>
      </div>
    </div>
  );
}

const mapDispatch = dispatch => ({
  linkTo: payload => dispatch(redirect(payload))
})
export default connect(null, mapDispatch)(accountNav);
