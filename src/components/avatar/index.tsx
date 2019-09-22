import React, { useState } from 'react';
import { IUser, IUserProfile } from '../../state-management/models';
import './avatar.css';
import Icon from '../icons';

interface IProps {
  user?: IUser;
  style?: any;
  border?: boolean;
  interactive?: boolean
  initialStyle?: any
}
const avatarComponent = (props: IProps) => {
  const { user = undefined, style = null, border = false, initialStyle = {} } = props;
  if (!user) {
    return ( <Icon icon='fa-user-circle' style={style} /> );
  }
  // const [size, setSize] = useState<number>(0);
  const { profile: { first_name = '', last_name = '', picture = {} }} = user as IUser;
  const { link = undefined } = picture as IUserProfile['picture'];
  const initials: string = `${first_name[0]} ${last_name[0]}`;
  const classes = [
    'keen_avatar_wrapper',
    ...(border ? ['withBorder'] : [])
  ].join(' ');
  return (
    <div
      className={classes}
      style={style}
    >
      {link
        ? <div
          className='keen_avatar_pictureHolder'
          style={{
            backgroundImage: `url(${link})`
          }}
        />
        : <div className='keen_avatar_initialHolder'>
          <span style={initialStyle} >{initials}</span>
        </div>
      }
    </div>
  );
}

export default avatarComponent;
