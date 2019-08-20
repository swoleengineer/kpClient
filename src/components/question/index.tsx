import React from 'react';
import './question.css';
import { Text, Button, ButtonGroup, Popover, Menu, MenuItem } from '@blueprintjs/core';
import Slider from 'react-slick';
import { IExpandedBook, ITopicBodyObj, IExpandedQuestion } from 'src/state-management/models';
import moment from 'moment';
import Link from 'redux-first-router-link';
import { redirect } from 'redux-first-router';
import { connect } from 'react-redux';
import Topic from '../topic';
import Icon from '../icons';
const QuestionCard = (props: { linkTo: Function; style: any; question: IExpandedQuestion; books: IExpandedBook[]; responsive: boolean; }) => {
  const { responsive, question, style } = props;
  if (!question) {
    return null;
  }
  const { author, created, title, text, topics } = question;
  return (
    <div className={responsive ? 'responsiveQuestion' : ''} style={style}>
      <div className='questionCardWrapper'>
        <div className='questionCard_content'>
          <div className='questionCard_meta'>
            <span className='questionCard_meta_author'>Posted by: </span> @{typeof author === 'string' ? '' : author.username}
            <span className='questionCard_meta_time'>{moment(created).fromNow()}</span>
            <span className='questionCard_meta_more'>
              <Popover>
                <Icon icon='fa-ellipsis-h' />
                <Menu>
                  <MenuItem icon='lightbulb' text='Add Topic' onClick={() => props.linkTo({ type: 'SINGLEQUESTION', payload: { id: question._id} })}/>
                  <Menu.Divider />
                  <MenuItem icon='flag' text='Report' onClick={() => props.linkTo({ type: 'SINGLEQUESTION', payload: { id: question._id} })} />
                </Menu>
              </Popover>  
            </span>
          </div>
          <div className='questionCard_details'>
            <Link to={{ type: 'SINGLEQUESTION', payload: { id: question._id}}}>
              <span className='questionCard_details_title'>{title}</span>
              <span className='questionCard_details_description'><Text ellipsize={true}>{text}</Text></span>
            </Link>

          </div>
          <div className='questionCard_topics'>
            {topics.length > 0 && <Slider
              dots={false}
              infinite={false}
              speed={500}
              slidesToShow={topics.length > 1 ? 3 : 1}
              slidesToScroll={1}
              arrows={false}
              variableWidth={true}
            >
              {topics.reduce((acc, curr) => [...acc, curr, ``], [])
              .map((topic: ITopicBodyObj, i) => topic
                ? <Topic
                  topicBody={topic}
                  hideNumber={true}
                  minimal={false}
                  topicSize='smallTopic'
                  key={topic._id}
                />
                : <span key={i}>&nbsp;&nbsp;</span>)}
            </Slider>}
          </div>
          <div className='row'>
            <div className='col-12 text-right'>
              <ButtonGroup>
                <Button
                  icon='book'
                  text='Suggest Book'
                  onClick={() => props.linkTo({ type: 'SINGLEQUESTION', payload: { id: question._id} })}
                  rightIcon='chevron-right'
                />
              </ButtonGroup>
              
            </div>
          </div>
        </div>
      </div>
    </div>
    
  )
}



const mapDispatch = dispatch => ({
  linkTo: payload => dispatch(redirect(payload))
})
export default connect(null, mapDispatch)(QuestionCard);
