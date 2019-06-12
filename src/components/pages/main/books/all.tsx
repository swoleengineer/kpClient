import React, { useState } from 'react';
import { connect } from 'react-redux';
import { IStore, IExpandedBook, ITopic } from '../../../../state-management/models';
import './books.css';
import BookCard from './bookCard';
import { Tag, Collapse, Switch, Button, ButtonGroup, Tooltip, Spinner, Divider, ControlGroup, InputGroup } from '@blueprintjs/core';
import TopicSearch from '../../auth/topic/topicBrowse';
import Book from '../../../book';
import { queryMoreBooks } from '../../../../state-management/thunks';


const tagStyle = {
  margin: '0 10px 10px 0'
}

const Allbooks = (props: {
  books: IExpandedBook[];
  topics: ITopic[]
}) => {
  const { books, topics } = props;
  if (!books.length) {
    return null
  }
  const [selectedTags, updateTags] = useState([]);
  const [commentsFirst, updateCommentSort] = useState<boolean>(false)
  const [searchOpen, updateSearchOpen] = useState(false);
  const [sortOptions, updateSorts] = useState<any>([{
    sort: { 'topicsLength': 1 },
    selected: true,
    sortName: 'Highest topics',
    sortFn: (a, b) => a.topics.length < b.topics.length ? 1 : a.topics.length > b.topics.length ? -1 : 0
  }, {
    sort: { 'topicsLength': -1 },
    selected: false,
    sortName: 'Lowest topics',
    sortFn: (a, b) => a.topics.length < b.topics.length ? -1 : a.topics.length > b.topics.length ? -1 : 0
  }, {
    sort: { 'likesLength': 1 },
    selected: false,
    sortName: 'Highest likes',
    sortFn: (a, b) => a.likes.length < b.likes.length ? 1 : a.likes.length > b.likes.length ? -1 : 0
  }, {
    sort: { 'likesLength': -1 },
    selected: false,
    sortName: 'Lowest likes',
    sortFn: (a, b) => a.likes.length < b.likes.length ? -1 : a.likes.length > b.likes.length ? 1 : 0
  }])
  const [viewCards, updateView] = useState(true);
  const [isLoading, updateLoading] = useState(false);
  const refreshBooks = () => {
    updateLoading(true);
    const currentsort = sortOptions.find(opt => opt.selected) || undefined;
    if (!currentsort) {
      console.log('There is nothing to sort by in here. Needs at least a default sort.');
      return;
    }

    queryMoreBooks(currentsort.sort, selectedTags.map(tag => tag._id), books.map(book => book._id)).then(
      () => updateLoading(false),
      () => {
        updateLoading(false);
        console.log('could not get more books to add.')
      }
    )
  }
  return (
    <div className='row'>
      <div className='col-md-4'>
        <div className='clearfix makeSticky'>
          <div className='clearfix tagsHolder'>
            <h6>
              Browse by topics
              <br />
              <small>Selected ({selectedTags.length})</small>
            </h6>
            <Collapse isOpen={selectedTags.length > 0}>
              <div className='selectedTagsHolder'>
                {selectedTags
                  .map((topic, i) => (
                    <Tag 
                      style={tagStyle}
                      icon='lightbulb'
                      interactive={true}
                      key={i}
                      minimal={true}
                      onClick={() => {
                        updateTags(selectedTags.filter(tag => tag._id !== topic._id));
                        refreshBooks();
                      }}
                    >
                      {topic.name}
                    </Tag>
                  ))}
              </div>
            </Collapse>
            <div>
              {topics
                .map((topic, i) => (
                  <Tag 
                    style={tagStyle}
                    rightIcon='chevron-up'
                    icon='lightbulb'
                    interactive={true}
                    key={i}
                    minimal={true}
                    onClick={() => {
                      updateTags(selectedTags.filter(tag => tag._id !== topic._id).concat(topic));
                      refreshBooks();
                    }}
                  >
                    {topic.name}
                  </Tag>
                ))
              }
            </div>
            <div>
              <TopicSearch 
                processNewItem={(topic, event) => {
                  updateTags(selectedTags.filter(tag => tag._id !== topic._id).concat(topic));
                  refreshBooks();
                }}
                processRemove={() => console.log('removed')}
              />
            </div>
          </div>
          <br />
          <div className='clearfix sortHolder'>
            <h6>Query by:
              <br />
              <small>{sortOptions.find(option => option.selected).sortName}</small>
            </h6>
            <ul>
              {sortOptions.map((option, i) => {
                const opt = sortOptions.find(setting => setting.sortName === option.sortName);
                if (!opt) {
                  return null
                }
                return <li key={i}>
                  <Switch
                    checked={opt.selected as boolean}
                    label={opt.sortName as string}
                    onChange={() => {
                      updateSorts(sortOptions.map(setting => ({ ...setting, selected: setting.sortName === opt.sortName})));
                      refreshBooks();
                    }}
                    alignIndicator='right'
                  />
                </li>
              })}
            </ul>
          </div>
        </div>

        
      </div>
      <div className='col-md-8'>
        <div className='row allPage_topSettings'>
          <div className='col-md-6'>
            <Switch
              className='allPageCommentSort'
              checked={commentsFirst}
              label='Most comments'
              onChange={() => updateCommentSort(!commentsFirst)}
              alignIndicator='right'
            />
          </div>
          <div className='col-md-6 text-right'>
            <ButtonGroup>
              <Button disabled={true} minimal={true} text={`${viewCards ? 'Detailed' : 'Books'}`} />
                <Tooltip content='View as books'>
                  <Button icon='book' minimal={true} onClick={() => updateView(false)} intent={viewCards ? 'none' : 'primary'} />
                </Tooltip>
                <Tooltip content='View detailed'>
                  <Button icon='list' minimal={true} onClick={() => updateView(true)} intent={!viewCards ? 'none' : 'primary'} />
                </Tooltip>
                <Divider />
                <Button icon={searchOpen ? 'chevron-up' : 'search'} minimal={true} onClick={() => updateSearchOpen(!searchOpen)}/>
              </ButtonGroup>
          </div>
        </div>
        <Collapse isOpen={searchOpen}>
          <div className='row allBookSearchInput'>
            <div className='col-12'>
              <ControlGroup fill={true} vertical={false}>
                <InputGroup placeholder='Search for a book...' rightElement={<Button icon='search' minimal={true} />} large={true}/>
              </ControlGroup>
            </div>
          </div>
        </Collapse>
        {isLoading && <Spinner />}
        {!isLoading && books
          .filter(livre => !selectedTags.length ? true : selectedTags.map(tag => tag._id).every(tag => livre.topics.map(topic => topic.topic._id).includes(tag)))
          .sort(sortOptions.find(opt => opt.selected).sortFn)
          .sort((a, b) => {
            if (!commentsFirst) {
              return a.comments.length > b.comments.length
              ? 1
              : a.comments.length < b.comments.length
                ? -1
                : 0
            }
            return a.comments.length > b.comments.length
              ? -1
              : a.comments.length < b.comments.length
                ? 1
                : 0
          })
          .map((book, i) => viewCards
            ? <BookCard book={book} minimal={true} key={i}/>
            : <div className='singleBookContainer' key={i}><Book bookId={book._id}  /></div>
            )}
      </div>
    </div>
  )
}

const mapStateToProps = (state: IStore) => ({
  books: state.book.books,
  topics: state.topic.allTopics
})
export default connect(mapStateToProps)(Allbooks);
