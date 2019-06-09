import React, { useState } from 'react';
import { keenToaster } from '../../../../containers/switcher';
import { FormGroup, InputGroup, Button, Collapse } from '@blueprintjs/core';
import '../../auth/auth.css';
import { submitForgotPass } from '../../../../state-management/thunks';
import { getFormProps } from '../util';
import { validateEmail } from '../register/validations'
const Forgot = (props: {
  goToNext: boolean;
  nextPayload?: {
    type: string;
    payload?: any;
  }
}) => {
  const [formErrors, updateErrors] = useState<Array<{ field: string; message: string; intent: 'danger' | 'none' }>>([]);
  const [formData, updateField] = useState<{ email: string}>({
    email: ''
  });
  const [displayMessage, updateMessage] = useState<string>('')
  const [formComplete, updateStatus] = useState<boolean>(false);
  const processField = e => {
    const field = e.target.id;
    const value = e.target.value;
    if (!value) {
      updateErrors(formErrors.concat({
        field,
        message: 'This field is required.',
        intent: 'danger'
      }));
      return;
    }
    updateErrors(formErrors.filter(error => error.field !== field));
    updateField({ ...formData, [field]: value });
  }
  const getErr = id => formErrors.find(err => err.field === id) || {
    field: id,
    message: null,
    intent: 'none'
  };
  const getProps = getFormProps(getErr, processField);
  const processForm = () => {
    if (formErrors.length) {
      keenToaster.show({
        message: 'Please resolve form errors before submitting.',
        intent: 'danger',
        icon: 'error'
      });
      return;
    }
    if (!validateEmail(formData.email)) {
      updateErrors(formErrors.concat({
        field: 'email',
        message: 'Please enter a valid email address.',
        intent: 'danger'
      }));
      return;
    }
    submitForgotPass(formData).then(
      result => updateMessage(result),
      err => updateMessage(err)
    ).then(() => updateStatus(true))
    .catch(() => updateMessage('Error submitting this form. please try again later.'))
  }
  return (
    <div>
      <Collapse isOpen={formComplete}>
        <div className='row'>
          <div className='col-12'>
            <p className='lead'>{displayMessage}</p>
          </div>
        </div>
      </Collapse>
      <Collapse isOpen={!formComplete}>
        <div className='row'>
          <div className='col-12'>
            <FormGroup
              {...getProps('email', 'envelope', 'Enter Email address', 'Email Address').formGroup}
            >
              <InputGroup
                {...getProps('email', 'envelope', 'Enter Email address', 'Email').inputGroup}
                large={true}
                onChange={processField}
              />
            </FormGroup>
          </div>
        </div>
        <br />
        <div className='row'>
          <div className='col-12'>
            <Button
              text='Get Reset Token'
              fill={true}
              rightIcon='chevron-right'
              minimal={true}
              onClick={() => processForm()}
              disabled={formErrors.length > 0}
            />
          </div>
        </div>
      </Collapse>
    </div>
  )
}

export default Forgot;
