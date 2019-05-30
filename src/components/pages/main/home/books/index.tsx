import React from 'react';
import './book.css';
import { connect } from 'react-redux';
import { IStore } from 'src/state-management/models';
import Book from '../../../../book';

const BooksSection = ({ books }) => {
  return (
    <section className='section_padding'>
      <div className='container'>
        <h6>Recent Books</h6>
        <div className='row'>
          {books.map((book, i) => i < 4
            ? <div className='col-2'><Book book={book} key={book._id} /></div>
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
