import React from 'react';
import { Button, ButtonGroup, Divider, IPanel, PanelStack, } from '@blueprintjs/core';
import StatHome from './statHome';
import { IUser } from '../../../../state-management/models';

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
        <div className='col-12 text-right'>
          <ButtonGroup>
            <Button
              icon='refresh'
              text='Refresh Stats'
            />
            <Divider />
            <Button
              icon='add'
              text='Track Topic'
            />
            <Button
              icon='edit'
              text='Edit'
            />
          </ButtonGroup>
        </div>
      </div>
      <div className='row'>
        <div className='col-12'>
          <PanelStack
            className='up_stats_panelWrapper'
            initialPanel={initialPanel}
          />
        </div>
      </div>
    </div>
  );
}

export default statPage;
