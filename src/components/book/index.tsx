import React from 'react';
import './book.css';
import Link from 'redux-first-router-link';
import { redirect } from 'redux-first-router';
import { Icon, Tooltip, Menu, MenuItem, Popover, Tag } from '@blueprintjs/core';
import { IAuthor, IExpandedBook, ITopicBodyObj, IUser, IStore } from 'src/state-management/models';
import Slider from 'react-slick';
import KPBOOK from '../../assets/kp_book.png';
import { toggleUserBook } from '../../state-management/thunks';
import { connect } from 'react-redux';

const Book = ({
  bookId, 
  books,
  user,
  linkTo
}: {
  bookId: string;
  books: IExpandedBook[];
  user: IUser;
  linkTo: Function
}) => {
  const book = books.find(livre => livre._id === bookId);
  if (!book) {
    return null;
  }
  const { title, author, pictures, topics } = book;
  const { name: authorName } = author as IAuthor;
  const [ picture = { link: undefined}] = pictures
  const isRead = user.readBooks.findIndex(livre => livre._id === book._id) > 0;
  return (
    <div className='singleBookWrapper'>
      <div className='bookPicture' style={{backgroundImage: `url(${picture.link || KPBOOK})`}}>
        <Link className='bookLink' to={{ type: 'SINGLEBOOK', payload: { id: book._id } }} />
        {isRead
          ? <span className='bookMark'><Icon icon='bookmark' iconSize={40} intent='danger'/></span>
          : <Tooltip content='Mark as read' className='unreadBookMark'>
              <span className='unreadBookMark' onClick={() => toggleUserBook(book._id, 'readBooks', isRead ? 'remove' : 'add')}>
                <Icon icon='bookmark' iconSize={40} />
              </span>
            </Tooltip>
        }
        <div className='topicsMeta'>
            <Slider
              dots={false}
              infinite={true}
              speed={500}
              slidesToShow={3}
              slidesToScroll={2}
              arrows={false}
              variableWidth={true}
              autoplay={true}
              autoplaySpeed={1500}
            >
              {topics.reduce((acc, curr) => [...acc, curr, ``], [])
              .map((topic: ITopicBodyObj, i) => topic
                ? <Tag icon='lightbulb' minimal={false} key={topic._id}>{topic.topic.name}</Tag>
                : <span key={i}>&nbsp;&nbsp;</span>)}

            </Slider>

        </div>
        <div className='bookMenu'>
          <div
            className='bookMenu_item'
            onClick={() => toggleUserBook(book._id, 'savedBooks', book.likes.includes(user ? user._id : '') ? 'remove' : 'add')}
            style={{ backgroundColor: book.likes.includes(user ? user._id : '') ? 'rgba(0,0,0,.5)' : 'transparent' }}
          >
            <Tooltip content={book.likes.includes(user ? user._id : '') ? 'Unlike Book' : 'Save Book'}>
              <span >
                <Icon
                  icon='heart'
                  iconSize={12}
                  intent={book.likes.includes(user ? user._id : '') ? 'danger' : 'none'}
                />
              </span>
            </Tooltip>
          </div>
          <div className='bookMenu_item' onClick={() => linkTo({ type: 'SINGLEBOOK', payload: { id: book._id }})}>
            <Tooltip content='View book'>
              <span><Icon icon='share' iconSize={12} /></span>
            </Tooltip>
          </div>
          <div className='bookMenu_item'>
            <Popover>
              <Tooltip content='More...'>
                <span><Icon icon='more' iconSize={12} /></span>
              </Tooltip>
              <Menu>
                <MenuItem
                  icon='social-media'
                  text='Share'
                  
                />
                <MenuItem
                  icon={isRead ? 'remove-column' : 'bookmark'}
                  text={`Mark ${isRead ? 'unread' : 'as read'}`}
                  onClick={() => toggleUserBook(book._id, 'readBooks', isRead ? 'remove' : 'add')}
                />
                <Menu.Divider />
                <MenuItem icon='shopping-cart' text='Purchase' labelElement={<Icon icon='share' />} onClick={() => window.open(book.affiliate_link || book.amazon_link, '_blank')}/>
                <Menu.Divider />
                <MenuItem icon='flag' text='Report book' />
              </Menu>
            </Popover>
            
          </div>
        </div>
      </div>
      <span className='bookTitle'>{title}</span>
      <span className='bookAuthor'>{authorName}</span>
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
