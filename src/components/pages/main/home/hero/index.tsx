import React, { useState } from 'react';
import { Suggest, ItemRenderer } from '@blueprintjs/select';
import { MenuItem, Icon } from '@blueprintjs/core';
import { ITopic, IStore } from '../../../../../state-management/models';
import { filterTopic, areTopicsEqual } from '../../../../../state-management/utils';
import { connect } from 'react-redux';

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
      />
  );
};
const Hero = (props: { topics: Array<ITopic>}) => {
  const { topics } = props;
  const [componentTopics, setTopics] = useState(topics);
  const inputProps = {
    placeholder: 'Type a topic...',
    rightElement: <Icon icon='search' />,
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
          <p className='heroDescription'>Search a topic you want to learn, and we will show you books that have taught others the same thing.</p>
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
                const newTopic: ITopic = {
                  _id: `${new Date().getTime()}`,
                  active: true,
                  similar: [],
                  name: query,
                  description: 'this is a whole lot of stuff'
                }
                return <MenuItem
                  icon='add'
                  text={`Add topic: '${query}'`}
                  active={active}
                  onClick={() => setTopics(componentTopics.concat(newTopic))}
                  shouldDismissPopover={false}
                />
              }}
            />
          </div>
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
