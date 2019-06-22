import React, { useState } from 'react';
import { FormGroup, InputGroup, Collapse, TextArea, Tag, Button } from '@blueprintjs/core';
import { keenToaster } from '../../../../containers/switcher';
import { connect } from 'react-redux';
import { IStore, ITopic, IQuestionRequest, IExpandedBook } from '../../../../state-management/models';
import { questionActionTypes as types } from '../../../../state-management/actions';
import { getFormProps } from '../util';
import { createQuestion } from '../../../../state-management/thunks';
import Question from '../../../question';
import TopicBrowse from '../topic/topicBrowse';




const QuestionForm = (props: {
  goToNext: boolean;
  nextPayload?: {
    type: string;
    payload?: any;
  };
  topics: ITopic[];
  newQuestion: IQuestionRequest;
  updateField: Function;
  clearForm: Function;
  updateTopics: Function;
  books: IExpandedBook[];
  style
}) => {
  const [formErrors, updateErrors] = useState<Array<{ field: string; message: string; intent: 'danger' | 'none' }>>([]);
  const [formComplete, updateStatus] = useState(false);
  const { newQuestion, goToNext, nextPayload, clearForm, updateField, updateTopics, books, style } = props;
  const [finalQuestion, updateFinal] = useState(newQuestion);
  const processField = e => {
    const field = e.target.id;
    const value = e.target.value;
    if (field === 'topics') {
      console.log('updated topics', value, e.event);
      updateTopics('add', value);
      return;
    }
    if (!value) {
      updateErrors(formErrors.concat({
        field,
        message: 'This field is required.',
        intent: 'danger'
      }));
      return;
    }
    updateErrors(formErrors.filter(error => error.field !== field));
    updateField({ [field]: value });
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
        intent: 'danger',
        icon: 'error'
      });
      return;
    }
    
    createQuestion(newQuestion, goToNext, nextPayload)
    .then((final) => {
      updateFinal(final);
      updateStatus(true);
      clearForm();
    })
    .catch(() => {
      keenToaster.show({
        message: 'Could not create question.',
        intent: 'danger',
        icon: 'error'
      });
    });
  }
  return (
    <div>
      <Collapse isOpen={!formComplete}>
        <div className='row'>
          <div className='col-12'>
            <FormGroup
              {...getProps('title', 'help', 'Question Title', 'Enter a short title.').formGroup}
            >
              <InputGroup
                {...getProps('title', 'help', 'Question Title', 'Enter a short title.').inputGroup}
                large={true}
              />
            </FormGroup>
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            <FormGroup
              {...getProps('text', 'label', 'Description', `Describe the topic you're trying to learn`).formGroup}
            >
              <TextArea
                {...getProps('text', 'label', 'Description', `Describe the topic you're trying to learn`).inputGroup}
                growVertically={true}
                fill={true}
              />
            </FormGroup>
          </div>
        </div>
        <span>{newQuestion.topics.length} Topic{newQuestion.topics.length > 1 ? 's' : ''}</span>
        <div className='row'>
          
            {newQuestion.topics.length > 0 && <div className='col-12 newQuestionTagsContainer'>
              <div className='clearfix'>
                {newQuestion.topics
                  .map((topic: ITopic) =>
                    <Tag
                      icon='lightbulb'
                      key={topic._id}
                      style={{
                        marginRight: '10px',
                        marginBottom: '10px'
                        }}
                    >
                      {topic.name}
                    </Tag>
                  )
                }
              </div>
            </div>}
        
          <div className='col-12'>
            <TopicBrowse
              processNewItem={(value, event) => {
                const target = { id: 'topics', value };
                processField({ target, event })
              }}
              processRemove={(a, b) => console.log('removed', a, b)}
            />
          </div>
          <br />
          <br />
          <br />
          <div className='col-12'>
            <Button
              text='Ask Question'
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
      <Collapse isOpen={formComplete}><Question style={style} question={finalQuestion} books={books} responsive={false}/></Collapse>
    </div>
  )
}

const mapStateToProps = (state: IStore) => ({
  topics: state.topic.allTopics,
  newQuestion: state.question.newQuestion,
  books: state.book.books
});

const mapDispatch = dispatch => ({
  updateField: (payload: { [key: string]: any}) => dispatch({
    type: types.updateNewQuestion,
    payload
  }),
  updateTopics: (type: 'remove' | 'add', topic) => dispatch({
    type: types.updateNewQuestionTopics,
    payload: { type, topic }
  }),
  clearForm: () => dispatch({ type: types.clearNewQuestion })
})

export default connect(mapStateToProps, mapDispatch)(QuestionForm);
