import React from 'react';
import './book.css';
import { connect } from 'react-redux';
import { IStore } from 'src/state-management/models';
import Book from '../../../../book';
import { Button, ButtonGroup, Divider } from '@blueprintjs/core';

const BooksSection = ({ books }) => {
  return (
    <section className='section_padding'>
      <div className='container'>
        
        <div className='row'>
          <div className='col-6'>
            <h5>Recent Books</h5>
          </div>
          <div className='col-6'>
            <div className='headerMenu'>
              <ButtonGroup>
                <Button icon='refresh'>Random</Button>
                <Button icon='add'>Add Book</Button>
              </ButtonGroup>
              <Divider />
              <Button icon='arrow-right'>All Books</Button>
            </div>
          </div>
        </div>
        <div className='row'>
          {books.map((book, i) => i < 6
            ? <div className='col-2' key={book._id}><Book book={book}  /></div>
            : null)}
        </div>
      </div>
    </section>
  );
};

const mapStateToProps = (state: IStore) => ({
  books: state.book.books
})
export default connect(mapStateToProps)(BooksSection)
