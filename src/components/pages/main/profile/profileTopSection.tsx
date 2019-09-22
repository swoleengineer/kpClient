import React from 'react';
import { IUser, IStat } from '../../../../state-management/models';
import { logUserOut } from '../../../../state-management/thunks';
import moment from 'moment';
import { uploadToCloudinary } from './profile.util';
import Avatar from '../../../avatar';
import Icon from '../../../icons';
import { Button } from '@blueprintjs/core';

const TopSection = (props: {
  user: IUser;
  processImg: Function;
  stats: IStat;
}) => {
  const { user, processImg, stats } = props;
  const { readBooks = [], savedBooks = []} = user;
  const { figures = []} = stats || { };
  return (
    <div className='row'>
      <div className='col-4 text-center uploadClick' onClick={() => uploadToCloudinary(processImg)}>
        <div className='user_profile_wrapper'>
          <Avatar user={user} border={true}/>
        </div>
      </div>
      <div className='col-8 accountUserMetaWrapper'>
        <span className='aum_username'>{user.username}</span>
        <span className='aum_name'>{user.profile.first_name} {user.profile.last_name}</span>
        <span className='aum_joined'>since {moment(user.created).format('MMM DD, YYYY')}</span>
        <br />
        <Button
          text='Log out'
          icon={<Icon icon='fa-sign-out' iconSize={11} />}
          onClick={() => logUserOut()}
          small={true}
          minimal={true}
          style={{ color: `rgba(0,0,0,.4)`}}
        />
        
      </div>
      <div className='col-12'>
        <div className='aum_Numbers_Wrapper'>
          <div>
            <span className='aum_numbers_number'>{savedBooks.length}</span>
            <span className='aum_numbers_text'>Liked Books</span>
          </div>
          <div>
            <span className='aum_numbers_number'>{readBooks.length}</span>
            <span className='aum_numbers_text'>Books Read</span>
          </div>
          <div>
            <span className='aum_numbers_number'>{figures.length}</span>
            <span className='aum_numbers_text'>Topics Tracked</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopSection;
