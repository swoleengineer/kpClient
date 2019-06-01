import React, { useState } from 'react';
import { Suggest, ItemRenderer } from '@blueprintjs/select';
import { MenuItem, Icon, Divider, Tag } from '@blueprintjs/core';
import { ITopic, IStore } from '../../../../../state-management/models';
import { filterTopic, areTopicsEqual } from '../../../../../state-management/utils';
import { connect } from 'react-redux';
import Slider from 'react-slick';

const TopicSuggest = Suggest.ofType<ITopic>();

export const renderTopic: ItemRenderer<ITopic> = (topic, { handleClick, modifiers, query }) => {
  if (!modifiers.matchesPredicate) {
      return null;
  }
  return (
      <MenuItem
          active={modifiers.active}
          disabled={modifiers.disabled}
          key={topic._id}
          onClick={handleClick}
          text={topic.name}
          icon='tag'
          label={query}
      />
  );
};
const Hero = (props: { topics: Array<ITopic> }) => {
  const { topics } = props;
  const [componentTopics] = useState(topics);
  const inputProps = {
    placeholder: 'Search a skill...',
    rightElement: <Icon icon='search' iconSize={25} style={{ color: '#5c7080'}} />,
    large: true,
  }
  const suggestProps = {
    allowCreate: true,
    closeOnSelect: true,
    items: componentTopics,
    minimal: false,
    openOnKeyDown: true,
    resetOnClose: false,
    resetOnSelect: true,
    itemPredicate: filterTopic,
    itemRenderer: renderTopic,
    itemsEqual: areTopicsEqual,
    inputProps
  }
  

  return (
  <section className='heroSection'>
    <div className='container'>
      <div className='row'>
        <div className='col-12'>
          <h2>Find a book that teaches you (x).</h2>
        </div>
        <div className='col-md-8'>
          <p className='heroDescription'>Search a skill you want to learn, and we will show you books that have taught others the same thing.</p>
        </div>
        <div className='col-md-8'>
          <div className='heroSearchWrapper'>
            <TopicSuggest
              {...suggestProps}
              inputValueRenderer={(topic: ITopic) => topic.name}
              onItemSelect={topic => console.log('value selected', topic)}
              createNewItemFromQuery={text => {
                const newTopic: ITopic = {
                  _id: `${new Date().getTime()}`,
                  active: true,
                  similar: [],
                  name: text,
                  description: 'this is a whole lot of stuff'
                }
                // setTopics(componentTopics.concat(newTopic));
                return newTopic;
              }}
              createNewItemRenderer={(query, active, handleClick) => {
                return <MenuItem
                  icon='add'
                  text={`Add skill: '${query}'`}
                  active={active}
                  onClick={() => null}
                  shouldDismissPopover={false}
                />
              }}
            />
            <Divider />
            <button className='heroAddBookBtn'>Add Book</button>
          </div>
        </div>
      </div>
    </div>
    <div className='heroTopicsWrapper'>
      <div className='container'>
        <span className='heroTopicsTitle'>
          Topics: &nbsp;&nbsp;
        </span>
        
        <div className='heroTopicsContainer'>
          <Slider
            dots={false}
            infinite={true}
            speed={1000}
            slidesToShow={3}
            slidesToScroll={2}
            arrows={false}
            variableWidth={true}
            autoplay={true}
            autoplaySpeed={6500}
          >
            {componentTopics
              .reduce((acc, curr) => [...acc, curr, ``], [])
              .map((topic: ITopic, i) => topic
                ? <Tag icon='lightbulb' minimal={false} key={topic._id}>{topic.name}</Tag>
                : <span key={i}>&nbsp;&nbsp;</span>)
            }
          </Slider>
        </div>
      </div>
    </div>
  </section>
  );
}

const mapStateToProps = (state: IStore) => ({
  topics: state.topic.allTopics
})

export default connect(mapStateToProps)(Hero);
