import React, { useState } from 'react';
import { connect } from 'react-redux';
import { IStore, IExpandedBook, ITopic, AuthModalTypes } from '../../../../state-management/models';
import './books.css';
import BookCard from './bookCard';
import { NonIdealState, Collapse, Switch, Button, ButtonGroup, Tooltip, Spinner, Divider, ControlGroup, InputGroup } from '@blueprintjs/core';
import TopicSearch from '../../auth/topic/topicBrowse';
import Book from '../../../book';
import { queryMoreBooks, searchBooks } from '../../../../state-management/thunks';
import { allBooksSearchOpen, allBooksViewBooks } from '../../../../config/appSettings';
import { bookFilter, bookSorts,
  // getSelectedSort 
} from '../../../../state-management/utils/book.util';
import { bookActionTypes as bookTypes, userActionTypes as userTypes } from '../../../../state-management/actions';
import Topic from '../../../topic';

const tagStyle = {
  margin: '0 10px 10px 0',
  display: 'inline-block',
}

const Allbooks = (props: {
  books: IExpandedBook[];
  topics: ITopic[];
  selectedTopics: ITopic[];
  updateFilteredTopics: Function;
  showAuthModal: Function;
}) => {
  const { updateFilteredTopics, selectedTopics, showAuthModal } = props;
  const [commentsFirst, updateCommentSort] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [searchOpen, updateSearchOpen] = useState(allBooksSearchOpen.get());
  const [sortOptions, updateSorts] = useState<any>(bookSorts)
  const [viewCards, updateView] = useState(!allBooksViewBooks.get());
  const [isLoading, updateLoading] = useState(false);
  const books = props.books
  const refreshBooks = () => {
    updateLoading(true);
    const currentsort = sortOptions.find(opt => opt.selected) || undefined;
    if (!currentsort) {
      console.log('There is nothing to sort by in here. Needs at least a default sort.');
      return;
    }

    queryMoreBooks(currentsort.sort, selectedTopics.map(tag => tag._id), books.map(book => book._id)).then(
      () => updateLoading(false),
      () => {
        updateLoading(false);
        console.log('could not get more books to add.')
      }
    )
  }
  const shownBooks = books
    .filter(bookFilter(searchText))
    .filter(livre => !selectedTopics.length ? true : selectedTopics.map(tag => tag._id).every(tag => livre.topics.filter(topic => topic.topic).map(topic => topic.topic._id).includes(tag)))
    .sort((a, b) => {
      if (sortOptions.find(opt => opt.selected)) {
        return sortOptions.find(opt => opt.selected).sortFn(a, b)
      }
      console.log('there is no sort fuinction')
      return a > b
    })
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
    });
  return (
    <div className='row'>
      <div className='col-md-4'>
        <div className='clearfix makeSticky'>
          <div className='clearfix tagsHolder'>
            <h6>
              Browse by topics
              <br />
              <small>Selected ({selectedTopics.length})</small>
            </h6>
            <div>
              <TopicSearch 
                processNewItem={(topic, event) => {
                  updateFilteredTopics({
                    data: topic,
                    type: 'add'
                  });
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
        <div className={searchOpen ? 'allPage_topSettings_wrapper transitionEverything' : 'transitionEverything'}>
          <div className='row allPage_topSettings'>
            <div className='col-md-12 text-right'>
              <ButtonGroup  >
                <Button
                  text='Comments'
                  rightIcon={!commentsFirst ? 'arrow-up' : 'arrow-down'}
                  onClick={() => updateCommentSort(!commentsFirst)}
                />
              </ButtonGroup>
              <ButtonGroup style={{position: 'relative', top: '3px'}}>
                <Tooltip content='View as books'>
                  <Button 
                    icon='book'
                    minimal={true}
                    onClick={() => {
                      updateView(false);
                      allBooksViewBooks.set(true);
                    }} 
                    intent={viewCards ? 'none' : 'primary'}
                  />
                </Tooltip>
                <Tooltip content='View detailed'>
                  <Button 
                    icon='list'
                    minimal={true}
                    onClick={() => {
                      updateView(true);
                      allBooksViewBooks.set(false);
                    }} 
                    intent={!viewCards ? 'none' : 'primary'}
                  />
                </Tooltip>
                <Divider />
                <Button 
                  icon={searchOpen ? 'cross' : 'search'}
                  intent={searchOpen ? 'danger' : 'none'}
                  minimal={true}
                  onClick={() => {
                    updateSearchOpen(!searchOpen)
                    allBooksSearchOpen.set(!searchOpen);
                  }}
                />
              </ButtonGroup>
            </div>
          </div>
          {selectedTopics.length > 0 && <div className={searchOpen ? 'topTopicsContainer topTopicsExpanded' : 'topTopicsContainer'}>
            {selectedTopics.map((topic, i) => {
              if (!topic.name) {
                return null;
              }
              return (
                <Topic
                  skill={topic}
                  style={tagStyle}
                  key={i}
                  minimal={!searchOpen}
                  topicSize='normalTopic'
                  interactive={true}
                  removable={true}
                  onClick={() => {
                    updateFilteredTopics({
                      type: 'remove',
                      data: topic
                    })
                  }}
                />
              )
            })}  
          </div>}
          
          <Collapse isOpen={searchOpen} transitionDuration={85}>
            <div className='row allBookSearchInput'>
              <div className='col-12 allSearchOptions'>
                <span>Title</span>
                <span>Author</span>
              </div>
              <div className='col-12'>
                <ControlGroup fill={true} vertical={false}>
                  <InputGroup
                    value={searchText}
                    onChange={e => {
                      const value = e.target.value;
                      setSearchText(value);
                    }}
                    onKeyUp={$event => {
                      if ($event.keyCode === 13) {
                        updateLoading(true);
                        searchBooks(searchText).then(
                          () => updateLoading(false)
                        ).catch(() => console.log('error with request'))
                      }
                    }}
                    placeholder='Search for a book...'
                    rightElement={
                      <Button
                        icon='search'
                        minimal={true}
                        onClick={() => {
                          updateLoading(true);
                          searchBooks(searchText).then(
                            () => updateLoading(false)
                          ).catch(() => console.log('error with request'))
                        }}
                      />
                    }
                    large={true}
                  />
                </ControlGroup>
              </div>
            </div>
          </Collapse>
        </div>
        {isLoading && <Spinner />}
        {(!isLoading && shownBooks.length > 0) && shownBooks.map((book, i) => viewCards
            ? <BookCard book={book} key={i} />
            : <div className='singleBookContainer' key={i}><Book liv={book} /></div>
            )}
        {(!isLoading && !shownBooks.length) && <div className='nonIdealWrapper'>
          <NonIdealState
            icon='help'
            title='No Results'
            description={<p>There are no books that match your query. <br /> You can ask users for a suggestion by clicking below.</p>}
            action={
            <Button
              icon='help'
              text='Ask For Suggestions'
              onClick={() => {
                showAuthModal(AuthModalTypes.question);
              }}
            />
          }
          />
        </div>}
      </div>
    </div>
  )
}

const mapStateToProps = (state: IStore) => ({
  books: state.book.books,
  topics: state.topic.allTopics,
  selectedTopics: state.book.selectedTopics
});

const mapDispatch = dispatch => ({
  showAuthModal: (page: AuthModalTypes) => {
    dispatch({
      type: userTypes.toggleAuthModal,
      payload: true
    });
    dispatch({
      type: userTypes.setAuthModalPage,
      payload: page
    })
  },
  updateFilteredTopics: payload => dispatch({ type: bookTypes.updateFilterTopics, payload })
})
export default connect(mapStateToProps, mapDispatch)(Allbooks);
