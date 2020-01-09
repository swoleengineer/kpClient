import React, { useState } from 'react';
import TopicBrowse from '../topic/topicBrowse';
import { Collapse, FormGroup, NonIdealState, Button, Slider, TextArea } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { connect } from 'react-redux';
import { IStore, ITopic } from '../../../../state-management/models';
import { addSkillToStats } from '../../../../state-management/thunks'
import { getFormProps } from '../util';
import { keenToaster } from '../../../../containers/switcher';
import StatComponent from '../../main/profile/components/singleStat';
import * as moment from 'moment';
import Topic from '../../../topic';

const addTopicToStatForm = (props: {
  goToNext: boolean;
  nextPayload?: {
    type: string;
    payload?: any;
  };
  callBack?: Function;
  topicForStat: ITopic
}) => {
  const { topicForStat = null } = props;
  const nextMonth = moment().add(1, 'M').toDate()
  const [topicToAdd, changeTopic] = useState(topicForStat);
  const [dateChanged, setDateChanged] = useState(false);
  const [formData, formUpdate] = useState({
    goal: 1,
    dueDate: nextMonth,
    description: ''
  });
  const [formErrors, updateErrors] =  useState<Array<{ field: string; message: string; intent: 'danger' | 'none' | 'primary' | 'success'}>>([]);
  const [formComplete, setFormStatus] = useState<boolean>(false);
  const [finalSkill, setSkill] = useState();
  const processField = e => {
    const field = e.target.id;
    const value = e.target.value;
    if (!value) {
      updateErrors(formErrors.concat({ field, message: 'This field is required', intent: 'danger'}));
      return;
    }
    if (field === 'goal' && !dateChanged) {
      updateErrors(formErrors.filter(error => ![field, 'dueDate'].includes(error.field)));
      const newDate = moment().add(value, 'M');
      formUpdate({
        ...formData,
        dueDate: newDate.isValid() ? newDate.toDate() : formData.dueDate,
        [field]: value
      });
      return;
    }
    updateErrors(formErrors.filter(error => error.field !== field));
    formUpdate({ ...formData, [field]: value });
  }
  const getErr = id => formErrors.find(err => err.field === id) || {
    field: id,
    message: null,
    intent: 'none'
  };
  const getProps = getFormProps(getErr, processField);
  const processForm = () => {
    if (formErrors.length) {
      keenToaster.show({
        message: 'Please resolve form errors before submitting.',
        icon: 'error'
      });
      return;
    }

    if (!topicToAdd) {
      keenToaster.show({
        message: 'You must have a topic selected.',
        icon: 'error'
      });
      return;
    }
    const request = {
      topic: topicToAdd,
      ...formData
    }

    addSkillToStats(request).then(
      (res: any) => {
        const { figures } = res;
        const thisSkill = figures.filter(fig => fig).find(fig => fig.topic.name === topicToAdd.name)
        setSkill(thisSkill);
        setFormStatus(true);
      },
      (err) => {
        console.log(err);
        if (!err) {
          keenToaster.show({
            message: 'Could not add this topic to your stats.',
            icon: 'error'
          });
        }
      }
    )
  }
  if (!topicToAdd) {
    return (
    <div className='nonIdealWrapper'>
      <NonIdealState
        icon='help'
        title='No Topic Selected'
        description={<p>You must select a topic to add to your stats. <br /> You can search for a topic below.</p>}
        action={ 
        <TopicBrowse
          processNewItem={(value, event) => {
            changeTopic(value);
            formUpdate({
              goal: 1,
              dueDate: nextMonth,
              description: ''
            });
          }}
          processRemove={(a, b) => console.log('removed', a, b)}
        />
        }
      />
  </div>
  )
  }
  return (
    <div>
      <Collapse isOpen={!formComplete}>
        <div className='row'>
          <div className='col-12'>
            <Topic
              skill={topicToAdd}
              interactive={true}
              topicSize='smallTopic'
              removable={true}
              style={{ float: 'left' }}
              onClick={() => {
                changeTopic(null)
              }}
              addDisabled={true}
            />
          </div>
        </div>
        <hr />
        <div className='row'>
          <div className='col-12'>
            <FormGroup
              {...getProps('goal', 'calculator', 'Number of books', 'How many books do you want to read?').formGroup}
            >
              <Slider
                min={1}
                max={10}
                stepSize={1}
                labelStepSize={1}
                value={formData.goal}
                onChange={(value) => {
                  const event = { target: { id: 'goal', value }};
                  processField(event);
                }}
              />
            </FormGroup>
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            <FormGroup
              {...getProps('dueDate', 'calendar', 'Select Date', 'By When?').formGroup}
            >
              <DateInput
                formatDate={date => moment(date).format('MM/DD/YYYY')}
                parseDate={str => new Date(str)}
                value={formData.dueDate}
                maxDate={moment().add(20, 'y').toDate()}
                onChange={(newDate, userChange) => {
                  const event = {
                    target: {
                      id: 'dueDate',
                      value: newDate
                    }
                  };
                  setDateChanged(userChange)
                  processField(event);
                }}
              />
            </FormGroup>
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            <FormGroup
              {...getProps('description', 'label', 'Reason', 'Why do you want to track this topic?').formGroup}
            >
              <TextArea
                {...getProps('description', 'label', 'Type reason here...', 'Why do you want to track this topic?').inputGroup}
                growVertically={true}
                fill={true}
              />
            </FormGroup>
          </div>
        </div>
        <br />
        <br />
        <div className='row'>
          <div className='col-12'>
            <Button
              text='Add Topic To Stats'
              fill={true}
              large={true}
              rightIcon='chevron-right'
              minimal={true}
              onClick={() => processForm()}
              disabled={formErrors.length > 0}
            />
          </div>
        </div>
      </Collapse>
      <Collapse isOpen={formComplete}>
        <StatComponent
          openPanel={null}
          user={null}
          showCheckbox={null}
          checked={null}
          checkboxClick={() => null}
          figure={finalSkill}
        />
      </Collapse>
    </div>
  )
}

const mapStateToProps = (state: IStore) => ({
  topicForStat: state.user.topicForStat
})

export default connect(mapStateToProps)(addTopicToStatForm);
