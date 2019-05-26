import React from 'react';
import Link from 'redux-first-router-link';
import Login from '../components/auth/login';
import ForgotPassword from '../components/auth/forgotPassword';
import Register from '../components/auth/register';
import ResetPassword from '../components/auth/resetPassword';

type IAuthWrapperProps = {
  page: string
}


const AuthWrapper = (props: IAuthWrapperProps) => {
  const { page } = props;
  let AuthComponent = Login;
  if (page === 'auth/login') { AuthComponent = Login };
  if (page === 'auth/forgotPassword') { AuthComponent = ForgotPassword };
  if (page === 'auth/register') { AuthComponent = Register };
  if (page === 'auth/resetPassword') { AuthComponent = ResetPassword };
  return (
  <div id='m_login' className='m-grid__item m-grid__item--fluid m-grid m-grid--desktop m-grid--ver-desktop m-grid--hor-tablet-and-mobile m-login m-login--6'>
    <div className='m-grid__item m-grid__item--order-tablet-and-mobile-2 m-grid m-grid--hor m-login__aside' style={{backgroundImage: 'url(src/assets/app/media/img/bg/bg-4.jpg)'}}>
      <div className='m-grid__item'>
        <div className='m-login__logo'>
          <Link to={{type: 'HOME' }}>
            <img src='src/assets/app/media/img/logos/logo-4.png' alt='Sevinou Dashboard' />
          </Link>
        </div>
      </div>
      <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver'>
        <div className='m-grid__item m-grid__item--middle'>
          <span className='m-login__title'>Sevinou Administrator Dashboard</span>
          <span className='m-login__subtitle'>For <strong>Sevinou</strong> staff only. Use this dashboard to manage users, products, vendors, orders, and other utilitites in the app.</span>
        </div>
      </div>
      <div className='m-grod__item'>
        <div className='m-login__info'>
          <div className='m-login__section'>
            <a href='https://sevinou.com' target='_blank'>&copy; {new Date().getFullYear()} Sevinou.com</a>
          </div>
          <div className='m-login__section'>
            <Link to={{ type: 'HOME' }}>Privacy &amp; Cookies</Link>
          </div>
        </div>
      </div>
    </div>
    <AuthComponent />
  </div>
  )
}



export default AuthWrapper
