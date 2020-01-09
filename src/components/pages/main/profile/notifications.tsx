import React from 'react';
import { Switch, Card } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { IStore, IUser } from '../../../../state-management/models';
import { editNotificationSettings } from '../../../../state-management/thunks';
import { keenToaster } from '../../../../containers/switcher';

const NotificationSettings = (props: {
  user: IUser;
}) => {
  const { user } = props;
  const { notification_book_suggested, notification_topic_added, notification_suggestion_accepted } = user;
  const submitChange = (e) => {
    const type = e.target.id;
    const value = e.target.value !== 'on' ? true : false
    editNotificationSettings(user._id, { type, value}).then(
      () => keenToaster.show({ message: 'Notification setting updated' }),
      () => keenToaster.show({ message: 'Could not update this setting.'})
    )
  }
  return (
    <div className='row'>
      <div className='col-md-10' style={{ margin: '0 auto'}}>
        <p className='lead'>Keen Pages will send you an email notification for the below activities only if you allow.</p>
        <Card>
          <ul className='settings_list_wrapper'>
            <li className='settings_list_header'>Suggestions/Requests:</li>
            <li>
              <Switch
                label='Someone suggests book on my request'
                alignIndicator='right'
                large={true}
                innerLabel='off'
                innerLabelChecked='on'
                id='notification_book_suggested'
                checked={notification_book_suggested}
                onChange={submitChange}
              />
            </li>
            <li>
              <Switch
                label='Someone adds topic on my request'
                alignIndicator='right'
                large={true}
                innerLabel='off'
                innerLabelChecked='on'
                id='notification_topic_added'
                checked={notification_topic_added}
              />
            </li>
            <li>
              <Switch
                label='Someone accepts my suggestion'
                alignIndicator='right'
                large={true}
                innerLabel='off'
                innerLabelChecked='on'
                id='notification_suggestion_accepted'
                checked={notification_suggestion_accepted}
              />
            </li>
          </ul>
        </Card>
      </div>
    </div>
  )
}

const mapStateToProps = (state: IStore) => ({
  user: state.user.user
})

export default connect(mapStateToProps)(NotificationSettings);
