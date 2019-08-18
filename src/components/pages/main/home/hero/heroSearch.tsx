import React, { useState } from 'react';
import Slider from 'react-slick';
import { ITopic, IAppState } from '../../../../../state-management/models';
import Topic from '../../../../topic';
import { Icon } from '@blueprintjs/core';

interface IProps {
  topics: Array<ITopic>;
  updateFilteredTopics: Function;
  linkTo: Function;
  queryMoreBooks: Function;
  enterClicked: Function;
  searchMode: boolean;
  loggedIn: boolean;
  viewPort: IAppState['viewPort']
}
const heroSearch = ({ topics = [], updateFilteredTopics, linkTo, queryMoreBooks, enterClicked, searchMode, loggedIn, viewPort }: IProps) => {
  const [searchCategory, setCategory] = useState<'title'|'topic'|'author'>('title');
  const [searchText, updateSearchText] = useState<string>('');
  const [fadeOpacityNum, updateFadeOpacity] = useState<number>(0.2);
  const linkActive = (cat): string => `heroSearch_searchBox_categories_item ${searchCategory === cat ? 'activeSearch' : ''}`;
  const SearchBoxCategories = (
    <ul className={searchMode ? 'heroSearch_searchBox_categories activeSearch' : 'heroSearch_searchBox_categories'}>
      <li
        className={linkActive('title')}
        onClick={() => setCategory('title')}
      >
        Title
      </li>
      <li 
        className={linkActive('topic')}
        onClick={() => setCategory('topic')}
      >
        Topic
      </li>
      <li 
        className={linkActive('author')}
        onClick={() => setCategory('author')}
      >
        Author
      </li>
    </ul>
  );
  const fadeOpacity: boolean = loggedIn && viewPort === 'mobile';
  const elementStyle = { ...(fadeOpacity ? { opacity: fadeOpacityNum } : {})};
  if (fadeOpacity && fadeOpacityNum < .8) {
    window.addEventListener('scroll', () => {
      const elemHeight = 170;
      const scrollTop = window.scrollY;
      const opacity = ((1 - (elemHeight - scrollTop) / elemHeight) * 0.8) + 0.2;
      updateFadeOpacity(opacity);
    })
  } else if (fadeOpacity && fadeOpacityNum > .8) {
    window.removeEventListener('scroll', () => {
      updateFadeOpacity(1);
    });
  }
  const processSearch = (text?: string) => enterClicked(text || searchText);
  return (
    <section
      className={searchMode ? 'heroSearchWrapper searchMode' : 'heroSearchWrapper'}
      style={elementStyle}
    >
      <div className='heroSearch_container'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-10 col-11 heroSearch_box'>
              <div className='heroSearch_searchBox_wrapper'>
                {!searchMode && SearchBoxCategories}
                <div 
                  className={searchText.length > 0 ? 'heroSearch_searchBox_input_group isFocus' : 'heroSearch_searchBox_input_group'}
                >
                  <input
                    className='heroSearch_searchBox_input'
                    type='text'
                    placeholder={`Search by ${searchCategory}...`}
                    onKeyUp={e => {
                      const value = e.target.value;
                      if (e.keyCode === 13) {
                        processSearch(value);
                        return
                      }
                      updateSearchText(value);
                    }}
                  />
                  <span
                    className={searchText.length > 0 ? 'heroSearch_searchBox_btn isActive' : 'heroSearch_searchBox_btn'}
                    onClick={() => processSearch()}
                  >
                    <Icon icon='search' iconSize={23} />
                  </span>
                </div>
                {searchMode && SearchBoxCategories}
              </div>
              {!searchMode && <div className='heroSearch_topics_wrapper'>
                <Slider
                  dots={false}
                  infinite={true}
                  speed={1000}
                  slidesToShow={3}
                  slidesToScroll={2}
                  arrows={false}
                  variableWidth={true}
                  autoplay={true}
                  autoplaySpeed={15000}
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
                </Slider>
              </div>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default heroSearch;
