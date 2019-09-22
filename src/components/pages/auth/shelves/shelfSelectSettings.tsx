import React from 'react';
import { IShelfDetail } from '../../../../state-management/models';
import { MenuItem } from '@blueprintjs/core';
import Icon from '../../../icons';

const filterShelf = (query: string, shelf: IShelfDetail, i, exactMatch) => {
  const { title } = shelf;
  const normalizedTitle = title.toLowerCase();
  const normalizedQuery = query.toLowerCase();
  if (exactMatch) {
    return normalizedQuery === normalizedTitle;
  } else {
    return normalizedTitle.includes(normalizedQuery);
  }
}

const renderShelf = (shelf: IShelfDetail, { handleClick, modifiers, query }) => {
  if (!modifiers.matchesPredicate) {
    return null;
  }
  const { title, id, books = 0 } = shelf;
  return (
    <MenuItem
      icon={<span className='bp3-icon'><Icon icon='fa-books' /></span>}
      active={modifiers.active}
      disabled={modifiers.disabled}
      key={id}
      onClick={handleClick}
      text={title}
      labelElement={<span>{books}</span>}
    />
  );
}

export const shelfSelectProps = {
  filterable: true,
  itemPredicate: filterShelf,
  itemRenderer: renderShelf,
  items: [],
  createdItems: [],
  hasInitialContent: false,
  resetOnClose: false,
  resetOnQuery: true,
  resetOnSelect: false,
  noResults: (
    <MenuItem
      icon={<span className='bp3-icon'><Icon icon='fa-empty-set' /></span>}
      disabled={true}
      text='No results.'
    />
    )
}
