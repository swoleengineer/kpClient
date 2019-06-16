import React, { useState } from 'react';
import { IExpandedQuestion, IExpandedBook, IUser, IStore, ITopic, IComment, IReportRequest, acceptableTypes } from '../../../../state-management/models';
import { redirect } from 'redux-first-router';
import { connect } from 'react-redux';
import { IAlertProps, ControlGroup, InputGroup, ButtonGroup, Alert, Breadcrumbs, Icon, Collapse, Tag, Button, MenuItem, Spinner } from '@blueprintjs/core';
import { createComment, createReport, removeComment, 
  addTopicsToBook, toggleTopicAgreeBook } from '../../../../state-management/thunks';
import { keenToaster } from '../../../../containers/switcher';
import Link from 'redux-first-router-link';
import TopicBrowse from '../../auth/topic/topicBrowse';
import moment from 'moment';
import './questions.css';
import { filterBook } from '../../../../state-management/utils/book.util';
import { Select, ItemRenderer } from '@blueprintjs/select';
const BookSelect = Select.ofType<IExpandedBook>();

// const sampleBookComments = [{
//   _id: '89fgbr10ovg',
//   author: {
//     username: 'juriste'
//   },
//   created: new Date(),
//   suggested_Book: {},
//   accepted: false,
//   votes: [1, 2, 3, 4]
// }]

