import React, { useState } from 'react';
import { FormGroup, InputGroup, Button, Collapse, Tag } from '@blueprintjs/core';
import { keenToaster } from '../../../../containers/switcher';
import { connect } from 'react-redux';
import { IStore, ITopic, ITopicRequest } from '../../../../state-management/models';
import { topicActionTypes as types } from '../../../../state-management/actions';
import { getFormProps } from '../util';
import { createTopic } from '../../../../state-management/thunks';

const TopicForm = (props: {
  goToNext: boolean;
  nextPayload?: {
    type: string;
    payload?: any;
  };
  topics: ITopic[];
  newTopic: ITopicRequest;
  updateField: Function;
  clearForm: Function;
}) => {
  const [formErrors, updateErrors] = useState<Array<{ field: string; message: string; intent: 'danger' | 'none' }>>([]);
  const [formComplete, updateStatus] = useState(false);
  const { topics, updateField, newTopic, goToNext, nextPayload = undefined, clearForm } = props;
  const [finalTopic, updateFinal] = useState(newTopic);
  const processField = e => {
    const field = e.target.id;
    const value = e.target.value;
    if (!value && field === 'name') {
      updateErrors(formErrors.concat({
        field,
        message: 'This field is required.',
        intent: 'danger'
      }));
      return;
    }
    if (topics.map(topic => topic.name.toLowerCase()).includes(value.toLowerCase())) {
      updateErrors(formErrors.concat({
        field,
        message: 'This topic already exists.',
        intent: 'danger'
      }));
      return;
    }
    updateErrors(formErrors.filter(error => error.field !== field));
    updateField({ [field]: value });
  }
  const submitForm = () => {
    if (!newTopic.name) {
      updateErrors(formErrors.concat({
        message: 'You need to enter a name for this topic.',
        intent: 'danger',
        field: 'name'
      }));
      return;
    }
    if (formErrors.length) {
      keenToaster.show({
        message: 'Please resolve form errors before submitting.',
        intent: 'danger',
        icon: 'error'
      });
      return;
    }
    updateFinal(newTopic);
    createTopic(newTopic, goToNext, nextPayload)
    .then(() => {
      updateStatus(true)
      clearForm();
    })
    .catch(() => {
      keenToaster.show({
        message: 'Could not create topic.',
        intent: 'danger',
        icon: 'error'
      })
    });
  }
  const getErr = id => formErrors.find(err => err.field === id) || {
    field: id,
    message: null,
    intent: 'none'
  }
  const getProps = getFormProps(getErr, processField);
  return (
    <div>
      <Collapse isOpen={!formComplete}>
        <div>
          <div className='row'>
            <div className='col-12'>
              <FormGroup
                {...getProps('name', 'lightbulb', 'Enter topic', 'New Topic').formGroup}
              >
                <InputGroup
                  {...getProps('name', 'lightbulb', 'Enter topic', 'New Topic').inputGroup}
                  large={true}
                />
              </FormGroup>
            </div>
          </div>
          <div className='row'>
            <div className='col-12'>
              <FormGroup
                {...getProps('description', null, 'Optional description', 'Description').formGroup}
              >
                <InputGroup
                  {...getProps('description', null, 'Optional description', 'Description').inputGroup}
                />
              </FormGroup>
            </div>
          </div>
          <br />
          <Button
            text='Add topic'
            fill={true}
            rightIcon='chevron-right'
            minimal={true}
            onClick={() => submitForm()}
            disabled={formErrors.length > 0}
          />
        </div>
      </Collapse>
      <Collapse isOpen={formComplete}>
        <Tag icon='lightbulb' minimal={false}>{finalTopic.name}</Tag>
      </Collapse>
    </div>
  );
}

const mapStateToProps = (state: IStore) => ({
  topics: state.topic.allTopics,
  newTopic: state.topic.newTopic
})
const mapDispatchToProps = dispatch => ({
  updateField: (payload: {[key: string]: string }) => dispatch({
    type: types.updateNew,
    payload
  }),
  clearForm: () => dispatch({ type: types.clearNew })
});
export default connect(mapStateToProps, mapDispatchToProps)(TopicForm);
