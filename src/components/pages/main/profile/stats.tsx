import React from 'react';
import { IPanel, PanelStack } from '@blueprintjs/core';
import StatHome from './statHome';
import { IUser } from '../../../../state-management/models';
import './components/profile-components.css';

const statPage = (props: {
  user: IUser
}) => {
  const { user } = props;
  if (!user) {
    return null;
  }
  const initialPanel: IPanel = {
    component: StatHome,
    props: { user },
    title: 'My Stats'
  }
  return (
    <div>
      <div className='row'>
        <div className='col-12'>
          <PanelStack
            className='up_stats_panelWrapper x_lt3'
            initialPanel={initialPanel}
          />
        </div>
      </div>
    </div>
  );
}

export default statPage;
