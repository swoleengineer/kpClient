import React, { createRef } from 'react';
import { ITopic, IStore } from '../../../../state-management/models';
import { MenuItem, ITagProps, Button } from '@blueprintjs/core';
import { ItemRenderer, MultiSelect, ItemPredicate } from '@blueprintjs/select';
import { connect } from 'react-redux';
import '../auth.css';
import Icon from '../../../icons';

const TopicMultiSelect = MultiSelect.ofType<ITopic>();
const TopicBrowse = (props: {
  topics: ITopic[];
  processNewItem: Function;
  processRemove: Function;
  large?: boolean;
  showButton?: boolean;
  btnClick?: Function;
  btnText?: any; 
  minimal?: boolean;
  placeholder?: string;
  autoOpen?: boolean;
}) => {
  const { autoOpen = false, placeholder = 'Search for topics to add.', minimal = false, topics, processNewItem, processRemove, large = !props.minimal, showButton = false, btnClick = () => null, btnText = '' } = props;
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
        icon={<i className='fa fa-graduation-cap' style={{ position: 'relative', top: '2px'}}/>}
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
  // let inputRef;
  const topicInputProps = {
    tagProps: (value: string, index: number): ITagProps => ({ icon: 'lightbulb' }),
    onRemove: (tag: string, index: number) => processRemove(tag, index),
    large,
    placeholder,
    inputRef: input => {
      if (autoOpen && input) {
        input.focus();
      }
      // inputRef = input
    }
  }
  const popoverProps = {};
  if (autoOpen) {
    // debugger;
    popoverProps['defaultIsOpen'] = true;
  }
  if (showButton && (btnText || btnText.length) && !minimal) {
    topicInputProps['rightElement'] = (
      <span
        className='kp_input_btn'
        onClick={() => btnClick()}
      >
        {btnText}
      </span>
    );
  }
  if (minimal) {
    topicInputProps['onBlur'] = () => (btnClick || (() => null))();
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
              labelElement={<Icon icon='fa-graduation-cap' />}
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
        popoverProps={popoverProps}
      />
    </div>
  )
}

const mapStateToProps = (state: IStore) => ({
  topics: state.topic.allTopics
});

export default connect(mapStateToProps)(TopicBrowse)
