import React from 'react';
import { Checkbox, Icon } from '@blueprintjs/core';
import FullStat from './fullStat';
import * as moment from 'moment';

const singleStat = ({ openPanel, user, checked, checkboxClick, showCheckbox, figure, viewPort, profileNavPage }) => {
  if (!figure) {
    return null;
  }
  const { topic, dueDate = undefined, currentStatus, goal, updated = new Date() } = figure;
  const progress = Math.round((currentStatus / goal) * 100);
  const progressText = {
    [progress < 25]: 'You got this!',
    [progress > 24 && progress < 50]: 'Keep it up!',
    [progress === 50]: 'Halfway there!',
    [progress > 50 && progress < 75]: 'Come a long way!',
    [progress > 74 && progress < 100]: 'Almost there!',
    [progress > 99]: 'Now apply it!'  
  }[true];
  return (
    <div className='stats_item'>
      <div className='stats_item_body' >
        <div className='stats_item_topPortion'>
          {showCheckbox && <div className='stats_item_select_checkBox'>
            <Checkbox
              {...{ checked }}
              onChange={() => checkboxClick(figure._id)}
            />
          </div>}
          
          <header
            className='stats_item_body_header'
            style={{ width: showCheckbox ? 'calc(100% - 35px)' : '100%'}}
            onClick={() => {
              openPanel({
                component: FullStat,
                props: {
                  user,
                  statTopic: topic,
                  figure,
                  viewPort,
                  profileNavPage
                },
                title: topic.name || 'Topic Name'
              })
            }}
          >
            <Icon icon={<i className='fa fa-graduation-cap' />} />
            <span className='stats_item_body_header_topicName'>{topic.name || 'Topic Name'}</span>
            <span  className='stats_item_body_header_rightBtn' >
              <Icon icon='chevron-right' />
            </span>
            <div className='stats_item_body_meta'>
              <div>
                <strong>Updated: </strong>
                <span> {moment(updated).fromNow()}</span>
              </div>
              {dueDate && <div className='hidden-sm'>
                <strong>Due: </strong>
                <span> {moment(dueDate).fromNow()}</span>
              </div>}
              
            </div>
          </header>
        </div>
        <div className='stats_item_body_progressBarWrapper'>
          <div className='progress'>
            <div
              className='progress-bar bg-keen-dark'
              role='progressbar'
              style={{ width: `${progress}%` }}
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              {progress}% - {progressText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default singleStat;
