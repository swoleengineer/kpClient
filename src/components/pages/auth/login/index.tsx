import React, { useState } from 'react';
import { FormGroup, InputGroup, Button } from '@blueprintjs/core';
import '../../auth/auth.css';
import { IUserLoginRequest } from '../../../../state-management/models';
import { keenToaster } from '../../../../containers/switcher';
import { login } from '../../../../state-management/thunks'

const LoginPage = (props: {
  goToNext: boolean;
  nextPayload?: {
    type: string;
    payload?: any;
  };
  callBack?: Function;
}) => {
  const { goToNext, nextPayload = undefined, callBack = undefined } = props;
  const [formData, formUpdate] = useState<IUserLoginRequest>({
    account: '',
    password: ''
  });
  const [formErrors, updateErrors] = useState({
    account: null,
    password: null
  })
  const updateData = (data, error: boolean = false) => {
    if (error) {
      updateErrors({
        ...formErrors,
        ...data
      });
      return;
    }
    for (let key in data) {
      updateErrors({
        ...formErrors,
        [key]: null
      });
      formUpdate({
        ...formData,
        [key]: data[key]
      })
      key = '';
    }
  }
  const submitForm = () => {
    for (let key in formData) {
      if (!formData[key] || !formData[key].length) {
        updateData({
          [key]: 'This field must be filled in.'
        }, true);
        key = ''
      }
    };
    if (Object.keys(formErrors).filter(key => formErrors[key] && formErrors[key] !== null).length) {
      // there are errors to be fixed before submitting
      keenToaster.show({
        message: 'Please fix your form errors before submitting.',
        intent: 'danger',
        icon: 'error'
      });
      return;
    }
    login(formData, goToNext, nextPayload)
    .then(() => {
      if (callBack && typeof callBack === 'function') {
        callBack();
      }
    })
    .catch(() => keenToaster.show({
      message: 'An error has occured.',
      intent: 'danger',
      icon: 'error'
    }))
  }
  return (
    <div>
      <div>
        <FormGroup
          helperText={formErrors.account}
          label='Email/Username'
          labelFor='account'
          intent={formErrors.account ? 'danger' : 'none'}
        >
          <InputGroup
            id='account'
            placeholder='Email or Username'
            leftIcon={formErrors.account ? 'error' : 'user'}
            intent={formErrors.account ? 'danger' : 'none'}
            onKeyUp={$event => {
              if ($event.keyCode === 13) {
                submitForm()
              }
            }}
            large={true}
            onChange={e => {
              const value = e.target.value;
              if (!value) {
                updateData({
                  account: 'Please enter an email or username.'
                }, true);
                return;
              }
              updateData({ account: value });
            }}
            onBlur={e => {
              const value = e.target.value;
              if (!value) {
                updateData({
                  account: 'Please enter an email or username.'
                }, true);
                return;
              }
              updateData({ account: value });
            }}
          />
        </FormGroup>
        <FormGroup
          helperText={formErrors.password}
          label='Password'
          labelFor='password'
          intent={formErrors.password ? 'danger' : 'none'}
        >
          <InputGroup
            id='password'
            large={true}
            placeholder='Password'
            leftIcon={formErrors.password ? 'error' : 'lock'}
            type='password'
            intent={formErrors.password ? 'danger' : 'none'}
            onChange={e => {
              const value = e.target.value;
              if (!value) {
                updateData({
                  password: 'password required'
                }, true);
                return;
              }
              updateData({
                password: value
              })
            }}
            onKeyUp={$event => {
              if ($event.keyCode === 13) {
                // submitForm()
              }
            }}
            onBlur={e => {
              const value = e.target.value;
              if (!value) {
                updateData({
                  password: 'password required'
                }, true);
                return;
              }
              updateData({
                password: value
              })
            }}
          />
        </FormGroup>
        <br/>
        <Button
          text='Login'
          fill={true}
          rightIcon='chevron-right'
          minimal={true} 
          onClick={() => submitForm()}
          large={true}
        />
      </div>
    </div>
  )
}

export default LoginPage;
