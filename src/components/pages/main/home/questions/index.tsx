import React, { useState } from 'react';
import './questions.css';
import { connect } from 'react-redux';
import { IStore, IExpandedBook, IQuestion, AuthModalTypes } from '../../../../../state-management/models';
import QuestionCard from '../../../../question';
import Slider from 'react-slick';
import { ButtonGroup, Button, Divider } from '@blueprintjs/core';
import { redirect } from 'redux-first-router';
import { showModal } from '../../../../../state-management/thunks';
import Icon from '../../../../icons';


const Questions = (props: { books: Array<IExpandedBook>; questions: IQuestion[]; toPage: Function }) => {
  const [activeSlide, updateActiveSlide] = useState(0);
  const { books, questions, toPage } = props;

  let componentSlider;
  return (
    <section className='section_padding section_gray'>
      <div className='container'>
        <div className='row'>
          <div className='col-6'>
            <h5>Questions</h5>
          </div>
          <div className='col-6'>
            <div className='headerMenu'>
              <ButtonGroup>
                <Button icon={<Icon icon='fad fa-hands-helping' />} onClick={() => showModal(AuthModalTypes.question)}>Ask <span className='hidden-sm'>For Suggestion</span></Button>
                <Button icon='arrow-right' onClick={() => toPage({ type: 'ALLQUESTIONS' })}>All <span className='hidden-sm'>Questions</span></Button>
              </ButtonGroup>
              <Divider className='hidden-xs'/>
              <ButtonGroup className='hidden-xs'>
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
              slidesPerRow={1}
              slidesToScroll={1}
              arrows={false}
              variableWidth={false}
              swipeToSlide={false}
              className='kidsInLove'
              afterChange={index => updateActiveSlide(index)}
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
              {questions.map((question, i) => <QuestionCard question={question} books={books} key={i} responsive={true} />)}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  )
}

const mapStateToProps = (state: IStore) => ({
  books: state.book.books,
  questions: state.question.questions
})

const mapDispatch = dispatch => ({
  toPage: action => dispatch(redirect(action))
})
export default connect(mapStateToProps, mapDispatch)(Questions);
