import React, { useState } from 'react';
import { Menu, MenuItem, Popover, MenuDivider } from '@blueprintjs/core';
import { ITopicBodyObj, ITopic, AuthModalTypes } from '../../state-management/models';
import './topic.css';
import { showAuthModal } from '../../state-management/thunks';
import { userActionTypes } from '../../state-management/actions';
import { connect } from 'react-redux';
import Icon, { IconTypeEnum } from '../icons';

const topicComponent = ({ topicBody, skill, interactive, topicSize, minimal, selected, onClick,
  style, hideNumber, removable, className, setTopicToAdd, addDisabled }: {
  topicBody?: ITopicBodyObj;
  skill?: ITopic;
  interactive?: boolean;
  topicSize?: 'smallTopic' | 'normalTopic' | 'largeTopic';
  minimal?: boolean;
  selected?: boolean;
  onClick?: any;
  style?: any;
  hideNumber?: boolean;
  removable?: boolean;
  className?: string;
  setTopicToAdd: Function;
  addDisabled: boolean;
} = {
  topicBody: undefined,
  skill: undefined,
  interactive: false,
  topicSize: 'normalTopic',
  minimal: false,
  selected: false,
  onClick: () => null,
  style: null,
  hideNumber: false,
  removable: false,
  className: '',
  setTopicToAdd: () => null,
  addDisabled: false
}) => {
  if (!skill && (!topicBody || !topicBody.topic)) {
    return null;
  }
  const topic = topicBody ? topicBody.topic : skill as ITopic
  const agreed = topicBody ? topicBody.agreed : [];
  const wrapperClasses = [
    'topicCompWrapper',
    className,
    topicSize,
    ...(minimal ? ['topicCompMinimal'] : []),
    ...(interactive ? ['topicCompInteractive'] : []),
    ...(selected ? ['topicCompSelected'] : [])
  ];
  const [hovered, setHovered] = useState<boolean>(false)
  const wrapperProps = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false)
  }
  return (
    <div className={wrapperClasses.join(' ')} style={style} { ...(interactive ? wrapperProps : [])}>
      <div className='topicCompLeft'>
        <Popover disabled={addDisabled}>
          <Icon icon={'fa-head-side-brain'} iconSize={12} />
          <Menu>
            <MenuItem
              icon={<Icon icon='fa-poll-people' push={true} />}
              text='Track topic'
              onClick={() => {
                setTopicToAdd(topic);
                showAuthModal(AuthModalTypes.topicToStat)
              }}
            />
            <MenuItem
              icon={<Icon icon='fa-search' push={true} />}
              text={`Search books`}
            />
            <MenuDivider />
            <MenuItem
              icon={<Icon icon='fa-flag' push={true} />}
              text='Report topic'
            />
          </Menu>
        </Popover>
        <span className='topicCompName' onClick={() => onClick()}>{topic.name}</span>
        {(removable && interactive) && <Icon type={IconTypeEnum.solid} icon='fa-times' className='topicComCloseIcon' onClick={() => onClick()}/>}
      </div>
      {(topicBody && !hideNumber) && <div className='topicCompRight' onClick={() => onClick()}>
        <span >{agreed.length}</span>
      </div>}
    </div>
  );
}

const mapDispatch = dispatch => ({
  setTopicToAdd: payload => dispatch({ type: userActionTypes.setTopicToAdd, payload })
})


export default connect(null, mapDispatch)(topicComponent);
