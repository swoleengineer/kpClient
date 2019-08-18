import React from 'react';
import { ITopic, IStore, IAppState } from '../../../../../state-management/models';
import { connect } from 'react-redux';
import { appActionTypes, bookActionTypes as bookTypes } from '../../../../../state-management/actions';
import { 
  // searchGoogle, showModal, 
  queryMoreBooks } from '../../../../../state-management/thunks';
import { redirect } from 'redux-first-router'
import HeroSlider from './heroSlider';
import HeroSearch from './heroSearch';
import './heroStyle.css';


const Hero = (props: {
  topics: Array<ITopic>;
  home: IAppState['home'];
  updateSearch: Function;
  updateCategory: Function;
  updateFilteredTopics: Function;
  linkTo: Function;
  viewPort: IAppState['viewPort'];
  loggedIn: boolean;
}) => {
  const { updateFilteredTopics, linkTo, topics, home: { searchText,
    // selectedSearchCategory 
  }, updateSearch, 
  // updateCategory, 
  viewPort, loggedIn } = props;
  // const processText = (force: boolean = false) => {
  //   if (!force && (searchText.length < 3 || selectedSearchCategory === HomeSearchCategories.topic)) {
  //     return;
  //   }
  //   searchGoogle(searchText).then(
  //     () => console.log(''),
  //     () => console.log('')
  //   )
  // }
  const screenHeight = window.innerHeight;
  const style = {
    ...(searchText.length > 0
      ? {
        position: 'sticky',
        top: '43px',
        zIndex: 19,
        backgroundColor: '#b2c0ca',
        height: '55px'
      }
      : {}),
    ...( viewPort === 'mobile'
      ? {
          height: `${screenHeight}px`
        }
      : {})
    };
  return (
  <section className={viewPort === 'mobile' ? 'heroSection mobileHero' : 'heroSection'} style={style}>
    {searchText.length < 1 && <HeroSlider loggedIn={loggedIn} />}
    <HeroSearch
      topics={topics}
      updateFilteredTopics={updateFilteredTopics}
      linkTo={linkTo}
      queryMoreBooks={queryMoreBooks}
      enterClicked={updateSearch}
      searchMode={searchText.length > 0}
      loggedIn={loggedIn}
      viewPort={viewPort}
    />
    {/* <div className='container'  style={{ ...(searchText.length > 0 || viewPort !== 'pc' ? { background: 'none'} : {})}} >
      <div className='row'>
        <Collapse isOpen={!searchText.length} transitionDuration={25}>
          <div className='col-12'>
            <h2>Find a book that teaches you (x).</h2>
          </div>
          <div className='col-md-8'>
            <p className='heroDescription'>Search and browse books by topics, share what you've learned with other readers.</p>
          </div>
        </Collapse>
        <div className='col-md-8'>
          <div className='heroSearchWrapper' style={{ ...(searchText.length > 0 ? { marginBottom: '0px'} : {})}} >
            <div className='searchSelectors'>
              <span
                className={selectedSearchCategory === HomeSearchCategories.book ? 'searchSelector_selected' : ''}
                onClick={() => selectedSearchCategory === HomeSearchCategories.book ? null : updateCategory(HomeSearchCategories.book)}
              >
                Books
              </span>
              <span
                className={selectedSearchCategory === HomeSearchCategories.topic ? 'searchSelector_selected' : ''}
                onClick={() => selectedSearchCategory === HomeSearchCategories.topic ? null : updateCategory(HomeSearchCategories.topic)}
              >
                Topics
              </span>
            </div>
            <ControlGroup fill={true}>
              <InputGroup
                placeholder={`Search for a ${selectedSearchCategory}...`}
                onKeyUp={$event => {
                  if ($event.keyCode === 13) {
                    processText(true);
                  }
                }}
                onChange={e => {
                  updateSearch(e.target.value);
                  processText();
                }}
                rightElement={
                  <Icon
                    icon='search'
                    iconSize={25}
                    style={{ color: '#5c7080'}}
                    onClick={() => {
                      processText(true)
                    }}
                  />
                }
              />
            </ControlGroup>
            {searchText.length > 0 && <span className='searchBoxText'>Can't find what you're looking for? <strong onClick={() => showModal(AuthModalTypes.question)}>Ask for a Suggestion</strong></span>}
            
          </div>
        </div>
      </div>
    </div>
    {!searchText.length && <div className='heroTopicsWrapper'>
      <div className='container'>
        <span className='heroTopicsTitle'>
          Topics: &nbsp;&nbsp;
        </span>
        
        <div className='heroTopicsContainer'>
          {topics.length > 0 && <Slider
            dots={false}
            infinite={true}
            speed={1000}
            slidesToShow={3}
            slidesToScroll={2}
            arrows={false}
            variableWidth={true}
            autoplay={true}
            autoplaySpeed={6500}
          >
            {topics
              .reduce((acc, curr) => [...acc, curr, ``], [])
              .map((topic: ITopic, i) => topic
                ? <Topic
                    skill={topic}
                    key={topic._id}
                    interactive={true}
                    topicSize='smallTopic'
                    minimal={false}
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
                />                
                : <span key={i}>&nbsp;&nbsp;</span>)
            }
          </Slider>}
        </div>
      </div>
    </div>}
   */}
  </section>
  );
}

const mapStateToProps = (state: IStore) => ({
  topics: state.topic.allTopics,
  home: state.app.home,
  viewPort: state.app.viewPort,
  loggedIn: state.user.loggedIn
});

const mapDispatch = dispatch => ({
  updateSearch: payload => dispatch({ type: appActionTypes.updateSearchText, payload }),
  updateCategory: payload => dispatch({ type: appActionTypes.updateSearchCategory, payload }),
  updateFilteredTopics: payload => dispatch({ type: bookTypes.updateFilterTopics, payload }),
  linkTo: payload => dispatch(redirect(payload))
})

export default connect(mapStateToProps, mapDispatch)(Hero);
