import React, { useState } from 'react';
import { FormGroup, InputGroup, Button } from '@blueprintjs/core';
import '../../auth/auth.css';
import { register } from '../../../../state-management/thunks'
import { has } from 'lodash';
import { keenToaster } from '../../../../containers/switcher';

const RegisterPage = () => {
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
  const [formErrors, updateError] = useState([])
  const [confirmPass, setConfirm] = useState('');
  const updateDetails = data => formUpdate({
    ...formData,
    ...(has(data, 'profile') ? {
      profile: {
        ...formData.profile,
        ...data.profile
      }
    } : data)
  });
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
    register(formData).catch(() => keenToaster.show({
      message: 'An error has occured',
      intent: 'danger',
      icon: 'error'
    }))
  }
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
    if (field.endsWith('name')) {
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
            intent={getError('first_name').intent as 'danger' | 'none'}
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
            intent={getError('last_name').intent as 'danger' | 'none'}
          >
            <InputGroup
              id='last_name'
              placeholder='Last Name'
              onBlur={processField}
              intent={getError('last_name').intent as 'danger' | 'none'}
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
            intent={getError('username').intent as 'danger' | 'none'}
          >
            <InputGroup
              leftIcon={getError('username').message ? 'error' : 'id-number'}
              id='username'
              placeholder='Userame'
              onBlur={processField}
              intent={getError('username').intent as 'danger' | 'none'}
            />
          </FormGroup>
        </div>
        <div className='col-md-6'>
          <FormGroup
            helperText={getError('email').message}
            label='Email'
            labelFor='email'
          >
            <InputGroup
              leftIcon='envelope'
              id='email'
              placeholder='Email Address'
              onBlur={processField}
            />
          </FormGroup>
        </div>
      </div>
      <div className='row'>
        <div className='col-md-6'>
          <FormGroup
            helperText={null}
            label='Password'
            labelFor='password'
          >
            <InputGroup
              leftIcon='lock'
              id='password'
              placeholder='Password'
              type='password'
              onBlur={processField}
            />
          </FormGroup>
        </div>
        <div className='col-md-6'>
          <FormGroup
            helperText={null}
            label='Confirm Password'
            labelFor='confirm_Input'
          >
            <InputGroup
              leftIcon='lock'
              id='confirm_Input'
              placeholder='Confirm Password'
              type='password'
              onChange={e => setConfirm(e.target.value)}
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
      />
    </div>
  )
}

export default RegisterPage;
