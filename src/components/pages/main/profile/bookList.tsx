import React from 'react';
import { IUser, ITopicBodyObj, IAppState, ITopic } from '../../../../state-management/models';
import { flatten } from 'lodash';
import Book from '../../../book';
import Icon, { IconTypeEnum } from '../../../icons';
import Slider from 'react-slick';
import Topic from '../../../topic';

const getUnique = (arr, prop) => arr.filter(e => e).map(e => e[prop]).map((e, i, f) => f.indexOf(e) === i && i).filter(e => arr[e]).map(e => arr[e])

const BookList = (props: {
  viewPort: IAppState['viewPort'];
  profileNav: IAppState['profile'];
  user: IUser;
}) => {
  const { user,  profileNav: { topLevel, lowerLevel: { [topLevel]: listType = 'likedBooks' }}} = props;
  if (!user) {
    return null;
  }
  const books = user[listType === 'likedBooks' ? 'savedBooks' : listType] || [];
  
  const icon = listType === 'likedBooks' ? 'fa-heart' : 'fa-bookmark';
  const iconProps = {
    likedBooks: {
      type: IconTypeEnum.solid,
      icon
    },
    readBooks: { icon }
  }
  const listName = {
    likedBooks: 'Liked Books',
    readBooks: 'Read Books'
  }[listType];
  const allTopics = getUnique(flatten(books.map(book => book.topics.map((topic : ITopicBodyObj) => topic.topic))), '_id')
  let bookSlider;
  return (
    <div className='library_list_wrapper'>
      <div className='library_list_top_container'>
        <header className='library_list_top_header'>
          <span className='library_list_top_header_text'><Icon {...iconProps[listType]} /> {listName}</span>
          <span className='library_list_top_header_count'>{books.length} <span className='hidden-sm'>books</span></span>
        </header>
        <div className='library_list_top_topics_wrapper'>
          <span className='library_list_top_title'>{allTopics.length} topics total</span>
          <div className='library_list_top_topics_container'>
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
        <div className='library_list_top_books_wrapper'>
          <div className='library_list_top_books_container'>
            <Slider
              ref={slider => bookSlider = slider}
              dots={false}
              infinite={true}
              speed={1000}
              slidesToShow={3}
              slidesToScroll={1}
              arrows={false}
              variableWidth={true}
              swipeToSlide={false}
              afterChange={index => {
                // update the part on the bottom.
                return null;
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
              {books.map((book, i) => <Book liv={book} key={book.gId}/>)}
            </Slider>
          </div>
        </div>
      </div>
      <div className='library_list_bottom_container'>
        bottom half goes in here
      </div>
      {/* <div className='col-12'>
        <header className='listPage_header'>
          <h4>
            <strong>{books.length} Books</strong>
            <small><Icon icon={icon} /> My {listType} library | {allTopics.length} topics</small>
          </h4>
        </header>
        <div className='listPage_topics_wrapper'>
          <Card>
            <div className='listPage_topics_meta row'>
              <div className='col-md-6'>
                <strong >Topics</strong>
              </div>
              <div className='col-md-6 text-right'>
                more things will go in ehre
              </div>
              
            </div>
            <div className='listPage_topics_container'>
              things will go in here
            </div>
          </Card>
        </div>
        <div className='listPage_books_wrapper'>
          {books.map((book, i) => {
            return <div className='listPage_books_single' key={i}>
              <Book liv={book} />
            </div>
          })}
        </div>
      </div> */}
    </div>
  );
}



export default BookList;
