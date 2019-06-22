import React from 'react';
import { ITopic, IStore } from '../../../../state-management/models';
import { MenuItem, Icon, ITagProps } from '@blueprintjs/core';
import { ItemRenderer, MultiSelect, ItemPredicate } from '@blueprintjs/select';
import { connect } from 'react-redux';
import '../auth.css';

const TopicMultiSelect = MultiSelect.ofType<ITopic>();
const TopicBrowse = (props: {
  topics: ITopic[];
  processNewItem: Function;
  processRemove: Function;
}) => {
  const { topics, processNewItem, processRemove } = props;
  const filterTopic: ItemPredicate<ITopic> = (query, topic, _index, exactMatch) => {
    const { name = '', description = '' } = topic
    const normalizedTitle = name.toLowerCase();
    const normalizedDesc = description.toLowerCase();
    const normalizedQuery = query.toLowerCase();
    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return [normalizedTitle, normalizedDesc].some(text => text.includes(normalizedQuery));
    }
  }
  const renderTopic: ItemRenderer<ITopic> = (topic, { handleClick, modifiers, query }) => {
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
        icon='lightbulb'
      />
    )
  }
  const topicSelectProps = {
    itemPredicate: filterTopic,
    itemRenderer: renderTopic,
    items: topics,
    allowCreate: true,
    intent: false,
    openOnKeyDown: false,
    popoverMinimal: false,
    resetOnSelect: true,
    tagMinimal: false,
    placeholder: 'Add topic(s)',
    createdItems: []
  }
  const topicInputProps = {
    tagProps: (value: string, index: number): ITagProps => ({ icon: 'lightbulb' }),
    onRemove: (tag: string, index: number) => processRemove(tag, index),
    large: true,
    placeholder: 'Search for topics to add.'
  }
  return (
    <div className='topicSearchWrapper'>
      <TopicMultiSelect
        {...topicSelectProps}
        createNewItemFromQuery={(name: string): ITopic =>  {
          return {
            name,
            description: name,
            _id: `${topics.length + 1}`,
            active: true,
            similar: []
          }          
        }}
        createNewItemRenderer={(query: string, active: boolean, handleClick: React.MouseEventHandler<HTMLElement>) => {
          return (
            <MenuItem
              icon='add'
              labelElement={<Icon icon='lightbulb' />}
              active={active}
              onClick={handleClick}
              shouldDismissPopover={false}
              text={`Add ${query}...`}
            />
          );
        }}
        tagRenderer={topic => topic.name}
        tagInputProps={topicInputProps}
        onItemSelect={(topic, event) => processNewItem(topic, event)}
      />
    </div>
  )
}

const mapStateToProps = (state: IStore) => ({
  topics: state.topic.allTopics
});

export default connect(mapStateToProps)(TopicBrowse)
