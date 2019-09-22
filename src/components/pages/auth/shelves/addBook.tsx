import React, { useState } from 'react';
import { ITopic, IShelfDetail, IStore, IBook, ShelfEditType, IUser, AuthModalTypes, acceptableTypes, ITopicBodyObj, ProfileNavOptions } from '../../../../state-management/models';
import { connect } from 'react-redux';
import {  NonIdealState, Collapse, FormGroup, Button, TextArea  } from '@blueprintjs/core';
import { Select } from "@blueprintjs/select";
import Icon, { IconTypeEnum } from '../../../icons';
import Book from '../../../book';
import { shelfSelectProps } from './shelfSelectSettings';
import { editShelf, createComment, showAuthModal, addTopicsToBook } from '../../../../state-management/thunks';
import './shelfForm.css';
import { keenToaster } from '../../../../containers/switcher';
import Topic from '../../../topic';
import { redirect } from 'redux-first-router';
import TopicSearch from '../topic/topicBrowse';

const ShelfSelect = Select.ofType<IShelfDetail>();

const addBookToShelf = (props: {
  goToNext: boolean;
  callBack: Function;
  style: any;
  data: IBook;
  myShelves: Array<IShelfDetail>;
  user: IUser;
  linkTo: Function;
}) => {
  const { data: book = null, myShelves = [], callBack, user, linkTo } = props
  if (!user || !user._id) {
    return (
      <div className='nonIdealWrapper' style={{ padding: '25px 0 50px'}}>
        <NonIdealState
          icon={<Icon icon='fa-user-times' />}
          title='You must be logged in to perform this action'
          description={<p>Login or Join to curate your own library.</p>}
          action={(
            <Button
              minimal={true}
              text='Log in'
              icon={<span className='bp3-icon'><Icon icon='fa-sign-in' /> </span>}
              large={true}
              onClick={() => showAuthModal(AuthModalTypes.login)}
            />
          )}
        />
      </div>
    );
  }
  if (!book) {
    return (
      <div className='nonIdealWrapper' style={{ padding: '25px 0 50px'}}>
        <NonIdealState
          icon={<Icon icon='fa-empty-set' />}
          title='You must first select a book'
          description={<p>Find books you want to add to this shelf throughout the website.</p>}
        />
      </div>
    );
  }
  const [showTopics, setTopicVisible] = useState<boolean>(false)
  const [selectedShelf, setSelectedShelf] = useState<IShelfDetail>();
  const [comment, setComment] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);
  const [topicFormVisible, setTopicForm] = useState<boolean>(false);
  const [topicsToAdd, setAddedTopics] = useState<Array<ITopic>>([]) 
  const saveBook = () => {
    if (!selectedShelf) {
      return;
    }
    const req = {
      type: ShelfEditType.addBook,
      payload: {
        bookId: book._id
      }
    }
    setLoading(true);
    Promise.all([
      editShelf(selectedShelf.id, { edits: [req] }),
      ...(comment && comment.length
        ? [createComment({
          author: user._id,
          text: comment,
          parentId: book._id,
          parentType: acceptableTypes.book,
          created: new Date()
        })]
        : []
      )
    ]).then(
      (res) => {
        setLoading(false);
        setTopicVisible(true);
      },
      err => {
        console.error(err);
        keenToaster.show({
          message: <><strong>Error:</strong> Could not add this book to your shelf</>,
          icon: <span className='bp3-icon'> <Icon icon='fa-exclamation' /></span>,
          intent: 'none'
        });
      }
    )
  }
  const finishForm = () => {
    setLoading(true);
    if (topicsToAdd.length > 0) {
      addTopicsToBook(book._id, topicsToAdd).then(
        () => {
          keenToaster.show({
            message: 'Topics added to book. Redirecting to shelf.',
            icon: <span className='bp3-icon'><Icon icon='fa-check' type={IconTypeEnum.light} /> </span>
          })
          setLoading(false);
          linkTo({ type: 'MYPAGE', payload: { page: ProfileNavOptions.lists, part: selectedShelf.id }});
          callBack();
        },
        err => {
          setLoading(false);
          console.error(err);
        }
      )
      return;
    }
    setLoading(false);
    linkTo({ type: 'MYPAGE', payload: { page: ProfileNavOptions.lists, part: selectedShelf.id }});
    callBack();
  }
  const { title, topics } = book;

  return (
    <div className='row shelfForm_add_book_wrapper'>
      <div className='col-md-3' style={{ position: 'relative', zIndex: 19 }}><Book liv={book} selectedBook={true} /></div>
      <div className='col-md-9 shelfForm_fields_wrapper' style={{ position: 'relative', zIndex: 16 }}>
        {!showTopics && (
          <>
            <div className='shelfForm_field_row'>
              <ShelfSelect
                { ...shelfSelectProps}
                onItemSelect={item => setSelectedShelf(item)}
                items={myShelves}
              >
                <Button
                  minimal={true}
                  large={true}
                  fill={true}
                  icon={selectedShelf ? <span className='bp3-icon'><Icon icon='fa-books' /></span> : undefined}
                  rightIcon={<span className='bp3-icon'><Icon icon='fa-caret-down' /></span>}
                  text={selectedShelf
                    ? <><strong>Shelf: </strong>{selectedShelf.title}</>
                    : 'Select Shelf'}
                />
              </ShelfSelect>
            </div>
            <div
              className='shelfForm_field_row'
              style={{
                paddingLeft: !selectedShelf ? '0' : '15px'
              }}
            >
              <TextArea
                fill={true}
                large={true}
                disabled={!selectedShelf}
                growVertically={true}
                placeholder={`Add your thoughts about '${book.title}'. (Optional)`}
                onChange={$e => setComment($e.target.value)}
              />
            </div>
            <div className='shelfForm_field_row'>
              <Button
                text='Cancel'
                minimal={true}
                large={true}
                onClick={() => callBack()}
              />
              &nbsp;&nbsp;
              <Button
                text='Save'
                minimal={true}
                large={true}
                disabled={!selectedShelf || isLoading}
                rightIcon={<span className='bp3-icon'><Icon icon={isLoading ? 'fa-spinner fa-spin' :'fa-chevron-right'} /></span>}
                onClick={() => saveBook()}
              />
            </div>
          </>
        )}
        {showTopics && (
          <div className='shelfForm_topics_wrapper'>
            <h6>This book has {topics.length} Topic{topics.length !== 1 ? 's' : ''} </h6>
            <p>
              <span className='text-muted'>Click on a topic to <strong>agree</strong> that it is discussed in this book.</span>
              <br />
              <span className='text-muted'>Add more topics to help categorize this book in your shelf.</span>
            </p>
            <div className='shelfForm_topics_container'>
              {topics.map((topic: ITopicBodyObj, i) => {
                return (
                  <Topic
                    minimal={false}
                    key={topic._id}
                    topicBody={topic}
                    topicSize='smallTopic'
                    hideNumber={false}
                    interactive={true}
                  />
                );
              })}
            </div>
            {topicsToAdd.length > 0 && (
              <div className='shelfForm_topics_adding_wrapper'>
                <div className='shelfForm_topics_adding_container'>
                  {topicsToAdd.map((topic: ITopic, i) => {
                    return (
                      <Topic
                        minimal={false}
                        key={topic._id}
                        skill={topic}
                        topicSize='smallTopic'
                        hideNumber={true}
                        interactive={true}
                        removable={true}
                        onClick={() => {setAddedTopics(topicsToAdd.filter(top => top._id !== topic._id))}}
                      />
                    );
                  })}
                </div>
              </div>
            )}
            <div className='shelfForm_topics_btns_container'>
              {topicFormVisible && (
                <TopicSearch
                  processNewItem={item => {
                    if (topicsToAdd.length === 3) {
                      keenToaster.show({
                        message: 'You can only add up to 3 topics at a time.',
                        icon: <span className='bp3-icon'><Icon icon='fa-exclamation' /></span>
                      });
                      return;
                    }
                    setAddedTopics(topicsToAdd.filter(topic => topic._id !== item._id).concat(item))
                  }}
                  processRemove={() => null}
                />
              )}
              {!topicFormVisible && (
                <Button
                  icon={<span className='bp3-icon'><Icon icon='fa-plus-circle' type={IconTypeEnum.light} /></span>}
                  small={true}
                  minimal={true}
                  text='Add topic(s)'
                  onClick={() => setTopicForm(true)}
                />
              )}
            </div>
            <div className='shelfForm_final_actions_container'>
              <Button
                text='Close'
                minimal={true}
                onClick={() => callBack()}
              />
              <Button
                disabled={isLoading}
                text={topicsToAdd.length > 0
                  ? `Add ${topicsToAdd.length} topic${topicsToAdd.length !== 1 ? 's' : ''}`
                  : 'Go to Shelf'
                }
                icon={<span className='bp3-icon'><Icon icon={topicsToAdd.length > 0 ? 'fa-graduation-cap' : 'fa-books'} /></span>}
                onClick={() => finishForm()}
                minimal={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const mapStateToProps = (state: IStore) => ({
  myShelves: state.user.user ? state.user.user.myShelves : [],
  user: state.user.user
})

const mapDispatch = dispatch => ({
  linkTo: payload => dispatch(redirect(payload))
})
export default connect(mapStateToProps, mapDispatch)(addBookToShelf);
