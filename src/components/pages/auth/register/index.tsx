import React from 'react';
import { FormGroup, InputGroup, Button } from '@blueprintjs/core';
import '../../auth/auth.css';

const RegisterPage = () => {
  return (
    <div>
      <div>
        <FormGroup
          helperText={null}
          label='Email/Username'
          labelFor='usernameInput'
        >
          <InputGroup
            id='usernameInput'
            placeholder='Email or Username'
            leftIcon='user'
          />
        </FormGroup>
        <FormGroup
          helperText={null}
          label='Password'
          labelFor='passwordInput'
        >
          <InputGroup
            id='passwordInput'
            placeholder='Password'
            leftIcon='lock'
            type='password'
          />
        </FormGroup>
        <br/>
        <Button text='Login' fill={true} rightIcon='chevron-right' minimal={true} />
      </div>
    </div>
  )
}

export default RegisterPage;
