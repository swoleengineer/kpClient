import React from 'react';
import { IUser } from '../../../../state-management/models';
import { Icon, Button, ButtonGroup } from '@blueprintjs/core';
import moment from 'moment';

const TopSection = (props: {
  user: IUser
}) => {
  const { user } = props;
  return (
    <div className='row'>
      <div className='col-md-4 text-center'>
        {user.profile.picture && ![undefined, null].includes(user.profile.picture.link)
          ? <div className='user_profile_wrapper' style={{ backgroundImage: `url(${user.profile.picture.link})`}} />
          : <Icon icon='user' iconSize={60} />
        }
      </div>
      <div className='col-md-8 accountUserMetaWrapper'>
        <span className='aum_username'>{user.username}</span>
        <span className='aum_name'>{user.profile.first_name} {user.profile.last_name}</span>
        <span className='aum_joined'>since {moment(user.created).format('MMM DD, YYYY')}</span>
        <ButtonGroup
          className='aum_action_btns'
        >
          <Button
            small={true}
            text='Edit Profile'
          />
          <Button
            small={true}
            text='New Stats'
          />
          <Button
            small={true}
            text='Log out'
          />
        </ButtonGroup>
        <div className='aum_Numbers_Wrapper'>
          <div>
            <span className='aum_numbers_number'>4</span>
            <span className='aum_numbers_text'>Liked Books</span>
          </div>
          <div>
            <span className='aum_numbers_number'>12</span>
            <span className='aum_numbers_text'>Books Read</span>
          </div>
          <div>
            <span className='aum_numbers_number'>5</span>
            <span className='aum_numbers_text'>Topics Tracked</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopSection;