const SingleQuestionPage = (props: {
  question: IExpandedQuestion;
  user: IUser;
  linkTo: Function;
  books: IExpandedBook[]
}) => {
  const { question, user, books } = props;
  if (!question || !question.title) {
    return <Spinner />;
  }
  const [topicsToAdd, adjustTopics] = useState<ITopic[]>([]);
  const [newComment, updateComment] = useState<{
    author: any;
    text: string;
    suggested_book: any
  }>({
    author: {
      _id: user ? user._id : '',
      username: user ? user.username : 'tempUser'
    },
    text: '',
    suggested_book: undefined
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
  });
  const [commentOpen, setCommentState] = useState(false);
  const [bookToAdd, setAddingBook] = useState({});
  const pathToHere = [
    { type: 'HOME', href: '/', icon: 'home', text: 'Home' },
    { type: 'ALLQUESTIONS', href: '/questions', icon: 'th', text: 'All questions' },
    { type: 'SINGLEQUESTION', payload: { id: question._id }, href: `/question/${question._id}`, text: `${question.title}${question.title && !question.title.includes('?') ? '?' : ''}`}
  ];

  const submitNewComment = () => {
    const { text, suggested_book } = newComment;
    if (!text || !text.length || !suggested_book) {
      return;
    }
    createComment(
      {
        author: user._id,
        text,
        suggested_book: suggested_book._id,
        parentId: question._id,
        parentType: acceptableTypes.question,
        created: new Date()
      },
      false,
      {
        type: 'SINGLEQUESTION',
        payload: {
        id: question._id
        }
      })
    .then(() => {
      setCommentState(false);
      setAddingBook({});
      updateComment({ ...newComment, text: '' })
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
    reportComment: () => itemToReport.parentId && itemToReport.author ? submitNewReport() : null
  }
  const renderBook: ItemRenderer<IExpandedBook> = (book, { handleClick, modifiers, query }) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }
    return (
      <MenuItem
            active={modifiers.active}
            disabled={modifiers.disabled}
            key={book._id}
            icon='book'
            text={<div><strong>{book.title}</strong><br /><small>{book.author.name}</small></div>}
            onClick={() => {
              setAddingBook(book);
              setCommentState(true);
            }}
      />
    )
  }
  const addBookProps = {
    itemPredicate: filterBook,
    itemRenderer: renderBook,
    items: books,
    filterable: true,
    hasInitialContent: false,
    resetOnClose: true,
    resetOnQuery: true,
    resetOnSelect: true
  }
  return (
    <div className='singleQuestionPage singleBookPage'>
      <Alert
        {...alertProps}
        onConfirm={() => alertFunctions[alertConfig.type]()}
        onCancel={() => updateAlertProps({ isOpen: false})}
      >
        {alertConfig.text}
      </Alert>
      <Breadcrumbs
        items={pathToHere}
        breadcrumbRenderer={crumb => <Link to={{ type: crumb.type, payload: crumb.payload }} className='singleBook_bcrumb'><Icon icon={crumb.icon} iconSize={12} /> {crumb.text}</Link>}
      />
      <header>
        <h2><strong>{question.title}{question.title.includes('?') ? '' : '?'}</strong></h2>
        <p className='lead'>{question.text}</p>
      </header>
      <div className='row'>
        <div className='col-md-4'>
          <div className='singleQuestion_meta'>
            <h6>
              <small>{moment(question.created).format('dddd')},</small>
              <span style={{ display: 'block'}}>{moment(question.created).format('MMM Do YYYY')}</span>
              <small style={{ display: 'block', fontSize: '11px', fontWeight: 200, opacity: .7 }}>{moment(question.created).fromNow()}</small>
            </h6>
            <span style={{ display: 'block', backgroundColor: 'rgba(138, 155, 168, 0.2)', padding: '5px', margin: '-15px  0 0 0'}}>by: @{question.author.username}</span>
          </div>
          <br />
          <ul className='underBookMenu'>
            <MenuItem
              icon='flag'
              text='Report Question' 
              onClick={() => {
                updateReportingItem({
                  parentId: question._id,
                  parentType: acceptableTypes.question,
                  author: user ? user._id : '',
                  reportType: 'inappropriate'
                })
                updateAlertConfig({
                  type: 'reportComment',
                  text: `Are you sure you want to report this question as Inappropriate?`
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
          </ul>
        </div>
        <div className='col-md-8 singleBook_top_topics_wrapper'>
          <h5>Topics ({question.topics.length})</h5>
          <p>Thumbs up only if you agree a topic is covered in this book.</p>
          <div className='singleBookAddTopics'>
            <Collapse isOpen={topicsToAdd.length > 0}>
              <div className='row incomingTopics'>
                <div className='col-md-8'>{topicsToAdd.map((topic, i) =>
                  <Tag
                    key={i}
                    interactive={true}
                    icon='lightbulb'
                    onClick={() => adjustTopics(topicsToAdd.filter(skill => skill._id !== topic._id))}
                    style={{
                      margin: '0 10px 10px 0'
                    }}
                  >
                    {topic.name}
                  </Tag>)}</div>
                <div className='col-md-4'>
                  <Button
                    minimal={true}
                    icon='plus'
                    fill={true}
                    onClick={() => {
                      addTopicsToBook(book._id, topicsToAdd)
                        .then(() => adjustTopics([]))
                        .catch(() => adjustTopics([]))
                    }}
                  >
                    Add {topicsToAdd.length} topic{topicsToAdd.length > 1 && 's'}
                  </Button>
                </div>
              </div>
            </Collapse>
            <TopicBrowse
              processNewItem={(topic, event) => {
                if (book.topics.map(tpc => tpc.topic._id).includes(topic._id)) {
                  keenToaster.show({
                    message: `${topic.name} already in this book.`,
                    intent: 'warning',
                    icon: 'error'
                  })
                  return;
                }
                adjustTopics(topicsToAdd.filter(skill => skill._id !== topic._id).concat(topic))}
              }
              processRemove={() => console.log('removed topic')}
            />
          </div>
          {(question.topics && question.topics.length > 0) && <div>{question.topics.map((topic, i) => {
            return (
              <Tag
                icon='lightbulb'
                rightIcon={<span>| <Icon icon='thumbs-up' /> {topic.agreed.length}</span>}
                interactive={true}
                large={true}
                key={i}
                style={{
                  marginRight: '10px',
                  marginBottom: '10px'
                }}
                minimal={!(user && (typeof topic.agreed[0] === 'object' ? topic.agreed.map(person => person._id).includes(user._id) : topic.agreed.includes(user._id)))}
                onClick={() => user
                  ? toggleTopicAgreeBook(book._id, topic._id)
                      .then(
                        () => console.log('request successful. Toggled agree status'),
                        () => console.log('request failed toggling topic agree status')
                      )
                  : null}
              >
                {topic.topic.name}
              </Tag>
            )
          })}
          </div>}
          <div className='row questionEngagement'>
            <div className='col-1'>
              <Button icon='book' minimal={true}>{question.comments.length}</Button>
            </div>
            <div className='col-11 text-right'>
              <ButtonGroup>
                <BookSelect
                  {...addBookProps}
                  noResults={<MenuItem disabled={true} text='No books.' />}
                  onItemSelect={(item: IExpandedBook) => {
                    
                    updateComment({
                      ...newComment,
                      suggested_book: item
                    });
                    setAddingBook(item);
                    console.log('added book to local state', bookToAdd.title)
                    setCommentState(true);
                  }}
                >
                  <Button
                    icon='book'
                    minimal={true}
                    rightIcon={newComment.suggested_book ? null : 'chevron-down'}
                  >
                    {newComment.suggested_book ? newComment.suggested_book.title : 'Suggest Book'}
                  </Button>
                </BookSelect>
                {commentOpen && <Button
                  icon='cross'
                  minimal={true}
                  onClick={() => {
                    setCommentState(false);
                    setAddingBook({});
                  }}
                />}
              </ButtonGroup> 
            </div>
          </div>
          <Collapse isOpen={commentOpen} className='questionCard_comment'>
            <div className='singleQuestion_addComment'>
              <ControlGroup fill={true} vertical={false}>
                <InputGroup
                  placeholder='Add optional comment'
                  leftIcon='comment'
                  onKeyUp={$event => {
                    if ($event.keyCode === 13) {
                      submitNewComment();
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    updateComment({
                      ...newComment,
                      text: value
                    })
                  }}
                  rightElement={<Button minimal={true} icon='tick' onClick={() => submitNewComment()}/>}
                />
              </ControlGroup>
            </div>
          </Collapse>
          <div className='singleQuestion_commentHolder'>
            {question.comments.length > 0
              ? <div>{question.comments.map((comment, i) => <div key={i}>{comment.created}</div>)}</div>
              : <div>No commets here </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state: IStore) => ({
  question: state.question.selectedQuestion,
  user: state.user.user,
  books: state.book.books
})

const mapDispatch = dispatch => ({
  linkTo: payload => dispatch(redirect(payload))
})
export default connect(mapStateToProps, mapDispatch)(SingleQuestionPage);
