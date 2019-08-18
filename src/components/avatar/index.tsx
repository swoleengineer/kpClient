import React, { useState } from 'react';
import { IUser, IUserProfile } from '../../state-management/models';
import { Icon } from '@blueprintjs/core';
import './avatar.css';

interface IProps {
  user?: IUser;
  style?: any;
  border?: boolean;
  interactive?: boolean
}
const avatarComponent = (props: IProps) => {
  const { user = undefined, style = null, border = false } = props;
  if (!user) {
    return ( <Icon icon='user' style={style} /> );
  }
  const [size, setSize] = useState<number>(0);
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
      ref={element => {
        const { clientHeight = 0, clientWidth = 0} = element as HTMLDivElement || { }
        setSize(clientHeight || clientWidth)
      }}
    >
      {link
        ? <div
          className='keen_avatar_pictureHolder'
          style={{
            backgroundImage: `url(${link})`,
            width: style && style.width ? style.width : `${size}px`,
            height: style && style.height ? style.height : `${size}px`
          }}
        />
        : <div className='keen_avatr_initialHolder'>{initials}</div>
      }
    </div>
  );
}

export default avatarComponent;
