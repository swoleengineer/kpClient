import React, { useState } from 'react';
import { connect } from 'react-redux';
import { IStore, IExpandedBook, IUser, ITopic, IComment, acceptableTypes, IReportRequest } from '../../../../state-management/models';
import { Card, Icon, Breadcrumbs, Tag, Collapse, ButtonGroup, Button, Popover, Menu, MenuItem, ControlGroup, InputGroup, Alert, IAlertProps } from '@blueprintjs/core'
import moment from 'moment';
import './books.css';
import Book from '../../../book';
import Link from 'redux-first-router-link';
import { redirect } from 'redux-first-router'
import TopicBrowse from '../../auth/topic/topicBrowse';
import { toggleUserBook, addTopicsToBook, createComment, removeComment, createReport, toggleTopicAgreeBook, engagePrecheck } from '../../../../state-management/thunks'
import { keenToaster } from '../../../../containers/switcher';
import { getAuthorName } from '../../../../state-management/utils/book.util';
import Topic from '../../../topic';


const SingleBook = (props: {
  book: IExpandedBook;
  user: IUser;
  linkTo: Function
}) => {
  const { book, user } = props;
  if (!book || !Object.keys(book).length) {
    return null;
  }
  document.title = `${book.title} - keenpages.com`;
  const [addTopicOpen, setTopicForm] = useState<boolean>(false);
  const [topicsToAdd, adjustTopics] = useState<ITopic[]>([]);
  const [newComment, updateComment] = useState({
    author: {
      _id: user ? user._id : '',
      username: user ? user.username : 'tempUser'
    },
    text: ''
  });
  const [commentToDelete, updateDeletingComment] = useState<IComment>();
  const [alertProps, updateAlertProps] = useState<IAlertProps>();
  const [alertConfig, updateAlertConfig] = useState<{
    type: 'deleteComment' | 'reportComment' | 'reportBook';
    text: string;
  }>({
    type: 'deleteComment',
    text: ''
  });
  const [itemToReport, updateReportingItem] = useState<IReportRequest>({
    parentId: '',
    parentType: acceptableTypes.comment,
    author: user ? user._id : '',
    reportType: 'inappropriate'
  })
  const pathToHere = [
    { type: 'HOME', href: '/', icon: 'home', text: 'Home' },
    { type: 'ALLBOOKS', href: '/books', icon: 'th', text: 'All books' },
    { type: 'SINGLEBOOK', payload: { id: book._id }, href: `/book/${book._id}`, icon: 'book', text: book.title}
  ]
  const userBook = user && user.readBooks.map(livre => livre._id).includes(book._id)
    ? 'readBooks'
    : user && user.savedBooks.map(livre => livre._id).includes(book._id)
      ? 'savedBooks'
      : undefined
  const submitNewComment = () => {
    const { text } = newComment;
    if (!text || !text.length) {
      return;
    }
    engagePrecheck(book, true, error => {
      if (error) {
        return;
      }
      createComment(
        {
          author: user._id,
          text,
          parentId: book._id,
          parentType: acceptableTypes.book,
          created: new Date()
        },
        false,
        {
          type: 'SINGLEBOOK',
          payload: {
          id: book._id
          }
        })
      .then(() => {
        updateComment({ ...newComment, text: '' })
      })
      .catch((e) => {
        console.log(e);
      })
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
            reportType: 'inappropriate'
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
  let commentInput;
  return (
    <div className='singleBookPage'>
      <Alert
        {...alertProps}
        onConfirm={() => alertFunctions[alertConfig.type]()}
        onCancel={() => updateAlertProps({ isOpen: false})}
        cancelButtonText='Nevermind'
      >
        {alertConfig.text}
      </Alert>
      <Breadcrumbs
        items={pathToHere}
        breadcrumbRenderer={crumb => <Link to={{ type: crumb.type, payload: crumb.payload }} className='singleBook_bcrumb'><Icon icon={crumb.icon} iconSize={12} /> {crumb.text}</Link>}
      />
      <div className='row'>
        <div className='col-md-4'>
          <Book liv={book} />
          <ul className='underBookMenu'>
            <MenuItem
              icon={user && user.readBooks.map(livre => livre._id).includes(book._id) ? 'remove-column' : 'bookmark'}
              text={`Mark ${user && user.readBooks.map(livre => livre._id).includes(book._id) ? 'unread' : 'as read'}`}
              onClick={() => {
                engagePrecheck(book, true, (err) => {
                  if (err) {
                    return;
                  }
                  toggleUserBook(book._id, 'readBooks', user && user.readBooks.map(livre => livre._id).includes(book._id) ? 'remove' : 'add').then(
                    () => console.log(''),
                    () => console.log('')
                  )
                })
              }}
            />
            {(book.affiliate_link || book.amazon_link) && <>
              <Menu.Divider />
              <MenuItem icon='shopping-cart' text='Purchase' labelElement={<Icon icon='share' />} onClick={() => window.open(book.affiliate_link || book.amazon_link, '_blank')}/>
            </>}
            <Menu.Divider />
            <MenuItem
              icon='flag'
              text='Report Book' 
              onClick={() => {
                engagePrecheck(book, true, err => {
                  if (err) {
                    return;
                  }
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
                })
              }}
            />
          </ul>
        </div>
        <div className='col-md-8 singleBook_top_topics_wrapper'>
          <header>
            <h2>
              <strong>{book.title}</strong>
              {book.subtitle && <small>{book.subtitle}</small>}
            </h2>
            {getAuthorName(book) && <p className='description'>By {getAuthorName(book)}</p>}
            {userBook && <Tag round={true} icon={userBook === 'readBooks' ? 'bookmark' : 'book'} intent='danger'>
              {`${userBook === 'readBooks' ? 'You have read this book' : 'In your saved library'}`}
            </Tag>}
          </header>
          <div className='underBookEngagement row'>
            <ul className='bookCard_engage col-md-6'>
              <li 
                onClick={() => {
                  engagePrecheck(book, true, err => {
                    if (err) {
                      return;
                    }
                    return user 
                      ? toggleUserBook(book._id, 'savedBooks', book.likes.includes(user._id) ? 'remove' : 'add')
                      : null;
                  })
                }}
              >
                <Icon
                  icon='heart'
                  intent={user && book.likes.includes(user._id) ? 'danger' : 'none'}
                /> {book.likes.length}
              </li>
              <li onClick={() => commentInput.focus()}> <Icon icon='comment' /> {book.comments.length} </li>
              <li onClick={() => setTopicForm(!addTopicOpen)}> <Icon icon={<i className='fa fa-graduation-cap' />} /> {book.topics.length} </li>
            </ul>
          </div>
          <Card>
            {book.description && <>
              <h5>Description</h5>
              <p>{book.description}</p>
            </>}
            {(book.isbn10 || book.isbn13 || book.publisher || book.publish_date) && <p>
              {book.publisher && <span className='metaListItem'><strong>Publisher:</strong> {book.publisher}</span>}
              {book.publish_date && <span className='metaListItem'><strong>Published:</strong> {book.publish_date}</span>}
              {book.isbn10 && <span className='metaListItem'><strong>ISBN 10:</strong> {book.isbn10}</span>}
              {book.isbn13 && <span className='metaListItem'><strong>ISBN 13:</strong> {book.isbn13}</span>}
            </p>}
          </Card>
          <div className={addTopicOpen ? 'singlePageTopicsSection addingOpen' : 'singlePageTopicsSection'}>
            <h5>
              <span>Topics ({book.topics.length})</span>
              {(!addTopicOpen || (addTopicOpen && topicsToAdd.length < 1)) && <Button
                text={addTopicOpen ? 'Cancel' : 'Add topic'}
                icon={addTopicOpen ? 'cross' : 'add'}
                small={true}
                className='singlePageTopicAddbtn'
                minimal={true}
                onClick={() => setTopicForm(!addTopicOpen)}
                intent={addTopicOpen ? 'danger' : 'none'}
              />}
              
            </h5>
            <p>Thumbs up if you agree a topic is covered in this book.</p>
            <div className='singleBookAddTopics'>
              <Collapse isOpen={topicsToAdd.length > 0 && addTopicOpen} transitionDuration={45}>
                <div className='row incomingTopics'>
                  <div className='col-12'>{topicsToAdd.map((topic, i) =>
                    <Topic
                      key={i}
                      interactive={true}
                      onClick={() => adjustTopics(topicsToAdd.filter(skill => skill._id !== topic._id))}
                      skill={topic}
                      topicSize='smallTopic'
                      style={{
                        margin: '0 10px 10px 0',
                        display: 'block',
                        float: 'left'
                      }}
                    />
                    )}</div>
                </div>
                <div className='clearfix text-right' style={{ marginBottom: '10px'}}>
                  <ButtonGroup>
                    <Button
                      minimal={true}
                      small={true}
                      icon='cross'
                      intent='danger'
                      onClick={() => {
                        setTopicForm(!addTopicOpen);
                        adjustTopics([])
                      }}
                      text='Cancel'
                    />
                    <Button
                      minimal={true}
                      small={true}
                      icon='add'
                      onClick={() => {
                        engagePrecheck(book, true, err => {
                          if (err) {
                            return;
                          }
                          addTopicsToBook(book._id, topicsToAdd)
                            .then(() => adjustTopics([]))
                            .catch(() => adjustTopics([]))
                        })
                      }}
                    >
                      Add {topicsToAdd.length} topic{topicsToAdd.length > 1 && 's'}
                    </Button>
                  </ButtonGroup>
                </div>
              </Collapse>
              <Collapse isOpen={addTopicOpen} transitionDuration={60}>
                
                <TopicBrowse
                  processNewItem={(topic, event) => {
                    if (topicsToAdd.length > 9 && topicsToAdd.findIndex(skill => skill.name === topic.name) < 0) {
                      keenToaster.show({
                        message: '10 topics max at a time please.',
                        intent: 'warning',
                        icon: 'info-sign'
                      });
                      return;
                    }
                    if (book.topics.filter(tpc => tpc.topic && tpc.topic.name).map(tpc => tpc.topic._id).includes(topic._id)) {
                      keenToaster.show({
                        message: `${topic.name} already in this book.`,
                        intent: 'warning',
                        icon: 'error'
                      })
                      return;
                    }
                    adjustTopics(topicsToAdd.filter(skill => skill.name !== topic.name).concat(topic))}
                  }
                  processRemove={() => console.log('removed topic')}
                />
              </Collapse>
            </div>
            {(book.topics && book.topics.length > 0) && <div className='singlePageTopicsWrapper'>{book.topics.map((topic, i) => {
              return (!topic || !topic.topic || !topic.topic.name) ? null : (
                <Topic
                  topicBody={topic}
                  key={topic._id}
                  interactive={true}
                  topicSize='normalTopic'
                  minimal={true}
                  selected={(user && (typeof topic.agreed[0] === 'object' ? topic.agreed.map(person => person._id).includes(user._id) : topic.agreed.includes(user._id)))}
                  onClick={() => {
                    engagePrecheck(book, true, err => {
                      if (err) {
                        return;
                      }
                      return user 
                        ? toggleTopicAgreeBook(book._id, topic._id)
                          .then(
                            () => console.log('success'),
                            () => console.log('fail')
                          )
                        : null
                    })
                  }}
                />
                // <div className='topicCompWrapper topicCompInteractive'>
                //   <div className='topicCompLeft'>
                //     <Icon icon='lightbulb' iconSize={12} />
                //     <span className='topicCompName'>{topic.topic.name}</span>
                //   </div>
                //   <div className='topicCompRight'>
                //     {topic.agreed.length}
                //   </div>
                // </div>
                // <Tag
                //   icon='lightbulb'
                //   rightIcon={<span>| <Icon icon='thumbs-up' /> {topic.agreed.length}</span>}
                //   interactive={true}
                //   large={true}
                //   key={i}
                //   style={{
                //     marginRight: '10px',
                //     marginBottom: '10px'
                //   }}
                //   minimal={!(user && (typeof topic.agreed[0] === 'object' ? topic.agreed.map(person => person._id).includes(user._id) : topic.agreed.includes(user._id)))}
                //   onClick={() => {
                //     engagePrecheck(book, true, err => {
                //       if (err) {
                //         return;
                //       }
                //       return user
                //         ? toggleTopicAgreeBook(book._id, topic._id)
                //             .then(
                //               () => console.log('request successful. Toggled agree status'),
                //               () => console.log('request failed toggling topic agree status')
                //             )
                //         : null
                //     })
                //   }}
                // >
                //   {topic.topic.name}
                // </Tag>
              )
            })}
            </div>}
          
          </div>
          <div className='row singleBook_actionsWrapper'>
            <div className='col-12'>
              <div className='bookCard_commentsContainer'>
                <ul className='keen_comments_wrapper'>
                  {book.comments.map((comment, i, arr) => {
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
                                    engagePrecheck(book, user, err => {
                                      if (err) {
                                        return;
                                      }
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
                                    })
                                  }}
                              />
                            }
                          </Menu>
                        </Popover> 
                      </li>
                    )
                  })}
                  {book.comments.length === 0 && <li>
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
                  <small><Icon iconSize={11} icon='comment' /> {book.comments.length}</small>
                </div>
                <div className='keen_comments_Input'>
                  <ControlGroup fill={true} vertical={false} >
                    <InputGroup
                      placeholder={`Add your comment...`}
                      inputRef={input => commentInput = input}
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
      </div>
      
    </div>
  )
}

const mapStateToProps = (state: IStore) => ({
  book: state.book.selectedBook,
  user: state.user.user
})

const mapDispatch = dispatch => ({
  linkTo: payload => dispatch(redirect(payload))
})

export default connect(mapStateToProps, mapDispatch)(SingleBook);
