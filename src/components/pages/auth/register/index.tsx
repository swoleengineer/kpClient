import React, { useState } from 'react';
import { FormGroup, InputGroup, Button } from '@blueprintjs/core';
import '../../auth/auth.css';
import { register } from '../../../../state-management/thunks'
import { has } from 'lodash';
import { keenToaster } from '../../../../containers/switcher';
import { validateEmail, validatePassword } from './validations';

const RegisterPage = (props: {
  goToNext: boolean;
  nextPayload?: {
    type: string;
    payload?: any;
  }
}) => {
  const { goToNext, nextPayload = undefined } = props;
  const [formData, formUpdate] = useState({
    profile: {
      first_name: '',
      last_name: '',
      picture: {}
    },
    email: '',
    password: '',
    username: ''
  });
  const [formErrors, updateError] = useState<Array<{field: string; message: string; intent: 'danger' | 'none' | 'primary' | 'success'}>>([])
  const [confirmPass, setConfirm] = useState<string>('');
  const updateDetails = data => {
    const keys = Object.keys(has(data, 'profile') ? data.profile : data)
    updateError(formErrors.filter(error => !keys.includes(error.field)));
    formUpdate({
      ...formData,
      ...(has(data, 'profile') ? {
        profile: {
          ...formData.profile,
          ...data.profile
        }
      } : data)
    });
  }
  const updateErrors = error => updateError(formErrors.concat(error));
  const processForm = () => {
    if (confirmPass !== formData.password) {
      updateErrors({
        field: 'confirm_Input',
        message: 'Your passwords must match',
        intent: 'danger'
      });
      return;
    }
    Object.keys(formData).map(field => {
      const errMessage = 'This field cannot be blank.'
      if (field === 'profile') {
        Object.keys(formData.profile).map(line => {
          if (!formData.profile[line]) {
            updateErrors({
              field: line,
              message : errMessage,
              intent: 'danger'
            })
          }
          return line;
        });
        return field;
      }
      if (!formData[field]) {
        console.log(field, 'is blank', formData)
        updateErrors({
          field,
          message: errMessage,
          intent: 'danger'
        });
      }
      return field;
    });
    if (formErrors.length) {
      keenToaster.show({
        message: 'Please correct your errors before submitting the form.',
        intent: 'danger',
        icon: 'error'
      });
      return;
    };
    register(formData, goToNext, nextPayload).catch(() => keenToaster.show({
      message: 'An error has occured',
      intent: 'danger',
      icon: 'error'
    }))
  }
  const processField = e => {
    const field = e.target.id;
    const value = e.target.value;
    if (!value) {
      console.log('no value for field:', field, value)
      updateErrors({
        field,
        message: 'This field cannot be empty.',
        intent: 'danger'
      });
      return;
    }
    if (field === 'email' && !validateEmail(value)) {
      updateErrors({
        field,
        message: 'Please enter a valid email address.',
        intent: 'danger'
      });
      return;
    }
    if (field === 'password' && !validatePassword(value)) {
      updateErrors({
        field,
        message: 'Password must be 8 or more characters and include one of each (lowercase letter, uppercase letter, number, and special character)',
        intent: 'danger'
      });
      return;
    }
    if (field === 'confirm_Input') {
      if (value !== formData.password) {
        updateErrors({
          field,
          message: 'The passwords must match.',
          intent: 'danger'
        });
        return;
      }
      updateError(formErrors.filter(error => error.field !== field));
      setConfirm(value);
      return;
    }
    if (field.endsWith('name') && field !== 'username') {
      updateDetails({
        profile: { [field]: value }
      });
      return;
    }
    updateDetails({ [field]: value });
  }
  const getError = field => formErrors.find(error => error.field === field) || {
    intent: 'none',
    message: null,
    field
  }
  return (
    <div>
      <div className='row'>
        <div className='col-md-6'>
          <FormGroup
            helperText={getError('first_name').message}
            label='First Name'
            labelFor='first_name'
            intent={getError('first_name').intent}
          >
            <InputGroup
              leftIcon={getError('first_name').message ? 'error' : 'user'}
              id='first_name'
              placeholder='First Name'
              onBlur={processField}
              intent={getError('first_name').intent}
            />
          </FormGroup>
        </div>
        <div className='col-md-6'>
          <FormGroup
            helperText={getError('last_name').message}
            label='Last Name'
            labelFor='last_name'
            intent={getError('last_name').intent}
          >
            <InputGroup
              id='last_name'
              placeholder='Last Name'
              onBlur={processField}
              intent={getError('last_name').intent}
            />
          </FormGroup>
        </div>
      </div>
      <div className='row'>
        <div className='col-md-6'>
          <FormGroup
            helperText={getError('username').message}
            label='Username'
            labelFor='username'
            intent={getError('username').intent}
          >
            <InputGroup
              leftIcon={getError('username').message ? 'error' : 'id-number'}
              id='username'
              placeholder='Userame'
              onBlur={processField}
              intent={getError('username').intent}
            />
          </FormGroup>
        </div>
        <div className='col-md-6'>
          <FormGroup
            helperText={getError('email').message}
            label='Email'
            labelFor='email'
            intent={getError('email').intent}
          >
            <InputGroup
              leftIcon={getError('email').message ? 'error' : 'envelope'}
              id='email'
              placeholder='Email Address'
              onBlur={processField}
              intent={getError('email').intent}
            />
          </FormGroup>
        </div>
      </div>
      <div className='row'>
        <div className='col-md-6'>
          <FormGroup
            helperText={getError('password').message}
            label='Password'
            labelFor='password'
            intent={getError('password').intent}
          >
            <InputGroup
              leftIcon={getError('password').message ? 'error' : 'lock'}
              id='password'
              placeholder='Password'
              type='password'
              onBlur={processField}
              intent={getError('password').intent}
            />
          </FormGroup>
        </div>
        <div className='col-md-6'>
          <FormGroup
            helperText={getError('confirm_Input').message}
            label='Confirm Password'
            labelFor='confirm_Input'
            intent={getError('confirm_Input').intent}
          >
            <InputGroup
              leftIcon={getError('confirm_Input').message ? 'error' : 'lock'}
              id='confirm_Input'
              placeholder='Confirm Password'
              type='password'
              onBlur={processField}
              intent={getError('confirm_Input').intent}
            />
          </FormGroup>
        </div>
      </div>
      <br/>
      <Button
        text='Create Account'
        fill={true}
        rightIcon='chevron-right'
        minimal={true} 
        onClick={() => processForm()}
        disabled={formErrors.length > 0}
      />
    </div>
  )
}

export default RegisterPage;
