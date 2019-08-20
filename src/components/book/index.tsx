import React, { useState } from 'react';

import { redirect } from 'redux-first-router';
import { Tooltip, Menu, MenuItem, Popover, IAlertProps, Alert, Spinner } from '@blueprintjs/core';
import { IExpandedBook, ITopicBodyObj, IUser, IStore, IReportRequest, acceptableTypes } from '../../state-management/models';
import Slider from 'react-slick';
import KPBOOK from '../../assets/kp_book.png';
import { toggleUserBook, createReport, engagePrecheck, addBookFromInt } from '../../state-management/thunks';
import { connect } from 'react-redux';
import { keenToaster } from '../../containers/switcher'
import { getAuthorName } from '../../state-management/utils/book.util';
import Topic from '../topic';
import './book.css';
import Icon, { IconTypeEnum } from '../icons';

const Book = ({
  bookId, 
  books,
  user,
  linkTo,
  liv = undefined,
  style
}: {
  bookId: string;
  liv?: any;
  books: IExpandedBook[];
  user: IUser;
  linkTo: Function;
  style: any;
}) => {
  const book = liv;
  if (!book) {
    return null;
  }  
  const { title, pictures, topics = [] } = book;
  const isRead = user && user.readBooks.findIndex(livre => livre.gId === book.gId) > -1;
  const [ picture = { link: undefined}] = pictures || [];
  
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
  const [isLoading, setLoading] = useState<boolean>(false)
  const goToBook = () => {
    setLoading(true);
    if (book.active) {
      setLoading(false);
      return linkTo({ type: 'SINGLEBOOK', payload: { id: book._id }});
    }
    addBookFromInt(book).then(
      (newBook) => {
        setLoading(false);
        if (!newBook || !newBook.active || !newBook._id) {
          keenToaster.show({
            intent: 'danger',
            message: 'Server error loading this book',
            icon: 'error'
          });
          return;
        }
        return linkTo({ type: 'SINGLEBOOK', payload: { id: newBook._id }});
      },
      (err: any) => {
        setLoading(false);
        console.log(err);
        keenToaster.show({
          intent: 'danger',
          message: 'Server error loading this book',
          icon: 'error'
        });
      }
    )
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
    reportBook: () => itemToReport.parentId && itemToReport.author ? submitNewReport() : null
  }
  return (
    <div className='singleBookWrapper'>
      <div className='bookPicture' style={{backgroundImage: `url(${picture.link || KPBOOK})`}}>
        <Alert
          {...alertProps}
          onConfirm={() => alertFunctions[alertConfig.type]()}
          onCancel={() => updateAlertProps({ isOpen: false})}
          cancelButtonText='Nevermind'
        >
          {alertConfig.text}
        </Alert>
        <span
          className={isLoading ? 'bookLink loadingBook' : 'bookLink'}
          onClick={() => goToBook()}
        >
          {isLoading && <Spinner size={35} />}
        </span>
        {isRead
          ? <span className='bookMark' style={{ position: 'absolute', top: '0'}}><Icon icon='fa-bookmark' iconSize={40} intent='danger'/></span>
          : <Tooltip content='Mark as read' className='unreadBookMark'>
              <span
                className='unreadBookMark'
                onClick={() => {
                  engagePrecheck(book, true, (err, newBook) => {
                    if (err) {
                      return;
                    }
                    return book.active
                      ? toggleUserBook(book._id, 'readBooks', isRead ? 'remove' : 'add')
                      : newBook
                        ? toggleUserBook(newBook._id, 'readBooks', 'add')
                        : goToBook();
                  }) 
                }}
              >
                <Icon icon='fa-bookmark' iconSize={40} />
              </span>
            </Tooltip>
        }
        <div className='topicsMeta'>
            {topics.length > 0 
              ? <Slider
                  dots={false}
                  infinite={true}
                  speed={500}
                  slidesToShow={topics.length > 1 ? 2 : 1}
                  slidesToScroll={1}
                  arrows={false}
                  variableWidth={true}
                  autoplay={true}
                  autoplaySpeed={1500}
                  lazyLoad='progressive'
              >
                  {topics.map((topic_: ITopicBodyObj, i) => <Topic
                        minimal={false}
                        key={topic_._id}
                        topicBody={topic_}
                        topicSize='smallTopic'
                        hideNumber={true}
                        className='margin-right-15 auto-width'
                  />)}

              </Slider>
              : 'No topics'
            }
            

        </div>
        <div className='bookMenu'>
          <div
            className='bookMenu_item'
            onClick={() => {
              engagePrecheck(book, true, (err, newBook) => {
                if (err) {
                  return;
                }
                return book.active
                  ? toggleUserBook(book._id, 'savedBooks', book.likes.includes(user ? user._id : '') ? 'remove' : 'add')
                  : newBook
                    ? toggleUserBook(newBook._id, 'savedBooks', 'add')
                    : goToBook();
              })
            }}
            style={{ backgroundColor: book.likes && book.likes.includes(user ? user._id : '') ? 'rgba(0,0,0,.5)' : 'transparent' }}
          >
            <Tooltip content={book.likes && book.likes.includes(user ? user._id : '') ? 'Unlike Book' : 'Save Book'}>
              <span >
                <Icon
                  type={IconTypeEnum.solid}
                  icon='fa-heart'
                  iconSize={12}
                  intent={book.likes && book.likes.includes(user ? user._id : '') ? 'danger' : 'none'}
                />
              </span>
            </Tooltip>
          </div>
          <div className='bookMenu_item' onClick={() => goToBook()}>
            <Tooltip content='View book'>
              <span><Icon icon='fa-share' iconSize={12} /></span>
            </Tooltip>
          </div>
          <div className='bookMenu_item'>
            <Popover>
              <Tooltip content='More...'>
                <span><Icon icon='fa-ellipsis-h' iconSize={12} /></span>
              </Tooltip>
              <Menu>
                <MenuItem
                  icon={isRead ? 'remove-column' : 'bookmark'}
                  text={`Mark ${isRead ? 'unread' : 'as read'}`}
                  onClick={() => {
                    engagePrecheck(book, true, (err, newBook) => {
                      if (err) {
                        return;
                      }
                      return book.active
                        ? toggleUserBook(book._id, 'readBooks', isRead ? 'remove' : 'add')
                        : newBook
                          ? toggleUserBook(newBook._id, 'savedBooks', 'add')
                          : goToBook();
                    })
                  }}
                />
                {(book.affiliate_link || book.amazon_link) && <>
                  <Menu.Divider />
                  <MenuItem icon='shopping-cart' text='Purchase' labelElement={<Icon icon='fa-share' />} onClick={() => window.open(book.affiliate_link || book.amazon_link, '_blank')}/>
                </>}
                <Menu.Divider />
                <MenuItem
                  icon='flag'
                  text='Report Book' 
                  onClick={() => {
                    engagePrecheck(book, true, (err, newBook) => {
                      if (err) {
                        return;
                      }
                      if (!book.active) {
                        return goToBook();
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
                        confirmButtonText: 'Report it',
                        icon: 'flag',
                        isOpen: true,
                        intent: 'danger',
                      });
                    })
                  }}
                />
              </Menu>
            </Popover>
            
          </div>
        </div>
      </div>
      <span className='bookTitle'>{title}</span>
      <span className='bookAuthor'>{getAuthorName(book)}</span>
    </div>
  );
}

const mapStateToProps = (state: IStore) => ({
  user: state.user.user,
  books: state.book.books
})

const mapDispatch = dispatch => ({
  linkTo: payload => dispatch(redirect(payload))
})
export default connect(mapStateToProps, mapDispatch)(Book);
