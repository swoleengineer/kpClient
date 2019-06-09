import React from 'react';
import { connect } from 'react-redux';
import { IStore, IExpandedBook } from '../../../../state-management/models';
import './books.css';
import BookCard from './bookCard';

const Allbooks = (props: {
  books: IExpandedBook[];
}) => {
  const { books } = props;
  return (
    <div className='row'>
      <div className='col-md-4'>
        This will be the sidebar in the all books page
      </div>
      <div className='col-md-8'>
        {books.map((book, i) => <BookCard book={book} minimal={true} key={i}/>)}
      </div>
    </div>
  )
}

const mapStateToProps = (state: IStore) => ({
  books: state.book.books,

})
export default connect(mapStateToProps)(Allbooks);
