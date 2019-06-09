import React, { useState } from 'react';
import { Popover, Icon, Menu, MenuItem, Collapse, ControlGroup, InputGroup, Button, Alert, IAlertProps } from '@blueprintjs/core';
import Book from '../../../book';
import { IExpandedBook, IStore, IUser, acceptableTypes, IComment, IReportRequest } from '../../../../state-management/models';
import { connect } from 'react-redux';
import moment from 'moment';
import Link from 'redux-first-router-link';
import { redirect } from 'redux-first-router';
import { createComment, toggleUserBook, removeComment, createReport } from '../../../../state-management/thunks'
import { keenToaster } from '../../../../containers/switcher';

const BookCard = (props: {
  book: IExpandedBook;
  minimal: boolean;
  user: IUser;
  linkTo: Function
}) => {
  const { book = undefined, minimal, user, linkTo } = props;
  if (!book) {
    return null;
  }
  const [newComment, updateComment] = useState({
    author: {
      _id: undefined,
      username: user ? user.username : 'tempUser'
    },
    text: ''
  });
  const [commentToDelete, updateDeletingComment] = useState<IComment>();
  const [itemToReport, updateReportingItem] = useState<IReportRequest>({
    parentId: '',
    parentType: acceptableTypes.comment,
    author: user ? user._id : '',
    reportType: 'spam'
  })
  const [alertProps, updateAlertProps] = useState<IAlertProps>();
  const [alertConfig, updateAlertConfig] = useState<{
    type: 'deleteComment' | 'reportComment' | 'reportBook';
    text: string;
  }>({
    type: 'deleteComment',
    text: ''
  });
  const submitNewComment = () => {
    const { text } = newComment;
    if (!text || !text.length) {
      return;
    }
    createComment(
      {
        author: user._id,
        text,
        parentId: book._id,
        parentType: acceptableTypes.book
      },
      !minimal,
      {
        type: 'SINGLEBOOK',
        payload: {
          id: book._id
        }
      })
      .then(() => {
        updateComment({
          ...newComment,
          text: ''
        })
      })
      .catch((e) => {
        console.log(e);
      })
  }
  
  const submitNewReport = () => {
    if (!itemToReport.parentId || !itemToReport.author) {
      keenToaster.show({
        intent: 'warning',
        message: 'Improper report request. Please try again.',
        icon: 'error'
      });
      return;
    }
    createReport(itemToReport)
      .then(
        () => {
          updateAlertProps({ ...alertProps, isOpen: false });
          updateReportingItem({
            parentId: '',
            parentType: acceptableTypes.comment,
            author: user ? user._id : '',
            reportType: 'spam'
          });
          updateAlertConfig({ ...alertConfig, text: ''})
        }
      )
      .catch(() => console.log('Could not add this report right now.'));
  }
  const alertFunctions = {
    deleteComment: () => commentToDelete ? removeComment(commentToDelete).then(
      () => {
        updateAlertProps({ ...alertProps, isOpen: false });
        updateDeletingComment(undefined);
        updateAlertConfig({ ...alertConfig, text: ''})
      }
    ).catch() : null,
    reportBook: () => itemToReport.parentId && itemToReport.author ? submitNewReport() : null
  }
  const { comments = [], likes = [], topics = [] } = book;
  return (
    <div className='bookCardWrapper' key={book._id}>
      <span className='bookCard_more'>
        <Popover>
          <Icon icon='more' />
          <Menu>
            <MenuItem
              icon={user && user.readBooks.map(livre => livre._id).includes(book._id) ? 'remove-column' : 'bookmark'}
              text={`Mark ${user && user.readBooks.map(livre => livre._id).includes(book._id) ? 'unread' : 'as read'}`}
              onClick={() => toggleUserBook(book._id, 'readBooks', user && user.readBooks.map(livre => livre._id).includes(book._id) ? 'remove' : 'add')}
            />
            <MenuItem icon='lightbulb' text='Add Topic' />
            <Menu.Divider />
            <MenuItem icon='shopping-cart' text='Purchase' labelElement={<Icon icon='share' />} onClick={() => window.open(book.affiliate_link || book.amazon_link, '_blank')}/>
            <Menu.Divider />
            <MenuItem
              icon='flag'
              text='Report Book' 
              onClick={() => {
                updateReportingItem({
                  parentId: book._id,
                  parentType: acceptableTypes.book,
                  author: user ? user._id : '',
                  reportType: 'inappropriate'
                })
                updateAlertConfig({
                  type: 'reportBook',
                  text: `Are you sure you want to report '${book.title}' as Inappropriate?`
                })
                updateAlertProps({
                  cancelButtonText: 'Nevermind',
                  confirmButtonText: 'Report it',
                  icon: 'flag',
                  isOpen: true,
                  intent: 'danger',
                });
              }}
            />
              
            
          </Menu>
        </Popover> 
      </span>
      <div className='row'>
        <div className='col-5 bookCard_book'>
          <Book bookId={book._id} key={book._id} />
          <Alert
            {...alertProps}
            onConfirm={() => alertFunctions[alertConfig.type]()}
            onCancel={() => updateAlertProps({ isOpen: false})}
          >
            {alertConfig.text}
          </Alert>
        </div>
        <div className='col-7 bookCard_details'>
          <ul className='bookCard_engage'>
            <li onClick={() => toggleUserBook(book._id, 'savedBooks', book.likes.includes(user ? user._id : '') ? 'remove' : 'add')}>
              <Icon
                icon='heart'
                intent={book.likes.includes(user ? user._id : '') ? 'danger' : 'none'}
              /> {likes.length}
            </li>
            <li onClick={() => linkTo({ type: 'SINGLEBOOK', payload: { id: book._id } })}> <Icon icon='comment' /> {comments.length} </li>
            <li onClick={() => linkTo({ type: 'SINGLEBOOK', payload: { id: book._id } })}> <Icon icon='lightbulb' /> {topics.length} </li>
          </ul>
          <div className='bookCard_commentsContainer'>
            <ul className='keen_comments_wrapper'>
              {comments.map((comment, i, arr) => {
                if (minimal && i > 0) {
                  return null;
                }
                return (
                  <li key={i}>
                    <Popover>
                      <div className='keen_comments_details'>
                        <small><Icon icon='user' iconSize={13}/> &nbsp; @{comment.author.username} | {moment(comment.created).fromNow()}</small>
                        <span className='keen_comment_text'>{comment.text}</span>
                      </div>
                      <Menu>
                        {user && user._id === comment.author._id
                          ? <MenuItem
                              icon='trash'
                              text='Delete comment'
                              onClick={() => {
                                updateDeletingComment(comment);
                                updateAlertConfig({
                                  type: 'deleteComment',
                                  text: 'Are you sure you want to delete this comment?'
                                })
                                updateAlertProps({
                                  cancelButtonText: 'Nevermind',
                                  confirmButtonText: 'Delete it',
                                  icon: 'trash',
                                  isOpen: true,
                                  intent: 'danger',
                                })
                              }}
                          />
                          : <MenuItem
                              icon='flag'
                              text='Report comment'
                              onClick={() => {
                                updateReportingItem({
                                  parentId: comment._id,
                                  parentType: acceptableTypes.comment,
                                  author: user ? user._id : '',
                                  reportType: 'inappropriate'
                                })
                                updateAlertConfig({
                                  type: 'reportBook',
                                  text: `Are you sure you want to report this comment as Inappropriate?`
                                })
                                updateAlertProps({
                                  cancelButtonText: 'Nevermind',
                                  confirmButtonText: 'Report it',
                                  icon: 'flag',
                                  isOpen: true,
                                  intent: 'danger',
                                });
                              }}
                          />
                        }
                      </Menu>
                    </Popover> 
                  </li>
                )
              })}
              {comments.length === 0 && <li>
                <p className='bookCard_noComments'>
                  No comments
                  <br />
                  <small style={{ display: 'block'}}>Add one below.</small>
                </p>
                </li>}
              <Collapse isOpen={newComment.text.length > 0}>
                <li>
                  <div className='keen_comments_details'>
                    <small><Icon icon='user' iconSize={13}/> &nbsp; @{newComment.author.username}&nbsp;&nbsp;·&nbsp;&nbsp;{moment().fromNow()}</small>
                    {newComment.text.length > 0 && <span className='keen_comment_text'>{newComment.text}</span>}
                  </div>
                </li>
              </Collapse>
            </ul>
            <div className='keen_comments_meta'>
              <small><Icon iconSize={11} icon='comment' /> {comments.length}</small>
              <small><Link to={{ type: 'SINGLEBOOK', payload: { id: book._id }}}>View All</Link></small>
            </div>
            <div className='keen_comments_Input'>
              <ControlGroup fill={true} vertical={false} >
                <InputGroup
                  placeholder={`Add your comment...`}
                  leftIcon='user'
                  value={newComment.text}
                  onKeyUp={$event => {
                    if ($event.keyCode === 13) {
                      submitNewComment();
                    }
                  }}
                  rightElement={
                    <Button
                      minimal={true}
                      icon='tick'
                      onClick={() => submitNewComment()}
                    />
                  }
                  onChange={e => updateComment({ ...newComment, text: e.target.value })}
                />
              </ControlGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state: IStore) => ({
  user: state.user.user
})

const mapDispatch = dispatch => ({
  linkTo: action => dispatch(redirect(action))
});

export default connect(mapStateToProps, mapDispatch)(BookCard);
