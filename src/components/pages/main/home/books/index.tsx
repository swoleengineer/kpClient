import React, { useState } from 'react';
import './book.css';
import { connect } from 'react-redux';
import { IStore } from 'src/state-management/models';
import Book from '../../../../book';
import { Button, ButtonGroup, Divider } from '@blueprintjs/core';
import Slider from 'react-slick';

const BooksSection = ({ books }) => {
  const [activeSlide, updateActiveSlide] = useState(0);
  let componentSlider;
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
                <Button icon='add'>Add Book</Button>
                <Button icon='arrow-right'>All Books</Button>
              </ButtonGroup>
              <Divider />
              <ButtonGroup>
                <Button icon='chevron-left' onClick={() => componentSlider.slickGoTo(activeSlide - 1)}/>
                <Button icon='chevron-right' onClick={() => componentSlider.slickGoTo(activeSlide + 1)}/>
              </ButtonGroup>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            <Slider
              ref={slider => componentSlider = slider}
              dots={false}
              infinite={true}
              speed={1000}
              slidesToShow={3}
              slidesToScroll={1}
              arrows={false}
              variableWidth={true}
              swipeToSlide={false}
              afterChange={index => updateActiveSlide(index)}
            >
              {books.map((book, i) => <Book book={book} key={book._id}/>)}
            </Slider>
          </div>
          {/* {books.map((book, i) => i < 6
            ? <div className='col-2' key={book._id}><Book book={book}  /></div>
            : null)} */}
        </div>
      </div>
    </section>
  );
};

const mapStateToProps = (state: IStore) => ({
  books: state.book.books
})
export default connect(mapStateToProps)(BooksSection)
