import React, { useState } from 'react';
import { validatePassword } from '../register/validations';
import { submitResetPass } from '../../../../state-management/thunks';
import { getFormProps } from '../util';
import '../../auth/auth.css';
import { keenToaster } from '../../../../containers/switcher';
import { FormGroup, InputGroup, Button } from '@blueprintjs/core';

const ResetPw = (props: {
  goToNext: boolean;
  nextPayload?: {
    type: string;
    payload?: any;
  }
}) => {
  const { goToNext, nextPayload = undefined } = props;
  const [formErrors, updateErrors] = useState<Array<{ field: string; message: string; intent: 'danger' | 'none' }>>([]);
  const [formData, updateField] = useState<{ password: string, confirm: string }>({
    password: '',
    confirm: ''
  });
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
    if (field === 'password' && !validatePassword(value)) {
      updateErrors(formErrors.concat({
        field,
        message: 'Password must be 8 or more characters and include one of each (lowercase letter, uppercase letter, number, and special character)',
        intent: 'danger'
      }));
      return;
    }
    if (field === 'confirm' && formData.password !== value) {
      updateErrors(formErrors.concat({
        field,
        message: 'Passwords must match.',
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
        icon: 'error'
      });
      return;
    }

    if (!validatePassword(formData.password)) {
      updateErrors(formErrors.concat({
        field: 'password',
        message: 'Password must be 8 or more characters and include one of each (lowercase letter, uppercase letter, number, and special character)',
        intent: 'danger'
      }));
      return;
    }
    if (formData.password !== formData.confirm) {
      updateErrors(formErrors.concat({
        field: 'confirm',
        message: 'Passwords must match.',
        intent: 'danger'
      }));
      return;
    }
    submitResetPass({ password: formData.password }, goToNext, nextPayload).then(
      () => updateStatus(true),
      () => updateStatus(false)
    )
  }
  return (
    <div>
      <div className='row'>
        <div className='col-12'>
          <FormGroup
            {...getProps('password', 'lock', 'Enter New password', 'Password').formGroup}
          >
            <InputGroup
              {...getProps('password', 'lock', 'Enter New password', 'Password').inputGroup}
              type='password'
            />
          </FormGroup>
        </div>
      </div>
      <div className='row'>
        <div className='col-12'>
          <FormGroup
            {...getProps('confirm', 'unlock', 'Enter Password again', 'Confirm').formGroup}
          >
            <InputGroup
              {...getProps('confirm', 'unlock', 'Enter Password again', 'Confirm').inputGroup}
              type='password'
            />
          </FormGroup>
        </div>
      </div>
      <br />
      <Button
        text='Reset Password'
        fill={true}
        rightIcon='chevron-right'
        minimal={true}
        onClick={() => processForm()}
        disabled={formErrors.length > 0 && !formComplete}
      />
    </div>
  )
}

export default ResetPw;
