import React from 'react';
import { Icon, Menu, MenuItem, Popover } from '@blueprintjs/core';
import { ITopicBodyObj, ITopic } from '../../state-management/models';
import './topic.css';

const topicComponent = ({ topicBody, skill, interactive, topicSize, minimal, selected, onClick, style, hideNumber, removable, className }: {
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
  className?: string
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
  className: ''
}) => {
  if (!topicBody && !skill) {
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
  ]
  return (
    <div className={wrapperClasses.join(' ')} style={style}>
      <div className='topicCompLeft'>
        <Popover>
          <Icon icon={<i className='fa fa-graduation-cap' />} iconSize={12} />
          <Menu>
            <MenuItem
              text='Set Topic Goal'
              labelElement={<Icon icon={<i className='fa fa-award' />} />}
            />
          </Menu>
        </Popover>
        <span className='topicCompName' onClick={() => onClick()}>{topic.name}</span>
        {(removable && interactive) && <Icon icon='small-cross' className='topicComCloseIcon' onClick={() => onClick()}/>}
      </div>
      {(topicBody && !hideNumber) && <div className='topicCompRight' onClick={() => onClick()}>
        <span >{agreed.length}</span>
      </div>}
      <div className='clearfix' />
      <div className='topicCompProgressWrapper'>
        <div className='topicCompProgressBar' style={{ width: '60%'}} />
      </div>
    </div>
  );
}

export default topicComponent;
