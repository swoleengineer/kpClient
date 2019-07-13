import React from 'react';
import { IUser } from '../../../../state-management/models';
import { IPanelProps, Button, Icon, Checkbox } from '@blueprintjs/core';

interface IProps extends IPanelProps {
  user: IUser
}

const statHomeComponent = (props: IProps) => {
  // const { user, openPanel } = props;
  return (
    <div className='up_state_panel_stack'>
      <div className='row'>
        <div className='col-md-7'>
          <header>
            <h4>My Stats</h4>
          </header>
          <p className='lead'>
            Here is an explanation for how to use stats. What you can do and what you cannot do.
          </p>
          <p>This explanation will always be here no matter what... Whenever you need it you can always look up for it.</p>
          <div>
            <Button text='reload Stats' small={true} />
          </div>
        </div>
        <div className='col-md-5'>IN here I may put a chart</div>
      </div>
      <div className='row'>
        <div className='col-md-8' style={{ margin: '15px auto'}}>
          <div className='clearfix text-right'>
            Dropdown sort
          </div>
          <div className='stats_item_wrapper'>
            <div className='stats_item'>
              
              <div className='stats_item_body' >
                <div className='stats_item_topPortion'>
                  <div className='stats_item_select_checkBox'>
                    <Checkbox checked={true} onChange={() => console.log('checkbox changed')} />
                  </div>
                  <header className='stats_item_body_header' style={{ width: 'calc(100% - 35px)' }}>
                    <Icon icon={<i className='fa fa-graduation-cap' />} />
                    <span className='stats_item_body_header_topicName'>Entrepreneurship</span>
                    <span className='stats_item_body_header_rightBtn'>
                      <Icon icon='chevron-right' />
                    </span>
                    <div className='stats_item_body_meta'>
                      <div>
                        <strong>Started:</strong>
                        <span>10 days ago</span>
                      </div>
                      <div>
                        <strong>Due:</strong>
                        <span>3 months from now</span>
                      </div>
                    </div>
                  </header>
                </div>
                <div className='stats_item_body_progressBarWrapper'>
                  <div className='progress'>
                    <div
                      className='progress-bar bg-keen-dark'
                      role='progressbar'
                      style={{ width: '50%'}}
                      aria-valuenow={50}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      50% - Almost There!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default statHomeComponent;
