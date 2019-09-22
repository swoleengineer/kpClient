import React, { useState, useEffect } from 'react';
import { InputGroup, Button, NonIdealState, Text } from '@blueprintjs/core';
import Icon, { IconTypeEnum } from '../icons';
import { IBook, IStore } from '../../state-management/models'
import './bookSearchPopover.css';
import { connect } from 'react-redux';
import KPBOOK from '../../assets/kp_book.png';
import { getAuthorName, bookFilter } from '../../state-management/utils'
import { searchBooks } from '../../state-management/thunks';

const bookSearchPopover = ({ books = [], callBack = (book: any) => null }) => {
  const [selectedBook, setSelectedBook] = useState(undefined);
  const [query, setQuery] = useState<string>('');
  const [searched, setSearched] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchErr, setErr] = useState<string>('')
  // const visibleBooks = !query.length ? [] : books.filter(bookFilter(query));
  const [visibleBooks, setVisibleBooks] = useState([])
  useEffect(() => {
    setQuery(query);
    setVisibleBooks(books)
  }, [books])
  return (
    <div className='bookSearchPopover_main_wrapper'>
      <div className='bookSearchPopover_input_wrapper'>
        <div className='bookSearchPopover_input_container'>
          <InputGroup
            fill={true}
            rightElement={query.length > 1
              ? (
                <Button
                  onClick={() => setQuery('')}
                  minimal={true}
                  icon={<span className='bp3-icon'><Icon icon='fa-times' type={IconTypeEnum.light} /> </span>}
                />
              )
              : undefined
            }
            leftIcon={<span className='bp3-icon'><Icon icon='fa-search' /> </span>}
            className='bookSeachPopover_input'
            placeholder='Search'
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              if (books.length) {
                setVisibleBooks(books.filter(bookFilter(e.target.value)));
              }
            }}
            onKeyUp={e => {
              if (e.keyCode === 13) {
                setVisibleBooks([])
                setLoading(true);
                
                searchBooks(query).then(
                  () => {
                    setSearched(true);
                    setLoading(false);
                  },
                  (err) => {
                    let message;
                    console.error(err)
                    try {
                      message = err.response.data.message
                    } catch {
                      message = 'Could not get books';
                    }
                    setErr(message)
                  }
                )
              }
            }}
          />
        </div>
      </div>
      <div className={`bookSearchPopover_modifiers_wrapper ${query.length > 0 ? 'bookSearchActive' : ''}`}>
        <div className='bookSearchPopover_modifiers_container'>
          <span 
            className='bookSearchPopover_modifier selectedModifier'
          >
            Title
          </span>
          <span 
            className='bookSearchPopover_modifier'
          >
            Author
          </span>
          <span 
            className='bookSearchPopover_modifier'
          >
            Topic
          </span>
        </div>
      </div>
      <div className='bookSearchPopover_results_wrapper'>
        {loading && (
          <div className='bookSearchPopover_loading'>
            <Icon icon='fa-spin fa-circle-notch' iconSize={35} type={IconTypeEnum.duo}/>
            <span>Loading...</span>
          </div>
        )}
        {(visibleBooks.length < 1 && !loading) && (
          <div className='nonIdealWrapper' style={{ padding: '25px 0 50px'}}>
            <NonIdealState
              icon={<Icon icon={`fa-${(query.length > 0 && searched) ? 'empty-set' : 'search'}`} />}
              description={<p>{(query.length > 0 && searched) ? 'No results' : 'Type above to search books'}</p>}
            />
          </div>
        )}
        {(!loading && books.length > 0) && (
          <div className='bookSearchPopover_books_container'>
            {books.filter(bookFilter(query)).map((book, i) => {
              const { title, pictures, topics = [], likes = [] } = book;
              const [ picture = { link: undefined}] = pictures || [];
              return (
                <div 
                  className={`bookSearchPopover_book ${selectedBook !== undefined && selectedBook.gId === book.gId ? 'bookSearchSelected' : ''}`}
                  key={i}
                  onClick={() => setSelectedBook(book)}
                >
                  <div className='bookSearchPopover_book_image_wrapper'>
                    <div className='bookSearchPopover_book_image' style={{backgroundImage: `url(${picture.link || KPBOOK})`}} />
                  </div>
                  <div className='bookSearchPopover_book_details_Wrapper'>
                    <span className='bookSearchPopover_book_title'>{title}</span>
                    <span className='bookSearchPopover_book_author'>{getAuthorName(book)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      <div className='bookSearchPopover_footer'>
        <Button
          text='Cancel'
          minimal={true}
          small={true}
          className='bp3-popover-dismiss'
        />
        <Button
          text='Select'
          minimal={true}
          small={true}
          disabled={!selectedBook}
          onClick={() => callBack(selectedBook)}
          className='bp3-popover-dismiss'
        />
      </div>
    </div>
  );
}

const mapStateToProps = (state: IStore) => ({
  books: state.book.books
})

export default connect(mapStateToProps)(bookSearchPopover);
