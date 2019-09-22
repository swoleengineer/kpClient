import React, { useState } from 'react';
import { IBook, IUser, IExpandedBook, AuthModalTypes } from '../../state-management/models';
import { getAuthorName } from '../../state-management/utils';
import { showAuthModal, addBookFromInt, engagePrecheck, toggleUserBook } from '../../state-management/thunks';
import './bookCard.css';
import KPBOOK from '../../assets/kp_book.png';
import { keenToaster } from '../../containers/switcher';
import { Popover, Menu, MenuItem, Button } from '@blueprintjs/core';
import Icon, { IconTypeEnum } from '../icons';
import Topic from '../topic';

interface IProps {
  book: IExpandedBook;
  user: IUser;
  linkTo: Function;
}

const bookCard = (props: IProps) => {
  if (!props.book) {
    return null;
  }
  const { book, user, linkTo } = props;
  const { title, pictures, topics = [], likes = [] } = book;
  const [ picture = { link: undefined}] = pictures || [];
  const [loading, setLoading] = useState<boolean>(false);

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
            message: 'Server error loading this book',
            icon: <span className='bp3-icon'><Icon icon='fa-exclamation' /></span>
          });
          return;
        }
        return linkTo({ type: 'SINGLEBOOK', payload: { id: newBook._id }});
      },
      (err: any) => {
        setLoading(false);
        keenToaster.show({
          message: 'Server error loading this book',
          icon: <span className='bp3-icon'><Icon icon='fa-exclamation' /></span>
        });
      }
    )
  }
  return (
    <div className='book_card_wrapper'>
      <div className='book_card_container'>
        <div className='book_card_picture_wrapper'>
          <div className='book_card_picture_container'>
            <div
              className='book_card_picture'
              style={{backgroundImage: `url(${picture.link || KPBOOK})`}}
              onClick={() => goToBook()}
            >
              {loading && (
                <div className='book_card_spinner_wrapper'>
                <Icon icon='fa-spinner-third fa-spin' />
              </div>
              )}
            </div>
          </div>
        </div>
        <div className='book_card_content_wrapper'>
          <span className='book_card_more_btn_wrapper'>
            <Popover>
              <span className='book_card_more_btn'>
                <Icon icon='fa-ellipsis-h' type={IconTypeEnum.regular} />
              </span>
              <Menu>
                <MenuItem text='Something here' />
              </Menu>
            </Popover>
          </span>
          <div className='book_card_content_container'>
            <div className='book_card_title'>
              <span>{title}</span>
            </div>
            {book.subtitle && (
              <div className='book_card_subtitle hidden-sm'>
                <span>{book.subtitle}</span>
              </div>
            )}
            {getAuthorName(book) && (
              <div className='book_card_author'>
                <span>{getAuthorName(book)}</span>
              </div>
            )}
          </div>
          {topics.length > 0 && (
            <div className='book_card_topic_wrapper'>
              <div className='book_card_topic_container'>
                <div className='book_card_topics'>
                  {topics.map((theTopic, i) => {
                    return (
                      <Topic
                        key={theTopic._id}
                        topicBody={theTopic}
                        interactive={false}
                        onClick={() => null}
                        topicSize='smallTopic'
                        hideNumber={true}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          {topics.length < 1 && (
            <div className='book_card_topic_empty_wrapper'>
              <div className='book_card_topic_container'>
                <span>No topics</span>
                <Icon icon='fa-empty-set' push={true} />
              </div>
            </div>
          )}
          <div className='book_card_engage_summary_wrapper'>
            <div className='book_card_engage_summary_container'>
              <div
                className='book_card_engage_summary'
                onClick={() => {
                  engagePrecheck(book, true, (err, newBook) => {
                    if (err) {
                      return;
                    }
                    return book.active
                      ? toggleUserBook(book._id, 'savedBooks', book.likes.includes(user ? user._id : '') ? 'remove' : 'add')
                      : newBook
                        ? toggleUserBook(newBook._id, 'savedBooks', 'add').then(
                          () => goToBook()
                        )
                        : goToBook();
                  })
                }}
              >
                <Icon
                  icon='fa-heart'
                  style={user && likes.includes(user._id) ? { color: '#db3737'} : {}}
                  type={user && likes.includes(user._id) ? IconTypeEnum.solid : IconTypeEnum.light}
                  intent={user && likes.includes(user._id) ? 'danger' : 'none'}
                />
                <strong>{likes.length}</strong>
                <span className='hidden-sm'>Like{likes.length !== 1 ? 's' : ''}</span>
              </div>
              <div className='book_card_engage_summary'>
                <Icon icon='fa-comments' />
                <strong>{book.comments.length}</strong>
                <span className='hidden-sm'>Discussion{book.comments.length !== 1 ? 's' : ''}</span>
              </div>
              <div className='book_card_engage_summary'>
                <Icon icon='fa-graduation-cap' />
                <strong>{topics.length}</strong>
                <span className='hidden-sm'>Topic{topics.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='book_card_actions_wrapper'>
        <ul className='book_card_actions_container'>
          <li
            onClick={() => {
              setLoading(true);
              engagePrecheck(book, true, (err, newBook) => {
                setLoading(false);
                if (err) {
                  return;
                }
                return book.active
                  ? showAuthModal(AuthModalTypes.bookToShelf, book)
                  : newBook
                    ? showAuthModal(AuthModalTypes.bookToShelf, newBook)
                    : goToBook();
              })
            }}
          >
            <span>Add to shelf</span>
            <Icon icon='fa-books' />
          </li>
          <li
            onClick={() => goToBook()}
          >
            <span>Profile</span>
            <Icon icon='fa-chevron-right' type={IconTypeEnum.light} />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default bookCard;
