import React, { useState } from 'react';
import { connect } from 'react-redux';
import { IStore, IUser, ITopicBodyObj } from '../../../../state-management/models';
import { Icon, Card, Tag, Button, MenuItem } from '@blueprintjs/core';
import { flatten } from 'lodash';
import { Select } from '@blueprintjs/select';
import Book from '../../../book';

const getUnique = (arr, prop) => arr.map(e => e[prop]).map((e, i, f) => f.indexOf(e) === i && i).filter(e => arr[e]).map(e => arr[e])

const BookList = (props: {
  listType: string;
  user: IUser;
}) => {
  const { user, listType } = props;
  if (!user) {
    return null;
  }
  const books = user[listType === 'Liked Books' ? 'savedBooks' : 'readBooks'] || [];
  const icon = listType === 'Liked Books' ? 'book' : 'bookmark';
  const allTopics = getUnique(flatten(books.map(book => book.topics.map((topic : ITopicBodyObj) => topic.topic))), '_id')
  
  const [topicFilters, filterTopics] = useState([{
    id: 0,
    text: 'From All Libraries',
    filterMethod: topic => true,
    active: true
  }, {
    id: 1,
    text: listType === 'Liked Books' ? 'From Read Books Only' : 'From Saved Books Only', 
    filterMethod: (topic, i): boolean => {
      const otherBooks = user[listType === 'Liked Books' ? 'readBooks' : 'savedBooks'] || [];
      const otherTopics = getUnique(flatten(otherBooks.map(book => book.topics.map((top : ITopicBodyObj) => top.topic))), '_id')
      return otherTopics.map(top => top._id).includes(topic._id)
    },
    active: false
  }, {
    id: 2,
    text: 'From This Library Only',
    filterMethod: (topic, i): boolean => {
      const otherBooks = user[listType === 'Liked Books' ? 'readBooks' : 'savedBooks'] || [];
      const otherTopics = getUnique(flatten(otherBooks.map(book => book.topics.map((top : ITopicBodyObj) => top.topic))), '_id')
      return !otherTopics.map(top => top._id).includes(topic._id)
    },
    active: false
  }])
  const [selectedTopics, changeSelectedTopics] = useState([])
  const topicSelectProps = {
    filterable: false,
    items: topicFilters,
    onItemSelect: item => filterTopics(topicFilters.map(topic => ({
      ...topic,
      active: topic.id === item.id
    }))),
    itemRenderer: (option, {handleClick, modifiers }) => {
      return (
        <MenuItem
          key={option.id}
          text={option.text}
          onClick={() => filterTopics(topicFilters.map(topic => ({
            ...topic,
            active: topic.id === option.id
          })))}
        />
      );
    }
  }
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
                <Select
                  {...topicSelectProps}
                >
                  <Button
                    text={`Filter: ${topicFilters.find(filter => filter.active).text}`}
                    rightIcon='chevron-down'
                    minimal={true}
                  />
                </Select>
              </div>
              
            </div>
            <div className='listPage_topics_container'>
              {allTopics.filter(topicFilters.find(filter => filter.active).filterMethod).map((topic, i) => {
                return (
                  <Tag
                    style={{ margin: '0 10px 10px 0'}}
                    minimal={!selectedTopics.map(top => top._id).includes(topic._id)}
                    icon='lightbulb'
                    key={i}
                    large={true}
                    interactive={true}
                    onClick={() => {
                      const isIn: boolean = selectedTopics.map(tp => tp._id).includes(topic._id)
                      changeSelectedTopics(isIn
                        ? selectedTopics.filter(top => top._id !== topic._id)
                        : selectedTopics.concat(topic)
                        );
                    }}
                  >
                    {topic.name}
                  </Tag>
                )
              })}
            </div>
          </Card>
        </div>
        <div className='listPage_books_wrapper'>
          {books.filter(book => selectedTopics.length
            ? flatten(book.topics.map(top => top.topic._id)).filter(top => selectedTopics.map(tp => tp._id).includes(top))
            : true
          ).map((book, i) => {
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
