import React from 'react';
// import Link from 'redux-first-router-link';
// import Login from '../components/auth/login';
// import ForgotPassword from '../components/auth/forgotPassword';
// import Register from '../components/auth/register';
// import ResetPassword from '../components/auth/resetPassword';

type IAuthWrapperProps = {
  page: string
}


const AuthWrapper = (props: IAuthWrapperProps) => {
  // const { page } = props;
  // let AuthComponent = Login;
  // if (page === 'auth/login') { AuthComponent = Login };
  // if (page === 'auth/forgotPassword') { AuthComponent = ForgotPassword };
  // if (page === 'auth/register') { AuthComponent = Register };
  // if (page === 'auth/resetPassword') { AuthComponent = ResetPassword };
  return (
  <div>
    {/* <AuthComponent /> */}
  </div>
  )
}

export default AuthWrapper
