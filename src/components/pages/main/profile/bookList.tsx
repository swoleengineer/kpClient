import React from 'react';
import { connect } from 'react-redux';
import { IStore, IUser, ITopicBodyObj } from '../../../../state-management/models';
import { Icon, Card } from '@blueprintjs/core';
import { flatten } from 'lodash';
import Book from '../../../book';

const getUnique = (arr, prop) => arr.filter(e => e).map(e => e[prop]).map((e, i, f) => f.indexOf(e) === i && i).filter(e => arr[e]).map(e => arr[e])

const BookList = (props: {
  listType: string;
  user: IUser;
}) => {
  const { user, listType } = props;
  if (!user) {
    return null;
  }
  const books = user[listType] || [];
  const icon = listType === 'likedBooks' ? 'book' : 'bookmark';
  const allTopics = getUnique(flatten(books.map(book => book.topics.map((topic : ITopicBodyObj) => topic.topic))), '_id')

  return (
    <div className='row'>
      <div className='col-12'>
        <header className='listPage_header'>
          <h4>
            <strong>{books.length} Books</strong>
            <small><Icon icon={icon} /> My {listType} library | {allTopics.length} topics</small>
          </h4>
        </header>
        <div className='listPage_topics_wrapper'>
          <Card>
            <div className='listPage_topics_meta row'>
              <div className='col-md-6'>
                <strong >Topics</strong>
              </div>
              <div className='col-md-6 text-right'>
                more things will go in ehre
              </div>
              
            </div>
            <div className='listPage_topics_container'>
              things will go in here
            </div>
          </Card>
        </div>
        <div className='listPage_books_wrapper'>
          {books.map((book, i) => {
            return <div className='listPage_books_single' key={i}>
              <Book liv={book} />
            </div>
          })}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state: IStore) => ({
  user: state.user.user
});

export default connect(mapStateToProps)(BookList);
