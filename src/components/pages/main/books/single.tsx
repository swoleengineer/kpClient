import React, { useState } from 'react';
import { connect } from 'react-redux';
import { IStore, IExpandedBook, IUser, ITopic, IComment, acceptableTypes, IReportRequest, AuthModalTypes } from '../../../../state-management/models';
import { Card, Breadcrumbs, Tag, Collapse, ButtonGroup, Button, Popover, Menu, MenuItem, ControlGroup, InputGroup, Alert, IAlertProps, MenuDivider, NonIdealState } from '@blueprintjs/core'
import moment from 'moment';
import './books.css';
import Book from '../../../book';
import Link from 'redux-first-router-link';
import { redirect } from 'redux-first-router'
import TopicBrowse from '../../auth/topic/topicBrowse';
import { showAuthModal, toggleUserBook, addTopicsToBook, createComment, removeComment, createReport, toggleTopicAgreeBook, engagePrecheck, editBookDetails } from '../../../../state-management/thunks'
import { keenToaster } from '../../../../containers/switcher';
import { getAuthorName } from '../../../../state-management/utils/book.util';
import Topic from '../../../topic';
import EditBook from './editBook';
import Icon, { IconTypeEnum, AddBookIcon } from '../../../icons';
import ThreadSystem from '../../../thread/threadSystem';
import Thread from '../../../thread';



import SearchBooks from '../../../thread/bookSearchPopover';
import ThreadInput from '../../../thread/threadInput';

