import React from 'react';
import { Menu, MenuItem, Popover } from '@blueprintjs/core';
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
  ];
  return (
    <div className={wrapperClasses.join(' ')} style={style}>
      <div className='topicCompLeft'>
        <Popover disabled={addDisabled}>
          <Icon icon='fa-graduation-cap' iconSize={12} />
          <Menu>
            <MenuItem
              icon={<Icon icon='fa-books-medical' push={true} />}
              text='Track topic'
              onClick={() => {
                setTopicToAdd(topic);
                showAuthModal(AuthModalTypes.topicToStat)
              }}
            />
          </Menu>
        </Popover>
        <span className='topicCompName' onClick={() => onClick()}>{topic.name}</span>
        {(removable && interactive) && <Icon type={IconTypeEnum.solid} icon='fa-times' className='topicComCloseIcon' onClick={() => onClick()}/>}
      </div>
      {(topicBody && !hideNumber) && <div className='topicCompRight' onClick={() => onClick()}>
        <span >{agreed.length}</span>
      </div>}
      <div className='clearfix' />
      <div className='topicCompProgressWrapper'><div className='topicCompProgressBar' style={{ width: '60%'}} /></div>
    </div>
  );
}

const mapDispatch = dispatch => ({
  setTopicToAdd: payload => dispatch({ type: userActionTypes.setTopicToAdd, payload })
})


export default connect(null, mapDispatch)(topicComponent);
