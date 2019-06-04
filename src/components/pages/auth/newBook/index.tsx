import React, { useState } from 'react';
import { InputGroup, FormGroup, MenuItem } from '@blueprintjs/core';
import '../../auth/auth.css';
// import { keenToaster } from '../../../../containers/switcher';
import { IBookRequest, IStore, IExpandedBook, IAuthor, ITopic  } from '../../../../state-management/models';
import { connect } from 'react-redux';
import { bookActionTypes as types } from '../../../../state-management/actions/book.actions';
import { Suggest, ItemRenderer } from '@blueprintjs/select';
import { authorSettings } from './dropdownSettings';


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
    // goToNext, nextPayload = undefined, books = [], newBook, topics,
    updateField, authors } = props;
  const [formErrors, updateErrors] = useState<Array<{ field: string; message: string; intent: 'danger' | 'none' | 'primary' | 'success' }>>([]);
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
    updateErrors(formErrors.filter(error => error.field !== field));
    updateField({ [field]: value });
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