const SingleBook = (props: {
  book: IExpandedBook;
  user: IUser;
  linkTo: Function
}) => {
  const { book, user, linkTo } = props;
  if (!book || !Object.keys(book).length) {
    return null;
  }
  document.title = `${book.title} - keenpages.com`;
  const [addTopicOpen, setTopicForm] = useState<boolean>(false);
  const [showEdit, setEditForm] = useState<boolean>(false)
  const [topicsToAdd, adjustTopics] = useState<ITopic[]>([]);
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
  const [newCommentFormActive, setNewCommentForm] = useState<boolean>(false);
  
  const [activeTab, setActiveTab] = useState<'discussion' | 'details' | 'excerpts'>('discussion');
  const pathToHere = [
    { type: 'HOME', href: '/', icon: 'fa-home', text: 'Home' },
    { type: 'ALLBOOKS', href: '/books', icon: 'fa-th-list', text: 'All books' },
    { type: 'SINGLEBOOK', payload: { id: book._id }, href: `/book/${book._id}`, icon: 'fa-book', text: book.title}
  ]
  const userBook = user && user.readBooks.map(livre => livre._id).includes(book._id)
    ? 'readBooks'
    : user && user.savedBooks.map(livre => livre._id).includes(book._id)
      ? 'savedBooks'
      : undefined
  const submitNewComment = (payload, cb = (x: any) => null) => {
    if (!payload.text || !payload.text.length) {
      return;
    }
    engagePrecheck(book, true, error => {
      if (error) {
        return;
      }
      createComment(
        {
          ...payload,
          author: user._id,
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
        setNewCommentForm(false);
        cb(null)
      })
      .catch((e) => {
        console.log(e);
        cb(e);
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
  const deleteCommentClicked = comment => {
    updateDeletingComment(comment);
    updateAlertConfig({
      type: 'deleteComment',
      text: 'Are you sure you want to delete this comment?'
    });
    updateAlertProps({
      cancelButtonText: 'Nevermind',
      confirmButtonText: 'Delete it',
      icon: 'trash',
      isOpen: true,
      intent: 'danger',
    });
  }
  const reportCommentClicked = comment => engagePrecheck(book, true, err => {
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
      
      <div className='singleBook_page_Wrapper'>
        
        <div className='row '>
          <div className='col-md-4 singleBook_page_book_container'>
            <Book liv={book} />
            <ul className='underBookMenu'>
              <MenuItem
                icon={<span className='bp3-icon'><Icon icon='fa-books' /></span>}
                text='Add to shelf'
              />
              <MenuDivider />
              <MenuItem
                icon={<span className='bp3-icon'>
                  <Icon icon={user && user.readBooks.map(livre => livre._id).includes(book._id) ? 'fa-align-slash' : 'fa-bookmark'} />
                </span>}
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
                <MenuItem icon='shopping-cart' text='Purchase' labelElement={<Icon icon='fa-share' />} onClick={() => window.open(book.affiliate_link || book.amazon_link, '_blank')}/>
              </>}
              {user && user.role === 'admin' && <>
                <Menu.Divider />
                <MenuItem icon='edit' text='Add Purchase Url' onClick={() => setEditForm(true)} />
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
              <h4>
                <strong>{book.title}</strong>
                {book.subtitle && <small>{book.subtitle}</small>}
              </h4>
              {getAuthorName(book) && <p className='description'>By {getAuthorName(book)}</p>}
              {userBook && <Tag round={true} icon={userBook === 'readBooks' ? 'bookmark' : 'book'} intent='danger'>
                {`${userBook === 'readBooks' ? 'You have read this book' : 'In your saved library'}`}
              </Tag>}
            </header>
            {(showEdit && user && user.role === 'admin') && <EditBook
              saveEdit={(bookId: string, details: { [key: string]: any}) => editBookDetails(bookId, details)}
              cancelEdit={() => setEditForm(false)}
              book={book}
            />}
            <div className='single_top_actions_wrapper'>
              <ul className='single_top_actions'>
                <li 
                  className='single_top_action'
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
                    icon='fa-heart'
                    reverse={true}
                    style={user && book.likes.includes(user._id) ? { color: '#db3737'} : {}}
                    type={user && book.likes.includes(user._id) ? IconTypeEnum.solid : IconTypeEnum.light}
                    intent={user && book.likes.includes(user._id) ? 'danger' : 'none'}
                  />
                  {book.likes.length}
                  <span className='hidden-sm'>Like{book.likes.length !== 1 ? 's' : ''}</span>
                </li>
                <li
                  className='single_top_action'
                  onClick={() => commentInput.focus()}
                >
                  <Icon icon='fa-comments' />
                  {book.comments.length}
                  <span className='hidden-sm'>Comment{book.comments.length !== 1 ? 's' : ''}</span>
                </li>
                <li
                  className='single_top_action'
                >
                  <Icon icon='fa-graduation-cap' />
                  {book.topics.length}
                  <span className='hidden-sm'>Topic{book.topics.length !== 1 ? 's' : ''}</span>
                </li>
              </ul>
            </div>
            <div className='single_topics_wrapper'>
              <div className='single_topics_header noselect'>
                <h6 >{book.topics.length} Topic{book.topics.length !== 1 ? 's' : ''}</h6>
                <p>Click on a topic to [agree]. Add more topics by clicking the link below. </p>
              </div>
              <div className='single_topics_container'>
                {((book.topics && book.topics.length > 0) || topicsToAdd.length > 0) && <div className='singlePageTopicsWrapper'>
                  {book.topics.map((topic, i) => {
                    return (!topic || !topic.topic || !topic.topic.name) ? null : (
                      <Topic
                        topicBody={topic}
                        key={topic._id}
                        interactive={true}
                        topicSize='smallTopic'
                        minimal={false}
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
                    )
                  })}
                  {topicsToAdd.map((topic, i) => {
                    return (!topic || !topic.name) ? null : (
                      <Topic
                        key={i}
                        interactive={true}
                        onClick={() => {
                          adjustTopics(topicsToAdd.filter(skill => skill._id !== topic._id));
                          if (topicsToAdd.length < 2) {
                            setTopicForm(false);
                          }
                        }}
                        skill={topic}
                        topicSize='smallTopic'
                        minimal={true}
                        removable={true}
                      />
                    )
                  })}
                </div>}
              </div>
              {topicsToAdd.length > 0 && (
                <div className='single_topics_add_btn'>
                  <Button
                    minimal={true}
                    text={`Save ${topicsToAdd.length} topic${topicsToAdd.length !== 1 ? 's' : ''}`}
                    small={true}
                    icon={<span className='bp3-icon'><Icon icon='fa-plus-circle' type={IconTypeEnum.light} /></span>}
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
                  />
                </div>
              )}
              <div className='single_topics_add_container'>
                {!addTopicOpen && <Button
                  icon={<span className='bp3-icon'><Icon icon='fa-plus-circle' type={IconTypeEnum.light} /></span>}
                  text='Add topic(s)'
                  minimal={true}
                  small={true}
                  className='single_topics_add_btn'
                  onClick={() => setTopicForm(true)}
                />}
                {addTopicOpen && <TopicBrowse
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
                  />}
              </div>
            </div>
            <div className='single_bottom_nav_wrapper'>
              <ul className='sigle_bottom_nav'>
                <li 
                  className={`single_bottom_nav_item noselect ${activeTab === 'discussion' ? 'selectedItem' : ''}`}
                  onClick={() => setActiveTab('discussion')}
                >
                  <Icon icon='fa-comments' /> Discussion
                </li>
                <li 
                  className={`single_bottom_nav_item noselect ${activeTab === 'details' ? 'selectedItem' : ''}`}
                  onClick={() => setActiveTab('details')}
                >
                  <Icon icon='fa-receipt' /> Details
                </li>
                <li 
                  className={`single_bottom_nav_item noselect ${activeTab === 'excerpts' ? 'selectedItem' : ''}`}
                  onClick={() => setActiveTab('excerpts')}
                >
                  <Icon icon='fa-quote-left' /> Excerpts
                </li>
                <li
                  className='noselect'
                  style={{ margin: '0 0 0 auto'}}
                >
                  <Icon icon='fa-expand-alt' />
                </li>
              </ul>
            </div>
            <div className='single_bottom_content_wrapper'>
              {activeTab === 'details' && (
                <div className='single_bottom_content_container single_container_details'>
                  <Card>
                    {book.description && <>
                      <h6>Description</h6>
                      <p>{book.description}</p>
                    </>}
                  </Card>
                  {(book.isbn10 || book.isbn13 || book.publisher || book.publish_date) && (
                    <p className='single_container_details_meta'>
                      {book.publisher && <span className='metaListItem'><strong>Publisher:</strong> {book.publisher}</span>}
                      {book.publish_date && <span className='metaListItem'><strong>Published:</strong> {book.publish_date}</span>}
                      {book.isbn10 && <span className='metaListItem'><strong>ISBN 10:</strong> {book.isbn10}</span>}
                      {book.isbn13 && <span className='metaListItem'><strong>ISBN 13:</strong> {book.isbn13}</span>}
                    </p>
                  )}
                </div>
              )}
              {activeTab === 'discussion' && (
                <div className='single_bottom_content_container single_container_discussion'>
                  <ThreadSystem
                    inputRef={input => commentInput = input}
                    newCommentFormActive={newCommentFormActive}
                    setNewCommentForm={setNewCommentForm}
                    user={user}
                    submitComment={submitNewComment}
                    threads={book.comments}
                    linkTo={linkTo}
                    deleteCommentClicked={deleteCommentClicked}
                    reportCommentClicked={reportCommentClicked}
                  />
                </div>
              )}
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
