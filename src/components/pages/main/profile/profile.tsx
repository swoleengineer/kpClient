import React, { useState } from 'react';
import { Card, FormGroup, InputGroup, Collapse, Button } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { getFormProps } from '../../auth/util';
import { IStore, IUser } from '../../../../state-management/models';
import { has, isEqual, pick, omit } from 'lodash';
import { keenToaster } from '../../../../containers/switcher';
import { updateAccount } from '../../../../state-management/thunks';

const Profile = (props: {
  user: IUser;
}) => {
  const { user } = props;
  const [accountErrors, updateAccountErrs] = useState<Array<{ field: string; message: string; intent: 'danger' | 'none' }>>([]);
  const [passwordErrors, updatePwErrs] = useState<Array<{ field: string; message: string; intent: 'danger' | 'none' }>>([]);
  const [accountFields, updateAccountFields] = useState({
    'profile.first_name': user.profile.first_name,
    'profile.last_name': user.profile.last_name,
    email: user.email,
    username: user.username
  });
  const [passwordFields, updatePwFields] = useState({
    password: '',
    oldPassword: '',
    confirm: ''
  });
  const [sectionUpdated, updateSection] = useState({
    account: false,
    pw: false
  })

  const processField = (errorUpdater, errorProp, fields, fieldUpdater) => e => {
    const field = e.target.id;
    const value = e.target.value;
    const updatedSection = has(fields, 'password') ? 'pw' : 'account'
    updateSection({
      ...sectionUpdated,
      [updatedSection]: true
    })
    if (!value) {
      errorUpdater(errorProp.concat({
        field,
        message: 'This field is required.',
        intent: 'danger'
      }));
      return;
    }
    
    errorUpdater(errorProp.filter(error => error.field !== field));
    fieldUpdater({ ...fields, [field]: value });
  }
  const getErr = formErrorsProp => id => formErrorsProp.find(err => err.field === id) || {
    field: id,
    message: null,
    intent: 'none'
  };
  const getProps = (errorUpdater, errorProp, fields, fieldUpdater) => getFormProps(getErr(errorProp), processField(errorUpdater, errorProp, fields, fieldUpdater), true);
  console.log(accountFields);
  const submitAccount = () => {
    if (accountErrors.length) {
      keenToaster.show({
        message: 'Please resolve form errors before submitting.',
        intent: 'danger',
        icon: 'error'
      });
      return;
    }
    const payload = {
      profile: {
        first_name: accountFields['profile.first_name'],
        last_name: accountFields['profile.last_name']
      },
      email: accountFields.email,
      username: accountFields.username
    }
    if (isEqual(payload, {
      ...pick(user, ['email', 'username']),
      profile: omit(user.profile, 'picture')
    })) {
      keenToaster.show({ message: 'Nothing has changed.'})
      return;
    }
    updateAccount(user._id, payload)
      .then(() => {
        updateSection({
          ...sectionUpdated,
          account: false
        });
        keenToaster.show({
          message: 'Account updated.'
        });
      })
      .catch(() => updateSection({
        ...sectionUpdated,
        account: false
      }))
  }
  return (
    <div className='row'>
      <div className='col-12'>
        <Card
          elevation={sectionUpdated.account ? 3 : 0}
        >
          <div className='row profile_edit_card'>
            {sectionUpdated.account &&
              <Button 
                minimal={true}
                icon='chevron-up'
                className='profile_edit_card_cancel'
                intent='danger'
                onClick={() => {
                  updateSection({ ...sectionUpdated, account: false });
                  updateAccountFields({
                    'profile.first_name': user.profile.first_name,
                    'profile.last_name': user.profile.last_name,
                    email: user.email,
                    username: user.username
                  });
                  updateAccountErrs([]);
                }}
              />}
            <div className='col-12'>
              <h6>Account Information</h6>
              <div className='row'>
                <div className='col-md-6'>
                  <FormGroup
                    {...getProps(updateAccountErrs, accountErrors, accountFields, updateAccountFields)('profile.first_name', 'user', 'First Name', 'First Name').formGroup}
                  >
                    <InputGroup
                      {...getProps(updateAccountErrs, accountErrors, accountFields, updateAccountFields)('profile.first_name', 'user', 'First Name', 'First Name').inputGroup}
                      value={accountFields['profile.first_name']}
                      large={true}
                    />
                  </FormGroup>
                </div>
                <div className='col-md-6'>
                  <FormGroup
                    {...getProps(updateAccountErrs, accountErrors, accountFields, updateAccountFields)('profile.last_name', null, 'Last Name', 'Last Name').formGroup}
                  >
                    <InputGroup
                      {...getProps(updateAccountErrs, accountErrors, accountFields, updateAccountFields)('profile.last_name', null, 'Last Name', 'Last Name').inputGroup}
                      value={accountFields['profile.last_name']}
                      large={true}
                    />
                  </FormGroup>
                </div>
              </div>
              <div className='row'>
                <div className='col-md-5'>
                  <FormGroup
                    {...getProps(updateAccountErrs, accountErrors, accountFields, updateAccountFields)('username', 'id-number', 'Username', 'Username').formGroup}
                  >
                    <InputGroup
                      {...getProps(updateAccountErrs, accountErrors, accountFields, updateAccountFields)('username', 'id-number', 'Username', 'Username').inputGroup}
                      value={accountFields.username}
                      large={true}
                    />
                  </FormGroup>
                </div>
                <div className='col-md-7'>
                  <FormGroup
                    {...getProps(updateAccountErrs, accountErrors, accountFields, updateAccountFields)('email', 'envelope', 'Email Address', 'Email Address').formGroup}
                  >
                    <InputGroup
                      {...getProps(updateAccountErrs, accountErrors, accountFields, updateAccountFields)('email', 'envelope', 'Email Address', 'Email Address').inputGroup}
                      value={accountFields.email}
                      large={true}
                    />
                  </FormGroup>
                </div>
            </div>
            </div>
          </div>
          
          <Collapse isOpen={sectionUpdated.account} transitionDuration={25}>
            <div className='row' style={{ marginTop: '20px'}}>
              <div className='col-12'>
                <Button
                  fill={true}
                  text='Update Account'
                  minimal={true}
                  large={true}
                  onClick={() => submitAccount()}
                />
              </div>
            </div>
          </Collapse>
        </Card>
      </div>
      <div className='col-12' style={{ marginTop: '25px'}}>
        <Card
          elevation={sectionUpdated.pw ? 3 : 0}
        >
          <div className='row profile_edit_card'>
            {sectionUpdated.pw &&
              <Button 
                minimal={true}
                icon='chevron-up'
                className='profile_edit_card_cancel'
                intent='danger'
                onClick={() => {
                  updateSection({ ...sectionUpdated, pw: false });
                  updatePwFields({
                    oldPassword: '',
                    password: '',
                    confirm: ''
                  });
                  updatePwErrs([]);
                }}
              />}
            <div className='col-12'>
              <h6>Update Password</h6>
              <div className='row'>
                <div className='col-md-6'>
                  <FormGroup
                    {...getProps(updatePwErrs, passwordErrors, passwordFields, updatePwFields)('oldPassword', 'lock', 'Current Password', 'Current Password').formGroup}
                  >
                    <InputGroup
                      {...getProps(updatePwErrs, passwordErrors, passwordFields, updatePwFields)('oldPassword', 'lock', 'Current Password', 'Current Password').inputGroup}
                      type='password'
                      autoComplete='new-password'
                      value={passwordFields.oldPassword}
                      large={true}
                    />
                  </FormGroup>
                </div>
              </div>
              <div className='row'>
                <div className='col-md-6'>
                  <FormGroup
                    {...getProps(updatePwErrs, passwordErrors, passwordFields, updatePwFields)('password', 'lock', 'Enter New Password', 'New Password').formGroup}
                  >
                    <InputGroup
                      {...getProps(updatePwErrs, passwordErrors, passwordFields, updatePwFields)('password', 'lock', 'Enter New Password', 'New Password').inputGroup}
                      type='password'
                      autoComplete='new-password'
                      value={passwordFields.password}
                      large={true}
                    />
                  </FormGroup>
                </div>
                <div className='col-md-6'>
                  <FormGroup
                    {...getProps(updatePwErrs, passwordErrors, passwordFields, updatePwFields)('confirm', 'lock', 'Enter password again', 'Confirm New Password').formGroup}
                  >
                    <InputGroup
                      {...getProps(updatePwErrs, passwordErrors, passwordFields, updatePwFields)('confirm', 'lock', 'Enter password again', 'Confirm New Password').inputGroup}
                      type='password'
                      autoComplete='new-password'
                      value={passwordFields.confirm}
                      large={true}
                    />
                  </FormGroup>
                </div>
              </div>
            </div>
          </div>
          <Collapse isOpen={sectionUpdated.pw} transitionDuration={25}>
            <div className='row' style={{ marginTop: '20px'}}>
              <div className='col-12'>
                <Button
                  fill={true}
                  text='Change Password'
                  minimal={true}
                  large={true}
                />
              </div>
            </div>
          </Collapse>
        </Card>
      </div>
    </div>
  )
}

const mapStateToProps = (state: IStore) => ({
  user: state.user.user
})

export default connect(mapStateToProps)(Profile);
