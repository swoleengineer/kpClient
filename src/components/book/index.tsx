import React from 'react';
import './book.css';
import Link from 'redux-first-router-link';
import { Icon, Tooltip, Menu, MenuItem, Popover } from '@blueprintjs/core';
import { IAuthor, IExpandedBook } from 'src/state-management/models';

const Book = ({ book }: { book: IExpandedBook }) => {
  const { title, author } = book;
  const { name: authorName } = author as IAuthor;
  return (
    <div className='singleBookWrapper'>
      <div className='bookPicture' style={{backgroundImage: `url('http://inspiredwomenamazinglives.com/wp-content/uploads/2018/12/Becoming-Michelle-Obama.jpg')`}}>
        <Link className='bookLink' to={{ type: 'HOME' }} />
        <span className='bookMark'>
          <Icon icon='bookmark' iconSize={40} />
        </span>
        <div className='topicsMeta'>
          <span><Icon icon='lightbulb' iconSize={11} /> 3 Topics</span>
        </div>
        <div className='bookMenu'>
          <div className='bookMenu_item'>
            <Tooltip content='Save Book'>
              <span><Icon icon='add-to-artifact' iconSize={12} /></span>
            </Tooltip>
          </div>
          <div className='bookMenu_item'>
            <Tooltip content='View book'>
              <span><Icon icon='share' iconSize={12} /></span>
            </Tooltip>
          </div>
          <div className='bookMenu_item'>
            <Popover>
              <Tooltip content='More...'>
                <span><Icon icon='more' iconSize={12} /></span>
              </Tooltip>
              <Menu>
                <MenuItem icon='social-media' text='Share' />
                <MenuItem icon='bookmark' text='Mark as read' />
                <Menu.Divider />
                <MenuItem icon='shopping-cart' text='Purchase' labelElement={<Icon icon='share' />}/>
                <Menu.Divider />
                <MenuItem icon='flag' text='Report book' />
              </Menu>
            </Popover>
            
          </div>
        </div>
      </div>
      <span className='bookTitle'>{title}</span>
      <span className='bookAuthor'>{authorName}</span>
    </div>
  );
}

export default Book
