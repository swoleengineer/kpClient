import React, { useState } from 'react';
import { IUser, ITopic, IStatFigure, IAppState, IStore } from '../../../../../state-management/models';
import { editStats, queryMoreBooks, deleteStatSkill } from '../../../../../state-management/thunks';
import { bookActionTypes as bookTypes } from '../../../../../state-management/actions';
import { Button, Collapse, FormGroup, Slider, TextArea, Alert } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import * as moment from 'moment';
import { getFormProps } from '../../../auth/util';
import { keenToaster } from '../../../../../containers/switcher';
import KPBOOK from '../../../../../assets/kp_book.png';
import JustbooksPage from './justBooks';
import { connect } from 'react-redux';
import { redirect } from 'redux-first-router';
import Icon from '../../../../icons';
import { LocationState } from 'redux-first-router';
interface IProps {
  openPanel: Function;
  user: IUser;
  statTopic: ITopic;
  figure: IStatFigure;
  closePanel: Function;
  viewPort: IAppState['viewPort'];
  linkTo: Function;
  updateFilteredTopics: Function;
  profileNavPage: string;
  location: LocationState;
}
const fullStat = (props: IProps) => {
  const { location: { payload: { page: statPage, part: profileNavPage }}, closePanel, figure: figFromProp, statTopic: topic, viewPort, openPanel, user, linkTo, updateFilteredTopics } = props;
  if (!figFromProp) {
    return null;
  }
  const nextMonth = moment().add(1, 'M').toDate()
  const [figure, updateFigure] = useState(figFromProp);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [dateChanged, setDateChanged] = useState(false);
  const [currentType] = useState<string>(profileNavPage)
  const [formData, formUpdate] = useState({
    goal: figure.goal,
    dueDate: moment(figure.dueDate).toDate() || nextMonth,
    description: figure.description || ''
  });
  const [formErrors, updateErrors] =  useState<Array<{ field: string; message: string; intent: 'danger' | 'none' | 'primary' | 'success'}>>([]);
  const [alertProps, updateAlertProps] = useState<any>();
  const { goal, description, created, updated, dueDate, currentStatus, snapShots, _id: skillId } = figure;
  const progress = Math.round((currentStatus / goal) * 100);
  const progressText = {
    [progress < 25]: 'You got this!',
    [progress > 24 && progress < 50]: 'Keep it up!',
    [progress === 50]: 'Halfway there!',
    [progress > 50 && progress < 75]: 'Come a long way!',
    [progress > 74 && progress < 100]: 'Almost there!',
    [progress > 99]: 'Now apply it!'  
  }[true];

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
  const getProps = getFormProps(getErr, processField, true);
  const processForm = () => {
    if (formErrors.length) {
      keenToaster.show({
        message: 'Please resolve form errors before submitting.',
        icon: 'error'
      });
      return;
    }
    const request = Object.keys(formData).reduce((acc, curr) => {
      const add: boolean = formData[curr] !== props.figure[curr];
      return {
        ...acc,
        edits: [ ...acc.edits, ...(add ? [{ field: curr, value: formData[curr] }] : [])]
      }
    }, { skillId, edits: [] });

    if (!request.edits.length) {
      setEditMode(false);
      return;
    }

    editStats(request).then(
      (res: any) => {
        const { figures } = res;
        const thisSkill = figures.filter(fig => fig).find(fig => fig._id === skillId)
        updateFigure(thisSkill);
        setEditMode(false)
      },
      (err) => {
        console.log(err);
        if (!err) {
          keenToaster.show({
            message: 'Error updating this stat. Try again later.',
            icon: 'error'
          });
        }
      }
    )
  }
  if (profileNavPage && profileNavPage !== currentType) {
    closePanel();
  }
  return (
    <div className='fullStatWrapper'>
      <Alert
        {...alertProps}
        onConfirm={() => deleteStatSkill(skillId).then(
          () => closePanel(),
          () => closePanel()
        )}
        onCancel={() => updateAlertProps({ isOpen: false })}
        cancelButtonText='Nevermind'
      >
        Are you sure you no longer want to track <strong>{topic.name}</strong> in your stats?
      </Alert>
      <header className='fullStat_header'>
          <Icon icon='fa-graduation-cap' />
          <span>{topic.name || 'Topic Name'}</span>
          {statPage === 'inProgress' && <div className='fullStat_header_btns'>
            <Button
              icon={editMode ? 'cross' : 'edit'}
              intent={editMode ? 'danger' : 'none'}
              minimal={true}
              onClick={() => setEditMode(!editMode)}
            />
            <Button
              icon='trash'
              minimal={true}
              onClick={() => {
                updateAlertProps({
                  confirmButtonText: 'Delete',
                  icon: 'error',
                  isOpen: true,
                  intent: 'danger'
                })
              }}
            />
          </div>}
        </header>
      <Collapse isOpen={editMode} transitionDuration={40}>
        <div className='fullStat_form_wrapper'>
          <div className='row'>
            <div className='col-12'>
              <h4>Edit My Stat</h4>
            </div>
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
                  value={formData.description}
                />
              </FormGroup>
            </div>
          </div>
          <br />
          <br />
          <div className='row'>
            <div className='col-12 text-right'>
              <Button
                text='Cancel'
                intent='danger'
                minimal={true}
                onClick={() => {
                  formUpdate({
                    goal: figure.goal,
                    dueDate: figure.dueDate || nextMonth,
                    description: figure.description || ''
                  });
                  setEditMode(false);
                }}
                style={{ marginRight: '10px'}}
              />
              <Button
                text='Update Stat'
                intent='primary'
                onClick={() => processForm()}
                disabled={formErrors.length > 0}
              />
            </div>
          </div>
        </div>
        
      </Collapse>
      <Collapse isOpen={!editMode} transitionDuration={40}>
        <div className='fullStatMetaWrapper'>
          <div className='fullStatMeta_goalIcons'>
            {Array(currentStatus > goal ? currentStatus : goal).fill('').map((_, i) => {
              const num = i + 1;
              const over: boolean = num > goal;
              return (
                <Icon
                  key={i}
                  icon='fa-book'
                  style={{
                      color: over
                        ? '#C9CC89'
                        : num <= currentStatus
                          ? 'white'
                          : 'rgba(255,255,255,.5)'
                      }}
                />
              )
            })}
          </div>
          <span className='fullStatMeta_goal_text'>
            I've read <strong>{currentStatus}</strong> of <strong>{goal} Book{goal !== 1 && 's'}</strong> goal.
            <br />
            <span
              className='fullStatMeta_goal_btn'
              onClick={() => {
                updateFilteredTopics({
                  type: 'add',
                  data: topic
                });
                linkTo({ type: 'ALLBOOKS' });
                queryMoreBooks(undefined, [topic._id], undefined).then(
                  () => {},
                  () => console.log('error retrieving books')
                )
              }}
            >
              Browse <strong>{topic.name}</strong> books <Icon icon='fa-chevron-right' />
            </span>
          </span>
          <table>
            <tbody>
              <tr>
                <td>My Why</td>
                <td>{description}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='fullStat_progressBarWrapper'>
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
        <div className='fullStat_dates_wrapper'>
          {viewPort !== 'mobile' && <div className='fullStat_dates_single'>
            <span className='fullStat_dates_cat'>Started</span>
            <span className='fullStat_dates_date'>{moment(created).format('MMM. Do, YYYY')}</span>
            <span className='fullStat_dates_fromNow'>{moment(created).fromNow()}</span>
          </div>}
          <div className='fullStat_dates_single'>
            <span className='fullStat_dates_cat'>Updated</span>
            <span className='fullStat_dates_date'>{moment(updated).format('MMM. Do, YYYY')}</span>
            <span className='fullStat_dates_fromNow'>{moment(updated).fromNow()}</span>
          </div>
          <div className='fullStat_dates_single'>
            <span className='fullStat_dates_cat'>Due</span>
            <span className='fullStat_dates_date'>{moment(dueDate).format('MMM. Do, YYYY')}</span>
            <span className='fullStat_dates_fromNow'>{moment(dueDate).fromNow()}</span>
          </div>
        </div>
      </Collapse>
      <div className='fullStat_snapshots_wrapper'>
        <h5 className='title'>Updates</h5>
        <div className='fullStat_snapshots_container'>
          {snapShots
            .sort((a, b) => a.created > b.created ? -1 : a.created < b.created ? 1 : 0)
            .map((shot, i) => {
            const { created: shotDate, books: shotBooks = [] } = shot;
            return (
              <div className='single_stat_snapshot' key={i}>
                <div className='single_stat_snapshot_bookCount'>
                  <span className='single_stat_snapshot_bookCount_nm'>{shotBooks.length}</span>
                  <span className='single_stat_snapshot_bookCount_txt'>Book{shotBooks.length !== 1 && 's'} read</span>
                </div>
                <div className='single_stat_snapshot_details'>
                  <div className='single_stat_snapshot_details_top'>
                    <span
                      className='single_stat_snapshot_details_date'
                      onClick={() => {
                        if (viewPort !== 'mobile' || !shotBooks.length) {
                          return;
                        }
                        openPanel({
                          component: JustbooksPage,
                          props: {
                            snapshot: shot,
                            user,
                            viewPort,
                            topic,
                            statPage
                          },
                          title: moment(shotDate).format('MMM. Do, YYYY')
                        });
                      }}
                    >
                      {moment(shotDate).format('MMM. Do, YYYY')}
                      {viewPort === 'mobile' && <Icon icon='fa-chevron-right' />}
                    </span>
                    {shotBooks.length > 0 && <div className='single_stat_snapshot_details_btn hidden-sm'>
                      <Button
                        small={true}
                        minimal={true}
                        rightIcon='chevron-right'
                        text='View books'
                        onClick={() => {
                          openPanel({
                            component: JustbooksPage,
                            props: {
                              snapshot: shot,
                              user,
                              viewPort,
                              topic
                            },
                            title: moment(shotDate).format('MMM. Do, YYYY')
                          })
                        }}
                      />
                    </div>}
                    
                  </div>
                  <div className='single_stat_snapshot_details_bottom'>
                    {shotBooks.length > 0
                      ? <div className='single_stat_snapshot_details_allBooks'>
                        {shotBooks.map((book, index) => {
                            const { book: { pictures } } = book;
                            const [ picture = { link: undefined}] = pictures || [];
                            return (
                              <div key={index} className='single_stat_snapshot_details_book_wrapper'>
                                <div 
                                  className='single_stat_snapshot_details_book'
                                  style={{backgroundImage: `url(${picture.link || KPBOOK})`}}
                                />
                              </div>
                            )
                          })}
                      </div>
                      : <div className='single_stat_snapshot_details_noBooks'>
                        No <strong>{topic.name}</strong> books read.
                      </div>
                    }
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
    </div>
  );
}

const mapStateToProps = (store: IStore) => ({
  location: store.location
})

const mapDispatch = dispatch => ({
  linkTo: payload => dispatch(redirect(payload)),
  updateFilteredTopics: payload => dispatch({ type: bookTypes.updateFilterTopics, payload }),
})
export default connect(mapStateToProps, mapDispatch)(fullStat);
