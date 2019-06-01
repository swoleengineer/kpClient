import React from 'react';
import './questions.css';
import { connect } from 'react-redux';
import { IStore, IExpandedBook } from 'src/state-management/models';
import QuestionCard from '../../../../question';



const Questions = (props: { books: Array<IExpandedBook>}) => {
  const { books } = props;


  return (
    <section className='section_padding section_gray'>
      <div className='container'>
        <div className='row'>
          <div className='col-6'>
            <h5>Questions</h5>
          </div>
          <div className='col-6'>
            Where the menu items will go
          </div>
        </div>
        <div className='row'>
          <div className='col-md-4'>
            <QuestionCard books={books} />
          </div>
          <div className='col-md-4'>
            <QuestionCard books={books} />
          </div>
          <div className='col-md-4'>
            <QuestionCard books={books} />
          </div>
        </div>
      </div>
    </section>
  )
}

const mapStateToProps = (state: IStore) => ({
  books: state.book.books
})

export default connect(mapStateToProps)(Questions);
