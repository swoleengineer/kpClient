import React from 'react';
import {} from '@blueprintjs/core';
import Slider from 'react-slick';
import Icon from '../../../../icons';
import { ITopic } from '../../../../../state-management/models';
import Topic from '../../../../topic';


interface IProps {
  searchMode: boolean;
  SearchBoxCategories: JSX.Element;
  searchText: string;
  searchCategory: string;
  processSearch: Function;
  updateSearchText: Function;
  topics: Array<ITopic>;
  className?: string;
}
//col-md-10 col-11
const searchInput = (props: IProps) => {
  const { searchMode, SearchBoxCategories, searchText, searchCategory, processSearch, updateSearchText,
    topics, className = ''
  } = props;
  return (
    <div className={`heroSearch_box ${className}`}>
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
                return;
              }
              updateSearchText(value);
            }}
          />
          <span
            className={searchText.length > 0 ? 'heroSearch_searchBox_btn isActive' : 'heroSearch_searchBox_btn'}
            onClick={() => processSearch()}
          >
            <Icon icon='fa-search' iconSize={23} />
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
                  // updateFilteredTopics({
                  //   type: 'add',
                  //   data: topic
                  // });
                  // linkTo({ type: 'ALLBOOKS' });
                  // queryMoreBooks(undefined, [topic._id], undefined).then(
                  //   () => {},
                  //   () => console.log('error retrieving books')
                  // )
                }}
              />                
            : <span key={i}>&nbsp;&nbsp;</span>)
        }
      </Slider>
    </div>}
  </div>
  )
}

export default searchInput;
