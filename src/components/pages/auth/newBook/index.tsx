import React, { useState } from 'react';
import { InputGroup, FormGroup, MenuItem, Tag, Collapse, Button } from '@blueprintjs/core';
import '../../auth/auth.css';
import { keenToaster } from '../../../../containers/switcher';
import { IBookRequest, IStore, IExpandedBook, IAuthor, ITopic, IBook  } from '../../../../state-management/models';
import { connect } from 'react-redux';
import { bookActionTypes as types } from '../../../../state-management/actions/book.actions';
import { Suggest, ItemRenderer } from '@blueprintjs/select';
import { authorSettings } from './dropdownSettings';
import TopicBrowse from '../topic/topicBrowse';
import Book from '../../../book';
import { createBook } from '../../../../state-management/thunks'


const AuthorSuggest = Suggest.ofType<IAuthor>();

const renderAuthor: ItemRenderer<IAuthor> = (author, { handleClick, modifiers, query }) => {
  if (!modifiers.matchesPredicate) {
    return null;
  }
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      label={author.name}
      key={author._id}
      onClick={() => console.log('clicked on an author')}
      text={author.name}
    />
  )
}
const NewBookPage = (props: {
  goToNext: boolean;
  nextPayload?: {
    type: string;
    payload?: any;
  };
  books: IExpandedBook[];
  newBook: IBookRequest;
  authors: IAuthor[];
  topics: ITopic[];
  updateField: Function
}) => {
  const {
    goToNext, nextPayload = undefined,
    updateField, authors, newBook } = props;
  const [formErrors, updateErrors] = useState<Array<{ field: string; message: string; intent: 'danger' | 'none' | 'primary' | 'success' }>>([]);
  const [topics, updateTopics] = useState<Array<ITopic>>([]);
  const [formComplete, updateStatus] = useState(false);
  const [finalBook, updateFinal] = useState<IBookRequest | IBook>(newBook);
  const processField = e => {
    const field = e.target.id;
    const value = e.target.value;
    if (!value) {
      updateErrors(formErrors.concat({
        field,
        message: 'Please enter a value for this field.',
        intent: 'danger'
      }));
      return;
    }
    if (field === 'topics') {
      console.log('adding ', value, topics)
      const newTopics = topics.filter(topic => topic._id !== value._id).concat(value);
      updateTopics(newTopics);
      updateErrors(formErrors.filter(error => error.field !== field));
      updateField({ [field]: newTopics });
      return;
    }
    updateErrors(formErrors.filter(error => error.field !== field));
    updateField({ [field]: value });
  }
  const processForm = () => {
    if (formErrors.length) {
      keenToaster.show({
        message: 'Please resolve form errors before submitting.',
        intent: 'danger',
        icon: 'error'
      })
      return;
    }
    
    createBook(newBook, goToNext, nextPayload)
    .then((updatedBook) => {
      updateFinal(updatedBook);
      updateStatus(true);
    })
    .catch(() => {
      keenToaster.show({
        message: 'Could not create book.',
        intent: 'danger',
        icon: 'error'
      });
    })
  }
  const getErr = id => formErrors.find(err => err.field === id) || {
    field: id,
    message: null,
    intent: 'none'
  }
  const getProps = (id, icon, placeholder, label) => ({
    formGroup: {
      helperText: getErr(id).message,
      label,
      labelFor: id,
      intent: getErr(id).intent
    },
    inputGroup: {
      leftIcon: getErr(id).message ? 'error' : icon,
      placeholder,
      id,
      intent: getErr(id).intent,
      onBlur: processField
    }
  })
  return (
    <div>
      <Collapse isOpen={!formComplete}>
        <div className='row'>
          <div className='col-12'>
            <FormGroup
              {...getProps('title', 'book', 'Book Title', 'Book Title').formGroup}
            >
              <InputGroup
                {...getProps('title', 'book', 'Book Title', 'Book Title').inputGroup}
                large={true}
              />
            </FormGroup>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-6'>
            <FormGroup
              {...getProps('isbn', null, 'Enter unique ISBN', 'ISBN').formGroup}
            >
              <InputGroup
                {...getProps('isbn', null, 'Enter unique ISBN', 'ISBN').inputGroup}
              />
            </FormGroup>
          </div>
          <div className='col-md-6'>
            <FormGroup
              {...getProps('writer', 'user', 'Search or add Author', 'Author').formGroup}
            >
              <AuthorSuggest
                className='newBookSearch'
                {...authorSettings}
                items={authors}
                itemRenderer={renderAuthor}
                inputValueRenderer={author => author.name}
                onItemSelect={author => console.log('author selected', author)}
              />
            </FormGroup>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <FormGroup
              {...getProps('amazon_link', <span className='bp3-icon'><i className='fab fa-amazon'/></span>, 'Paste Amazon link...', 'Amazon Link').formGroup}
            >
              <InputGroup
                {...getProps('amazon_link', <span className='bp3-icon'><i className='fab fa-amazon' /></span>, 'Paste Amazon link...', 'Amazon Link').inputGroup}
                large={true}
              />
            </FormGroup>
          </div>
        </div>
        <span>{newBook.topics.length} Topic{newBook.topics.length > 1 ? 's' : ''}</span>
        <div className='row'>
          {newBook.topics.length > 0 && <div className='col-12 newQuestionTagsContainer'>
            <div className='clearfix'>
              {newBook.topics
                .map((topic: ITopic) =>
                  <Tag
                    icon='lightbulb' 
                    key={topic._id}
                    style={{ 
                      marginRight: '10px',
                      marginBottom: '10px'
                      }}
                  >
                    {topic.name}
                  </Tag>
                )}
            </div>
          </div>}
          <div className='col-12'>
            <TopicBrowse
              processNewItem={(value, event) => {
                const target = { id: 'topics', value };
                processField({ target, event });
              }}
              processRemove={(a, b) => console.log('removed', a, b)}
            />
          </div>
        </div>
        <br />
        <div className='row'>
          <div className='col-12'>
            <Button
              text='Add book'
              fill={true}
              rightIcon='chevron-right'
              minimal={true}
              onClick={() => processForm()}
              disabled={formErrors.length > 0}
            />
          </div>
        </div>
      </Collapse>
      <Collapse isOpen={formComplete}><Book book={finalBook} /></Collapse>
    </div>
  )
}

const mapStateToProps = (state: IStore) => ({
  books: state.book.books,
  newBook: state.book.newBook,
  authors: state.author.authors,
  topics: state.topic.allTopics
})

const mapDispatch = dispatch => ({
  updateField: (payload: {[field: string]: any}) => dispatch({ type: types.updateNewBook, payload })
})


export default connect(mapStateToProps, mapDispatch)(NewBookPage);
