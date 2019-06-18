import React, { useState } from 'react';
import { IExpandedQuestion, IExpandedBook, IUser, IStore, ITopic, IComment, IReportRequest, acceptableTypes } from '../../../../state-management/models';
import { redirect } from 'redux-first-router';
import { connect } from 'react-redux';
import { IAlertProps, ControlGroup, InputGroup, ButtonGroup, Alert, Breadcrumbs, Icon, Collapse, Tag, Button, MenuItem, Spinner, Tooltip, Card } from '@blueprintjs/core';
import { createComment, createReport, removeComment, 
  addTopicsToBook, toggleTopicAgreeBook, searchBooks } from '../../../../state-management/thunks';
import { keenToaster } from '../../../../containers/switcher';
import Link from 'redux-first-router-link';
import TopicBrowse from '../../auth/topic/topicBrowse';
import moment from 'moment';
import './questions.css';
import { bookFilter, getAuthorName } from '../../../../state-management/utils/book.util'


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
  const [bookfilterText, updateFilter] = useState('');
  const [loadingComment, updateLoading] = useState(false);
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
        suggested_book,
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
          <p>Thumbs up only if you agree a topic is covered by this request.</p>
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
                <Button
                  minimal={true}
                  rightIcon={commentOpen ? 'cross' : 'chevron-down'}
                  onClick={() => {
                    setCommentState(!commentOpen);
                    setAddingBook({});
                    updateComment({
                      ...newComment,
                      text: '',
                      suggested_book: undefined
                    })
                  }}
                  intent={commentOpen ? 'danger' : 'none'}
                >
                  {commentOpen ? 'Cancel' :  'Suggest Book'}
                </Button>
                {/* <BookSearch
                  itemSelected={item => {
                    updateComment({
                      ...newComment,
                      suggested_book: item
                    });
                    setAddingBook(item);
                    console.log('added book to local state', bookToAdd.title)
                    setCommentState(true);
                  }}
                  placeholder='Suggest Book'
                /> */}
                {/* <BookSelect
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
                  
                </BookSelect> */}
                {/* {commentOpen && <Button
                  icon='cross'
                  minimal={true}
                  intent='danger'
                  onClick={() => {
                    setCommentState(false);
                    setAddingBook({});
                  }}
                />} */}
              </ButtonGroup> 
            </div>
          </div>
          <Collapse isOpen={bookToAdd['title'] && bookToAdd['title'].length}>
            <div className='singleQuestion_finishComment'>
              <Card elevation={3}>
                <div className='row'>
                  <div className='col-md-12'>
                    <strong><Icon icon='book' /> {bookToAdd.title}</strong>
                    <span className='sq_booksubtitle'>{bookToAdd.subtitle}</span>
                    <small>{getAuthorName(bookToAdd)}</small>
                    <br />
                    <ControlGroup fill={true}>
                      <InputGroup
                        leftIcon='comment'
                        large={true}
                        placeholder='Enter Comment...'
                        onChange={e => {
                          const value = e.target.value;
                          updateComment({
                            ...newComment,
                            text: value
                          });
                        }}
                        onKeyUp={$event => {
                          if ($event.keyCode === 13) {
                            submitNewComment();
                          }
                        }}
                        rightElement={
                          <Button
                            text='Submit'
                            minimal={true}
                            onClick={() => submitNewComment()}
                          />
                        }
                      />
                    </ControlGroup>
                  </div> 
                </div>
              </Card>
            </div>
          </Collapse>
          <Collapse isOpen={commentOpen && !bookToAdd['title']} className='questionCard_comment' transitionDuration={100}>
            <div className='singleQuestion_addComment'>
              <div className='row'>
                <div className='col-12' style={{ height: '42px'}}>
                  <ControlGroup fill={true} vertical={false}>
                    <InputGroup
                      large={true}
                      placeholder='Search Books...'
                      leftIcon='book'
                      onKeyUp={$event => {
                        if ($event.keyCode === 13) {
                          updateLoading(true)
                          searchBooks(bookfilterText).then(
                            () => updateLoading(false)
                          ).catch(() => console.log('error from req.'))
                        }
                      }}
                      onChange={(e) => {
                        const value = e.target.value;
                        updateFilter(value);
                        // if (value.length > 3) {
                        //   searchBooks(value);
                        // }
                        // updateComment({
                        //   ...newComment,
                        //   text: value
                        // })
                      }}
                      rightElement={
                        <Button
                          icon='search'
                          minimal={true}
                          onClick={() => {
                            searchBooks(bookfilterText).then(
                              () => updateLoading(false)
                            ).catch(() => console.log('error from req.'))
                          }}
                        />
                      }
                    />
                  </ControlGroup>
                </div>
              </div>
              <div className='row'>
                <div className='col-12'>
                  {loadingComment && <div style={{ marginTop: '15px'}}><Spinner size={25} /></div>}
                  {!loadingComment && 
                  <ul className='bookSearchResults'>
                      {books.filter(bookFilter(bookfilterText)).map((book, i) => {
                        return (
                          <MenuItem
                            key={book._id}
                            icon='book'
                            text={<Tooltip content={book.title}>
                              <div><strong>{book.title}</strong><br /><small>{getAuthorName(book)}</small></div>
                            </Tooltip>}
                            onClick={() => {
                              // itemSelected(book);
                              // updateSelected(book); 
                              updateComment({
                                ...newComment,
                                suggested_book: book
                              });
                              setAddingBook(book);
                            }}
                          />
                        
                        )
                      })}
                      </ul>}
                </div>
              </div>
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
