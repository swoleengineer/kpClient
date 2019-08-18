import React, { useState } from 'react';
import { Card, FormGroup, InputGroup, Button, ButtonGroup } from '@blueprintjs/core';
import { has } from 'lodash';
import { getFormProps } from '../../auth/util';
import { IExpandedBook } from '../../../../state-management/models';
import { keenToaster } from '../../../../containers/switcher';

interface IFormProps {
  saveEdit: Function;
  cancelEdit: Function;
  book: IExpandedBook;
}
const EditBook = ({ book, cancelEdit, saveEdit }: IFormProps) => {
  if (!book) {
    return null;
  }
  const { affiliate_link, amazon_link, _id } = book;
  const [formErrors, updateError] = useState<Array<{field: string; message: string; intent: 'danger' | 'none' | 'primary' | 'success'}>>([])
  const [formData, formUpdate] = useState({ amazon_link, affiliate_link });
  const updateDetails = data => {
    const keys = Object.keys(has(data, 'profile') ? data.profile : data)
    updateError(formErrors.filter(error => !keys.includes(error.field)));
    formUpdate({ ...formData, ...data });
  }
  const updateErrors = error => updateError(formErrors.concat(error));
  const processField = e => {
    const field = e.target.id;
    const value = e.target.value;
    if (!value) {
      updateErrors({
        field,
        message: 'This field cannot be empty.',
        intent: 'danger'
      });
      return;
    }
    updateDetails({ [field]: value });
  }
  const getErr = id => formErrors.find(err => err.field === id) || {
    field: id,
    message: null,
    intent: 'none'
  };
  const getProps = getFormProps(getErr, processField, true);
  const processForm = () => {
    if (formErrors.length) {
      keenToaster.show({
        message: 'Please correct your errors before submitting the form.',
        intent: 'danger',
        icon: 'error'
      });
      return;
    };
    saveEdit(_id, formData);
    cancelEdit();
  }
  return (
    <Card className='editBookFormWrapper'>
      <div className='row'>
        <div className='col-md-12'>
          <FormGroup
            {...getProps('amazon_link', <span className='bp3-icon'><i className='fab fa-amazon'/></span>, 'Enter Amazon Url', 'Amazon Link').formGroup}
          >
            <InputGroup
              {...getProps('amazon_link', <span className='bp3-icon'><i className='fab fa-amazon'/></span>, 'Enter Amazon Url', 'Amazon Link').inputGroup}
              value={formData.amazon_link}
            />
          </FormGroup>
        </div>
      </div>
      <div className='row'>
        <div className='col-md-12'>
          <FormGroup
            {...getProps('affiliate_link', <span className='bp3-icon'><i className='fas fa-shopping-cart'/></span>, 'Enter Affiliate Link', 'Affiliate Link').formGroup}
          >
            <InputGroup
              {...getProps('affiliate_link', <span className='bp3-icon'><i className='fas fa-shopping-cart'/></span>, 'Enter Affiliate Link', 'Affiliate Link').inputGroup}
              value={formData.affiliate_link}
            />
          </FormGroup>
        </div>
      </div>
      <div className='row'>
        <div className='col-12 text-right'>
          <ButtonGroup>
            <Button
              text='Cancel'
              icon='undo'
              onClick={() => cancelEdit()}
            />
            <Button
              text='Save'
              intent='primary'
              icon='floppy-disk'
              onClick={() => processForm()}
            />
          </ButtonGroup>
        </div>
      </div>
    </Card>
  )
}

export default EditBook;
