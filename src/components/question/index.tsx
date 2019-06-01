import React, { useState } from 'react';
import './question.css';
import { Text, Tag, Button, ButtonGroup, ControlGroup, InputGroup, Popover, Menu, MenuItem, Collapse, Icon } from '@blueprintjs/core';
import Slider from 'react-slick';
import { Select, ItemRenderer } from '@blueprintjs/select';
import { filterBook } from '../../state-management/utils/book.util';
import { IExpandedBook } from 'src/state-management/models';


const BookSelect = Select.ofType<IExpandedBook>();
const QuestionCard = (props: { books: IExpandedBook[]; responsive: boolean }) => {
  const [commentOpen, setCommentState] = useState(false);
  const [bookToAdd, setAddingBook] = useState({});
  const { books, responsive } = props;
  const renderBook: ItemRenderer<IExpandedBook> = (book, { handleClick, modifiers, query }) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }
    return (
      <MenuItem
            active={modifiers.active}
            disabled={modifiers.disabled}
            key={book._id}
            icon='book'
            text={<div><strong>{book.title}</strong><br /><small>{book.author.name}</small></div>}
            onClick={() => {
              setAddingBook(book);
              setCommentState(true);
            }}
      />
    )
  }
  const addBookProps = {
    itemPredicate: filterBook,
    itemRenderer: renderBook,
    items: books,
    filterable: true,
    hasInitialContent: false,
    resetOnClose: true,
    resetOnQuery: true,
    resetOnSelect: true
  }
  return (
    <div className={responsive ? 'responsiveQuestion' : ''}>
      <div className='questionCardWrapper'>
        <div className='questionCard_content' style={{ paddingBottom: commentOpen ? '10px' : '0px'}}>
          <div className='questionCard_meta'>
            <span className='questionCard_meta_author'>Posted by: </span> @clervius
            <span className='questionCard_meta_time'>20 hrs. ago</span>
            <span className='questionCard_meta_more'>
              <Popover>
                <Icon icon='more' />
                <Menu>
                  <MenuItem icon='lightbulb' text='Add Topic' />
                  <Menu.Divider />
                  <MenuItem icon='flag' text='Report' />
                </Menu>
              </Popover>  
            </span>
          </div>
          <div className='questionCard_details'>
            <span className='questionCard_details_title'>What book teaches you how to swim?</span>
            <span className='questionCard_details_description'><Text ellipsize={true}>I just want to learn it because the shit is tough you know so let me know which book.</Text></span>
          </div>
          <div className='questionCard_topics'>
            <Slider
              dots={false}
              infinite={false}
              speed={500}
              slidesToShow={3}
              slidesToScroll={1}
              arrows={false}
              variableWidth={true}
            >
              <Tag icon='lightbulb' minimal={false}>Entrepreneur</Tag>
              <span> &nbsp;&nbsp;</span>
              <Tag icon='lightbulb' minimal={false}>Leadership</Tag>
              <span> &nbsp;&nbsp;</span>
              <Tag icon='lightbulb' minimal={false}>Headphones</Tag>
              <span> &nbsp;&nbsp;</span>
              <Tag icon='lightbulb' minimal={false}>Programming</Tag>
            </Slider>
          </div>
          <div className='row'>
            <div className='col-1'>
                <Button icon='book' minimal={true}>5</Button>
            </div>
            <div className='col-11 text-right'>
              <ButtonGroup>
                <BookSelect
                  {...addBookProps}
                  noResults={<MenuItem disabled={true} text='No books.' />}
                  onItemSelect={(item: IExpandedBook) => {
                    console.log('item selected', item)
                    setAddingBook(item);
                    setCommentState(true);
                  }}
                >
                  <Button icon='book' minimal={true} >{Object.keys(bookToAdd).length ? bookToAdd.title : 'Suggest Book'}</Button>
                </BookSelect>
                {commentOpen && <Button
                  icon='cross'
                  minimal={true}
                  onClick={() => {
                    setCommentState(false);
                    setAddingBook({});
                  }}
                />}
              </ButtonGroup>
              
            </div>
          </div>
          <Collapse isOpen={commentOpen} className='questionCard_comment'>
            <ControlGroup fill={true} vertical={false}>
              <InputGroup placeholder='Add optional comment' leftIcon='comment' rightElement={<Button minimal={true} icon='tick' />} />
            </ControlGroup>
          </Collapse>
        </div>
      </div>
    </div>
    
  )
}

export default QuestionCard
