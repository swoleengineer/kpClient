import React, { useState } from 'react';
import { IUser, IUserProfile } from '../../state-management/models';
import './avatar.css';
import Icon from '../icons';
import AVATAR from '../../assets/kp_avatar.png';

interface IProps {
  user?: IUser;
  style?: any;
  border?: boolean;
  interactive?: boolean
  initialStyle?: any
}



const avatarComponent = (props: IProps) => {
  const { user = undefined, style = null, border = false, initialStyle = {} } = props;
  const classes = [
    'keen_avatar_wrapper',
    ...(border ? ['withBorder'] : [])
  ].join(' ');
  const renderIt = link =>  (
    <div
      className={classes}
      style={style}
    >
      <div
        className='keen_avatar_pictureHolder'
        style={{ backgroundImage: `url(${link})` }}
      />
    </div>
  );
  if (!user) {
    return renderIt(AVATAR)
  }
  const { profile: { first_name = '', last_name = '', picture = {} }} = user as IUser;
  const { link: picLink = undefined } = picture as IUserProfile['picture'];
  
  return renderIt(user ? picLink || AVATAR : AVATAR);
}

export default avatarComponent;
