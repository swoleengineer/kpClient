import React, { useState } from 'react';
import Icon, { IconTypeEnum } from '../icons';
import { useSelector, useDispatch } from 'react-redux';
import { IStore } from '../../state-management/models';
import { appActionTypes } from '../../state-management/actions';
import { addBookFromInt } from '../../state-management/thunks';
import Link from 'redux-first-router-link';
import { redirect } from 'redux-first-router';
import KPBOOK from '../../assets/kp_book.png';
import ResultRow from './searchResultRow';
import { keenToaster } from '../../containers/switcher';


interface IProps {
  searchText: string;
  searchResults: Array<any>;
}
const searchOver = (props: IProps) => {
  const { searchText, searchResults } = props;
  const [selectedSection, setSection] = useState('All');
  const books = useSelector((store: IStore) => store.book.books);
  const dispatch = useDispatch();
  const cancelSearch = () => dispatch({
    type: appActionTypes.updateSearchText,
    payload: ''
  });
  const linkTo = payload => dispatch(redirect(payload));

  const goToBook = (book, cb: Function = () => null) => {
    if (book.active) {
      cb();
      return linkTo({ type: 'SINGLEBOOK', payload: { id: book._id }});
    }
    return addBookFromInt(book).then(
      (newBook) => {
        
        if (!newBook || !newBook.active || !newBook._id) {
          keenToaster.show({
            intent: 'none',
            message: 'Server error loading this book',
            icon: 'error'
          });
          cb();
          return;
        }
        cb();
        cancelSearch();
        return linkTo({ type: 'SINGLEBOOK', payload: { id: newBook._id }});
      },
      (err: any) => {
        keenToaster.show({
          intent: 'none',
          message: 'Server error loading this book',
          icon: 'error'
        });
        cb();
      }
    )
  }
  return (
    <div className='kp_header_searchPopup_wrapper'>
      <div className='kp_header_searchPopup_container'>
        <div className='kp_header_actions_wrapper'>
            <div className='container' >
              <div className='kp_header_actions_container'>
                <ul>
                  <li
                    className={selectedSection === 'All' ? 'selected' : ''}
                    onClick={() => setSection('All')}
                  >
                    <Icon icon='fa-search' />
                    <span>All</span>
                  </li>
                  <li
                    className={selectedSection === 'Title' ? 'selected' : ''}
                    onClick={() => setSection('Title')}
                  >
                    <Icon icon='fa-book' type={IconTypeEnum.regular} />
                    <span>Title</span>
                  </li>
                  <li
                    className={selectedSection === 'Author' ? 'selected' : ''}
                    onClick={() => setSection('Author')}
                  >
                    <Icon icon='fa-id-badge' type={IconTypeEnum.regular} />
                    <span>Author</span>
                  </li>
                  <li
                    className={selectedSection === 'Topic' ? 'selected' : ''}
                    onClick={() => setSection('Topic')}
                  >
                    <Icon icon='fa-head-side-brain' type={IconTypeEnum.regular} />
                    <span>Topic</span>
                  </li>
                  <li
                    onClick={() => cancelSearch()}
                  >
                    <Icon icon='fa-times' type={IconTypeEnum.regular} />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        <div className='container'>
        {searchResults.length > 0 && (
          <div className='kp_search_results_wrapper'>
            <div className='kp_search_results_container'>
              <div className='kp_search_results'>
                {searchResults.map((row, i) => (
                  <ResultRow
                    key={i}
                    book={row}
                    onClick={(bk, callback) => goToBook(bk, callback)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        {searchText.trim().length > 0 && (
          <div className='kp_header_text_search'>
            <Icon icon='fa-search' type={IconTypeEnum.regular} /> <span>Search for <strong>{searchText}</strong>...</span>
          </div> 
        )}
        {(books.length > 0 && searchText.length < 5) && (
          <div className='kp_header_recents_wrapper'>
            <div className='kp_header_recents_container'>
              <strong style={{ display: 'block' }}>Recents</strong>
              <div className='kp_header_recents'>
                {books.filter((_,i) => i < 5).map(({ pictures, _id, title }) => {
                  const [ picture = { link: undefined }] = pictures || [];
                  return (
                    <Link
                      onClick={() => cancelSearch()}
                      key={_id}
                      to={{
                        type: 'SINGLEBOOK',
                        payload: {
                          id: _id
                        }
                      }}
                      className='kp_header_recent'
                      style={{backgroundImage: `url(${picture.link || KPBOOK})`}}
                    >
                      <span className='kp_header_recent_title'>{title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default searchOver;
