import React, { useState } from 'react';
import Slider from 'react-slick';
import { ITopic, IAppState } from '../../../../../state-management/models';
import Topic from '../../../../topic';
import Icon from '../../../../icons';
import SearchInput from './searchInput';

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
  const fadeOpacity: boolean = !loggedIn && viewPort === 'mobile';
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
            <SearchInput
              className='col-md-10 col-11'
              searchMode={searchMode}
              SearchBoxCategories={SearchBoxCategories}
              searchText={searchText}
              searchCategory={searchCategory}
              processSearch={processSearch}
              updateSearchText={updateSearchText}
              topics={topics}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default heroSearch;
