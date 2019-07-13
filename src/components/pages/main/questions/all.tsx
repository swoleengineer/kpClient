import React, { useState } from 'react';
import { connect } from 'react-redux';
import './questions.css';
import QuestionCard from '../../../question';
import { ITopic, IExpandedQuestion, IStore, AuthModalTypes } from '../../../../state-management/models';
import TopicSearch from '../../auth/topic/topicBrowse';
import {  questionSorts, questionFilter } from '../../../../state-management/utils';
import { Switch, NonIdealState, Spinner, ButtonGroup, Button, Tag, Collapse, ControlGroup, InputGroup } from '@blueprintjs/core';
import { allQuestionsSearchOpen } from '../../../../config/appSettings';
import { userActionTypes as userTypes } from '../../../../state-management/actions';
import {  queryMoreQuestions, searchQuestions } from '../../../../state-management/thunks';


const tagStyle = {
  margin: '0 10px 10px 0'
}


const AllQuestions = (props: {
  questions: IExpandedQuestion[];
  showAuthModal: Function;
}) => {
  const {  questions, showAuthModal } = props;
  const [commentsFirst, updateCommentSort] = useState<boolean>(false);
  const [filteredTopics, setFilterTopics] = useState<Array<ITopic>>([]);
  const [sortOptions, updateSorts] = useState<any>(questionSorts);
  const [searchOpen, updateSearchOpen] = useState(allQuestionsSearchOpen.get());
  const [searchInput, updateInputText] = useState('');
  const [isLoading, updateLoading] = useState(false);
  const refreshQuestions = () => {
    updateLoading(true);
    const currentsort = sortOptions.find(opt => opt.selected) || undefined;
    if (!currentsort) {
      console.log('There is nothing to sort by in here. Needs at least a default sort.');
      return;
    }

    queryMoreQuestions(currentsort.sort, filteredTopics.map(tag => tag._id), questions.map(question => question._id)).then(
      () => updateLoading(false),
      () => {
        updateLoading(false);
        console.log('could not get more questions to add.')
      }
    )
    updateCommentSort(commentsFirst)
  }
  const processInput = () => {
    if (!searchInput) {
      return;
    }
    updateLoading(true);
    searchQuestions(searchInput).then(
      () => updateLoading(false),
      () => {
        updateLoading(false);
        console.log('error getting questions')
      }
    )
  }
  const shownQuestions = questions
    .filter(questionFilter(searchInput))
    .filter(question => !filteredTopics.length ? true : filteredTopics.map(tag => tag._id).every(tag => question.topics.filter(topic => topic.topic).map(topic => topic.topic._id).includes(tag)))
    .sort(sortOptions.find(opt => opt.selected).sortFn)
    .sort((a, b) => {
      if (!commentsFirst) {
        return a.comments.length > b.comments.length
        ? 1
        : a.comments.length < b.comments.length
          ? -1
          : 0
      }
      return a.comments.length > b.comments.length
        ? -1
        : a.comments.length < b.comments.length
          ? 1
          : 0
    });
  return (
    <div className='row'>
      <div className='col-md-4'>
      <div className='clearfix makeSticky'>
          <div className='clearfix tagsHolder'>
            <h6>
              Browse by topics
              <br />
              <small>Selected ({filteredTopics.length})</small>
            </h6>
            <div>
              <TopicSearch 
                processNewItem={(topic, event) => {
                  setFilterTopics(filteredTopics.filter(top => top.name !== topic.name).concat(topic));
                  refreshQuestions();
                }}
                processRemove={() => console.log('removed')}
              />
            </div>
          </div>
          <br />
          <div className='clearfix sortHolder'>
            <h6>Query by:
              <br />
              <small>{sortOptions.find(option => option.selected).sortName}</small>
            </h6>
            <ul>
              {sortOptions.map((option, i) => {
                const opt = sortOptions.find(setting => setting.sortName === option.sortName);
                if (!opt) {
                  return null
                }
                return <li key={i}>
                  <Switch
                    checked={opt.selected as boolean}
                    label={opt.sortName as string}
                    onChange={() => {
                      updateSorts(sortOptions.map(setting => ({ ...setting, selected: setting.sortName === opt.sortName})));
                      refreshQuestions();
                    }}
                    alignIndicator='right'
                  />
                </li>
              })}
            </ul>
          </div>
        </div>
      </div>
      <div className='col-md-8'>
      <div className={searchOpen ? 'allPage_topSettings_wrapper transitionEverything' : 'transitionEverything'}>
          <div className='row allPage_topSettings'>
            <div className='col-md-12 text-right'>
              <ButtonGroup>
                <Button 
                  icon={searchOpen ? 'cross' : 'search'}
                  intent={searchOpen ? 'danger' : 'none'}
                  minimal={true}
                  onClick={() => {
                    updateSearchOpen(!searchOpen)
                    allQuestionsSearchOpen.set(!searchOpen);
                    }}
                />
                </ButtonGroup>
            </div>
          </div>
          {filteredTopics.length > 0 && <div className={searchOpen ? 'topTopicsContainer topTopicsExpanded' : 'topTopicsContainer'}>
            {filteredTopics.map((topic, i) => {
              if (!topic.name) {
                return null;
              }
              return (
                <Tag
                  style={tagStyle}
                  large={!searchOpen}
                  icon='lightbulb'
                  interactive={true}
                  rightIcon='small-cross'
                  key={i}
                  minimal={!searchOpen}
                  onClick={() => {
                    setFilterTopics(filteredTopics.filter(top => top.name !== topic.name));
                  }}
                >
                  {topic.name}
                </Tag>
              )
            })}  
          </div>}
          
          <Collapse isOpen={searchOpen} transitionDuration={85}>
            <div className='row allBookSearchInput'>
            <div className='col-12 allSearchOptions' style={{ display: 'block'}}>
                <span>Press Enter when you're ready</span>
              </div>
              <div className='col-12'>
                <ControlGroup fill={true} vertical={false}>
                  <InputGroup
                    value={searchInput}
                    onChange={e => {
                      const value = e.target.value;
                      updateInputText(value);
                    }}
                    onKeyUp={$event => {
                      if ($event.keyCode === 13) {
                        updateLoading(true);
                        processInput();
                      }
                    }}
                    placeholder='Search by request title'
                    rightElement={
                      <Button
                        icon='search'
                        minimal={true}
                        onClick={() => {
                          updateLoading(true);
                          processInput();
                        }}
                      />
                    }
                    large={true}
                  />
                </ControlGroup>
              </div>
            </div>
          </Collapse>
        </div>
        {isLoading && <Spinner />}
        {(!isLoading && !shownQuestions.length) && <div className='nonIdealWrapper'>
          <NonIdealState
            icon='help'
            title='No Results'
            description={<p>There are no requests that match your query. <br /> You can ask users for your own suggestions by clicking below.</p>}
            action={
            <Button
              icon='help'
              text='Ask For Suggestions'
              onClick={() => {
                showAuthModal(AuthModalTypes.question);
              }}
            />
          }
          />
        </div>}
        {(!isLoading && shownQuestions.length > 0) && shownQuestions.map((question, i) => <QuestionCard question={question} key={i} style={{ marginBottom: '25px'}} />)}
      </div>
    </div>
  )
}

const mapStateToProps = (state: IStore) => ({
  questions: state.question.questions
})
const mapDispatch = dispatch => ({
  showAuthModal: (page: AuthModalTypes) => {
    dispatch({
      type: userTypes.toggleAuthModal,
      payload: true
    });
    dispatch({
      type: userTypes.setAuthModalPage,
      payload: page
    })
  }
})
export default connect(mapStateToProps, mapDispatch)(AllQuestions);
