import React, { useState } from 'react';
import SearchInput from '../../main/home/hero/searchInput';
import { ITopic, IStore, IExpandedBook } from '../../../../state-management/models';
import { getAuthorName } from '../../../../state-management/utils';
import { connect } from 'react-redux';
import Icon, { IconTypeEnum } from '../../../icons';
import { Button } from '@blueprintjs/core';
import KPBOOK from '../../../../assets/kp_book.png';
import './searchBooks.css';


interface IProps {
  topics: ITopic[];
  callBack: Function;
  books: Array<IExpandedBook>
}

const searchBooks = (props: IProps) => {
  const { topics, callBack, books } = props;
  const [searchMode, setSearchMode] = useState<boolean>(false);
  const [searchCategory, setCategory] = useState<'title'|'topic'|'author'>('title');
  const [searchText, updateSearchText] = useState<string>('');
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
      <li
        className='heroSearch_searchBox_categories_item'
        onClick={() => callBack()}
        style={{
          marginLeft: 'auto'
        }}
      >
        <Button
          icon={<span className='bp3-icon'><Icon icon='fa-times' intent='danger' /></span>}
          minimal={true}
          small={true}
        />
      </li>
    </ul>
  );
  const processSearch = () => console.log('processSearch Clicked')
  return (
    <div>
      <div className='searchInputModal_input_wrapper'>
        <SearchInput
          className='noShadow'
          searchMode={searchMode}
          SearchBoxCategories={SearchBoxCategories}
          searchText={searchText}
          searchCategory={searchCategory}
          processSearch={processSearch}
          updateSearchText={updateSearchText}
          topics={topics}
        />
      </div>
      <div className='searchInputModal_results_wrapper'>
        <div className='searchInputModal_results_actions'></div>
        <div className='searchInputModal_results_container'>
          {books.map((book, i) => {
            const { title, pictures, topics = [], likes = [] } = book;
            const [ picture = { link: undefined}] = pictures || [];
            return (
              <div className='searchInputModal_results_item_wrapper' key={i}>
                <div
                  className='searchInputModal_results_item_picture'
                  style={{backgroundImage: `url(${picture.link || KPBOOK})`}}
                />
                <div className='searchInputModal_results_numbers'>
                  <div className='searchInputModal_results_number'>
                    <span><Icon icon='fa-graduation-cap' /> {topics.length}</span>
                    {/* <span>Topics</span> */}
                  </div>
                  <div className='searchInputModal_results_number'>
                    <span><Icon icon='fa-heart' type={IconTypeEnum.solid} /> {likes.length}</span>
                    {/* <span> Likes</span> */}
                  </div>
                </div>
                <div className='searchInputModal_results_details_wrapper'>
                  <div className='searchInputModal_results_details_container'>
                    <span className='searchInputModal_results_details_title'>{title}</span>
                    <span className='searchInputModal_results_details_author'>{getAuthorName(book)}</span>
                  </div>
                  <div className='searchInputModal_results_details_btn'>
                    <Button
                      icon={<span className='bp3-icon'><Icon icon='fa-chevron-right' /></span>}
                      text='Select'
                      small={true}
                      minimal={true}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (store: IStore) => ({
  topics: store.topic.allTopics,
  books: store.book.books
})

export default connect(mapStateToProps)(searchBooks);
