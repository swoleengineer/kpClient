import React, { useState } from 'react';
import './book.css';
import Link from 'redux-first-router-link';
import { Icon, Tooltip, Menu, MenuItem, Popover, Tag } from '@blueprintjs/core';
import { IAuthor, IExpandedBook, IBookRequest } from 'src/state-management/models';
import Slider from 'react-slick';

const Book = ({ book }: { book: IExpandedBook | IBookRequest}) => {
  const { title, author, pictures } = book;
  const { name: authorName } = author as IAuthor;
  const [ picture = { link: undefined}] = pictures
  const [isRead, setRead] = useState(false);
  const [isLiked, setLiked] = useState(false)
  return (
    <div className='singleBookWrapper'>
      <div className='bookPicture' style={{backgroundImage: `url(${picture.link || 'http://inspiredwomenamazinglives.com/wp-content/uploads/2018/12/Becoming-Michelle-Obama.jpg'})`}}>
        <Link className='bookLink' to={{ type: 'HOME' }} />
        {isRead && <span className='bookMark'><Icon icon='bookmark' iconSize={40} /></span>}
        <div className='topicsMeta'>

            <Slider
              dots={false}
              infinite={true}
              speed={500}
              slidesToShow={3}
              slidesToScroll={2}
              arrows={false}
              variableWidth={true}
              autoplay={true}
              autoplaySpeed={1500}
            >
              <Tag icon='lightbulb' minimal={false}>Entrepreneur</Tag>
              <span> &nbsp;&nbsp;</span>
              <Tag icon='lightbulb' minimal={false}>Leadership</Tag>
              <span> &nbsp;&nbsp;</span>
              <Tag icon='lightbulb' minimal={false}>Headphones</Tag>
              <span> &nbsp;&nbsp;</span>
              <Tag icon='lightbulb' minimal={false}>Programming</Tag>
              <span> &nbsp;&nbsp;</span>
              
            </Slider>

        </div>
        <div className='bookMenu'>
          <div className='bookMenu_item' onClick={() => setLiked(!isLiked)}>
            <Tooltip content='Save Book'>
              <span >
                <Icon
                  icon='heart'
                  iconSize={12}
                  style={{ color: isLiked ? 'white' : 'rgba(167, 182, 194, 0.85)' }}
                />
              </span>
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
                <MenuItem
                  icon='social-media'
                  text='Share'
                  
                />
                <MenuItem icon='bookmark' text='Mark as read' onClick={() => setRead(!isRead)} />
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
