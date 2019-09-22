import React, { useState, Component } from 'react';
import { InputGroup, Button, NonIdealState } from '@blueprintjs/core';
import Slider from 'react-slick';
import Icon, { IconTypeEnum } from '../../../../icons';
import { ITopic, IBook, IAppState } from '../../../../../state-management/models';

import Topic from '../../../../topic';
import Book from '../../../../book'
import BookCard from '../../books/bookCard';


class NavButton extends Component<{ side: 'left' | 'right', onClick: Function }> {
  render() {
    const { side, onClick = () => null } = this.props;
    return (
      <span className='library_list_top_topics_arrow' onClick={() => onClick()}>
        <Icon icon={`fa-chevron-${side}`} type={IconTypeEnum.light} />
      </span>
    )
  }
}

interface IProps {
  allTopics: Array<ITopic>;
  books: Array<IBook>;
  viewPort: IAppState['viewPort'];
  setSelectedBook: Function;
  selectedBook?: IBook;
  setFilter: Function;
  filterText: string;
  showTopBg: Function
}
const shelfBook = (props: IProps) => {
  const { allTopics, books = [], viewPort, setSelectedBook, selectedBook, setFilter, filterText, showTopBg } = props;
  if (!books.length) {
    return (
      <div className='nonIdealWrapper' style={{ padding: '25px 0 50px'}}>
        <NonIdealState
          icon={<Icon icon='fa-empty-set' />}
          title='This shelf is currently empty'
          description={<p>Find books you want to add to this shelf throughout the website.</p>}
        />
      </div>
    );
  }
  const [activeBookSlide, setActiveSlide] = useState<number>(0);
  const [bookView, setBookView] = useState<'slider' | 'list'>('slider');
  const [selectedTopics, setSelectedTopic] = useState<Array<ITopic>>([])
  const updateBookView = (view: 'slider' | 'list') => {
    setBookView(view);
    showTopBg(view === 'slider');
  }
  let detailContainer;
  let bookSlider;
  const arrows = {
    prevArrow: <NavButton side='left' />,
    nextArrow: <NavButton side='right' />
  }
  return (
    <>
      <div className='library_list_top_filter_wrapper'>
        <InputGroup
          leftIcon={<span className='bp3-icon'><Icon icon='fa-search' style={{ position: 'relative', top: '-3px'}} /></span>}
          fill={true}
          placeholder='Filter'
          onKeyUp={e => {
            const value = e.target.value;
              setFilter(value);
            }}
          rightElement={filterText.length > 0
            ? <Button style={{ color: 'white' }} disabled={true} minimal={true} icon={<Icon icon={books.length === 1 ? 'fa-book' : 'fa-books'} />} text={books.length} />
            : undefined}
        />
        {<ul className='bookView_btns'>
          <li
            className={bookView === 'slider' ?'selectedView' : ''}
            onClick={() => updateBookView('slider')}
          >
            <Icon icon='fa-book' />
          </li>
          <li
            className={bookView === 'list' ?'selectedView' : ''}
            onClick={() => updateBookView('list')}
          >
            <Icon icon='fa-th-list' />
          </li>
        </ul>}
      </div>
      <div className='library_list_top_topics_wrapper' ref={elem => detailContainer = elem}>
        <span className='library_list_top_title'>
          <span className='library_list_top_title_text'>{allTopics.length} topics total</span>
        </span>
        <div className='library_list_top_topics_container'>
          <Slider
            dots={false}
            infinite={true}
            speed={1000}
            slidesToShow={3}
            slidesToScroll={2}
            arrows={true}
            variableWidth={true}
            autoplay={true}
            autoplaySpeed={15000}
            { ...arrows }
          >
            {allTopics
              .reduce((acc, curr) => [...acc, curr, ``], [])
              .map((topic: ITopic, i) => topic
                ? <Topic
                    skill={topic}
                    key={topic._id}
                    interactive={true}
                    topicSize='smallTopic'
                    minimal={false}
                    onClick={() => {
                      // Add logic that filters books by that topic
                    }}
                />                
                : <span key={i}>&nbsp;&nbsp;</span>)
            }
          </Slider>
        </div>
      </div>
      <div className='library_list_top_books_wrapper' style={{ position: bookView === 'slider' ? 'absolute' : 'static'}}>
        <span className='library_list_top_title'>
          <span className='library_list_top_title_text'>{books.length} book{books.length !== 1 && 's'} {filterText.length > 0 ? 'filtered' : 'total'}</span>
          {bookView === 'slider' && (<span className='library_list_top_title_btns'>
            <span
              className='library_list_top_title_btn'
              onClick={() => bookSlider.slickGoTo(activeBookSlide - 1)}
            >
              <Icon icon='fa-chevron-left' type={IconTypeEnum.light} />
            </span>
            <span
              className='library_list_top_title_btn'
              onClick={() => bookSlider.slickGoTo(activeBookSlide + 1)}
            >
              <Icon icon='fa-chevron-right' type={IconTypeEnum.light} />
            </span>
          </span>)}
        </span>
        <div className='library_list_top_books_container' >
          {bookView === 'slider' && <Slider
            ref={slider => bookSlider = slider}
            dots={false}
            infinite={false}
            speed={800}
            slidesToShow={3}
            slidesToScroll={1}
            arrows={false}
            variableWidth={true}
            draggable={true}
            swipeToSlide={true}
            afterChange={index => {
              setActiveSlide(index);
            }}
            responsive={[{
              breakpoint: 1024,
              settings: {
                slidesToShow: 3,
                slidesPerRow: 1,
                slidesToScroll: 1,
              }
            }, {
              breakpoint: 600,
              settings: {
                slidesToShow: 1,
                slidesPerRow: 1,
                slidesToScroll: 1,
              }
            }, {
              breakpoint: 480,
              settings: {
                slidesToShow: 1,
                slidesPerRow: 1,
                slidesToScroll: 1,
              }
            }]}
          >
            {books.map((book, i) => (
            <Book
              liv={book}
              key={book.gId}
              navigate={false}
              selectedBook={selectedBook && selectedBook._id === book._id}
              onClick={() => {
                setSelectedBook(book);
                setActiveSlide(i);
                if (detailContainer) {
                  detailContainer.scrollIntoView();
                }
              }}
            />
            ))}
          </Slider>}
          {/* {bookView === 'list' && (
            <div className='library_list_top_list_container'>
              {books.map((book, i) => {
                return (
                  <div className='library_list_top_list_item' key={i}>
                    <div className='library_list_top_item_top'>
                      <div className='library_list_top_item_top_img'>picture</div>
                      <div className='library_list_top_item_top_details'></div>
                    </div>
                    <div className='library_list_top_item_bottom'>
                      <div className='library_list_top_item_bottom_social'></div>
                      <div className='library_list_top_item_bottom_engage'></div>
                    </div>
                  </div>
                )
              })}
            </div>
          )} */}
          {bookView === 'list' && (
            <div className='library_list_top_list_container'>
              {books.map((book, i) => {
              
                return (<div className='library_list_top_list_item' key={i}>
                  <BookCard book={{ comments: [], reports: [], ...book }} minimal={false} />
                </div>)
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default shelfBook;
