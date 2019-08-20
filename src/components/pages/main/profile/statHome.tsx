import React, { useState } from 'react';
import { IUser, IStat, IAppState, AuthModalTypes } from '../../../../state-management/models';
import { IPanelProps, Button, NonIdealState } from '@blueprintjs/core';
import SingleStat from './components/singleStat';
import { generateStats, showAuthModal } from '../../.././../state-management/thunks';
import { omit } from 'lodash';
import Icon from '../../../icons';

interface IProps extends IPanelProps {
  user: IUser;
  userStats: IStat;
  viewPort: IAppState['viewPort'];
  profileNav: IAppState['profile'];
}

const statHomeComponent = (props: IProps) => {
  const { user, openPanel, userStats, viewPort, profileNav: { topLevel, lowerLevel: { [topLevel]: selectedStat = 'inProgress' }} } = props;
  if (!userStats) {
    return null;
  }
  const { figures: userStatFigures, _id: statId } = userStats;
  const figures = userStatFigures
    .filter(fig => fig)
    .sort((a, b) => a.created > b.created ? -1 : a.created < b.created ? 1 : 0)
    .map(fig => ({
      ...fig,
      state: fig.completed
        ? 'completed'
        : 'inProgress'
    }));
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  // const [editMode, setEditMode] = useState<boolean>(false);
  const menuItems = [{
    visible: true,
    icon: 'refresh',
    onClick: () => generateStats({ statId })
  }, {
    visible: viewPort === 'pc',
    icon: 'add',
    onClick: () => showAuthModal(AuthModalTypes.topicToStat)
  }];
  if (['inProgress', 'completed', 'all'].includes(selectedStat)) {
    
  }
  const figuresToShow = figures.filter(fig => selectedStat === 'all' ? true : fig.state === selectedStat);
  const displayText = {
    inProgress: {
      header: 'In Progress',
      desc: (
        <>
          Click on any stat below to see more details about your progress.
          <br />
          Clicking on the Refresh &nbsp;<Icon icon='fa-redo' iconSize={12} />&nbsp; will generate a new update for any skill you haven't updated in one month.
        </>
      )
    },
    completed: {
      header: 'Completed',
      desc: `Topics and goals you've completed. Click below to see how you did.`
    },
    all: {
      header: 'My Stats',
      desc: 'Click on any stat below to see more details about your progress.'
    }
  }
  return (
    <div className='up_state_panel_stack'>
      <div className='row'>
        <div className='col-md-12'>
          <header>
            <h4>{displayText[selectedStat].header}</h4>
          </header>
          <p>{displayText[selectedStat].desc}</p>
        </div>
      </div>
      {selectedStat === 'inProgress' && <div className='row'>
        <div className='col-md-8' style={{ margin: '15px auto 0' }}>
          <div className='statNavBarWrapper'>
            <div className='statNavBarActions'>
              {menuItems.filter(item => item.visible).map((item, i) => <div className='statNavBarActions_btn' key={i}> <Button {...omit(item, 'visible')} onClick={item.onClick} /> </div>)}
            </div>
          </div>
        </div>
      </div>}
      <div className='row'>
        <div className='col-md-8' style={{ margin: '15px auto'}}>
          {selectedTopics.length > 0 && <div className='stats_selectedNote'> {selectedTopics.length} selected. </div>}
          {figuresToShow.length > 0
            ? <div className='stats_item_wrapper'>
              {figuresToShow.map(fig => <SingleStat
                openPanel={openPanel}
                user={user}
                profileNavPage={selectedStat}
                viewPort={viewPort}
                checked={selectedTopics.includes(fig._id)}
                checkboxClick={(figId) => {
                  if (selectedTopics.includes(figId)) {
                    setSelectedTopics(selectedTopics.filter(fg => fg !== figId));
                    return;
                  }
                  setSelectedTopics(selectedTopics.concat(figId))
                }}
                showCheckbox={false}
                key={fig._id}
                figure={fig}
              />)}
            </div>
            : <div className='nonIdealWrapper'>
                <NonIdealState
                  icon='help'
                  title='No Stats to show'
                  description={<p>There are no stats to show.</p>}
                />
              </div>
          }
        </div>
      </div>
    </div>
  );
}


export default statHomeComponent;
