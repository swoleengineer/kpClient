import React from 'react';
import { connect } from 'react-redux';
import { IStore, IAppState, HomeSearchCategories, AuthModalTypes, ITopic } from '../../../../../state-management/models'
import Book from '../../../../book';
import { ButtonGroup, Button, Divider, NonIdealState, Tag } from '@blueprintjs/core';
import { redirect } from 'redux-first-router';
import { bookActionTypes as bookTypes, userActionTypes as userTypes, appActionTypes as appTypes } from '../../../../../state-management/actions'
import { engagePrecheck, queryMoreBooks } from '../../../../../state-management/thunks';

const ResultsSection = (props: {
  home: IAppState['home'];
  linkTo: Function;
  showAuthModal: Function;
  setSearch: Function;
  topics: ITopic[];
  updateFilteredTopics: Function;
}) => {
  const { updateFilteredTopics, home: { searchText, bookResults = [], selectedSearchCategory }, linkTo, showAuthModal, setSearch, topics } = props;
  
  const filteredTopics = selectedSearchCategory === HomeSearchCategories.book || !topics.length
    ? []
    : topics.filter(topic => {
      const normalizedTopicNameArr = topic.name.toLowerCase().split('');
      const normalizedQueryArr = searchText.toLowerCase().split('');
      return normalizedQueryArr.every(letter => normalizedTopicNameArr.includes(letter));
    })
  
  return (
    <section className='section_gray section_padding'>
      <div className='container'>
        <div className='resultsTopOptions text-right'>
          <ButtonGroup>
            <Button
              text='Cancel Search'
              rightIcon='cross'
              minimal={true}
              onClick={() => setSearch('')}
            />
            <Divider />
            <Button
              rightIcon='help'
              text='Ask For Suggestion'
              onClick={() => {
                engagePrecheck(null, true, err => {
                  if (err) {
                    return;
                  }
                  showAuthModal(AuthModalTypes.question);
                })
              }}
            />
            <Button
              text='Browse All Books'
              rightIcon='chevron-right'
              onClick={() => linkTo({ type: 'ALLBOOKS' })}
            />
          </ButtonGroup>
        </div>
        <br />
        {selectedSearchCategory === HomeSearchCategories.book && <div className='bookResultsWrapper'>
          {bookResults.length < 1 && <div className='nonIdealWrapper'>
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
          {bookResults.map((book) => (
            <div className='bookResultsSingle centerOnSmall' key={book._id} style={{ minHeight: '285px', marginBottom: '15px'}}><Book liv={book}  /></div>
          ))}
        </div>}
        {selectedSearchCategory === HomeSearchCategories.topic && <div className='topicResultsWrapper'>
          {filteredTopics.length < 1 && <div className='nonIdealWrapper'>
            <NonIdealState
              icon='help'
              title='No Results'
              description={<p>There are no results that match your query. <br /> You can ask users for a suggestion by clicking below.</p>}
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
          {filteredTopics.map((topic, i) => {
            return (
              <Tag
                icon='lightbulb'
                minimal={false}
                large={true}
                interactive={true}
                key={topic.name}
                onClick={() => {
                  updateFilteredTopics({
                    type: 'add',
                    data: topic
                  });
                  linkTo({ type: 'ALLBOOKS' });
                    queryMoreBooks(undefined, [topic._id], undefined).then(
                      () => {},
                      () => console.log('error retrieving books')
                    )
                }}
              >
                {topic.name}
              </Tag>
            )
          })}
        </div>}
      </div>
    </section>
  );
}

const mapStateToProps = (state: IStore) => ({
  home: state.app.home,
  topics: state.topic.allTopics
});

const mapDispatch = dispatch => ({
  linkTo: payload => dispatch(redirect(payload)),
  setSearch: payload => dispatch({ type: appTypes.updateSearchText, payload }),
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
  updateFilteredTopics: payload => dispatch({ type: bookTypes.updateFilterTopics, payload }),
})

export default connect(mapStateToProps, mapDispatch)(ResultsSection);
