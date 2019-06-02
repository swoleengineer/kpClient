import React from 'react';
import pageMap from './pageMap';
import Logo from '../components/header/logo';
import Link from 'redux-first-router-link';

type IAuthWrapperProps = {
  page: string
}


const AuthWrapper = (props: IAuthWrapperProps) => {
  const { page } = props;
  const Display = pageMap[page];
  const pageType = page.split('/')[1];
  const { cardWidth, topPadding, pageSubtitle, pageTitle, pageDescription } = {
    login: {
      cardWidth: 'col-md-4',
      topPadding: '20%',
      pageTitle: 'Login,',
      pageSubtitle: 'Good to see you!',
      pageDescription: 'Login to get the best of keenpages.com'
    },
    register: {
      cardWidth: 'col-md-6',
      topPadding: '15%',
      pageTitle: 'Register,',
      pageSubtitle: 'Join in the fun!',
      pageDescription: 'Create your account to start using keenpages.com'
    }
  }[pageType];


  return (
  <div className='authWrapper'>
    <div className='container'>
      <div className={`authContainer ${cardWidth}`} style={{ paddingTop: topPadding }}>
        <div className='authLogoWrapper'>
          <Logo large={true} />
        </div>
        <h3>{pageTitle}&nbsp;
          <small>{pageSubtitle}</small>
        </h3>
        <p>{pageDescription}</p>
        <div className='authContainerPageWrapper'><Display /></div>
        <div className='authBottomLinks'>
          {pageTitle === 'Login,' && <ul>
            <li className='forLogin'><Link to={{}}>Forgot Password</Link></li>
            <li className='forLogin'><Link to={{ type: 'REGISTER'}}>Register</Link></li>
          </ul>}
          {pageTitle === 'Register,' && <ul>
            <li className='forRegister'><Link to={{ type: 'LOGIN' }}>Login instead &raquo;</Link></li>
          </ul>}
        </div>
      </div>
    </div>
  </div>
  )
}

export default AuthWrapper
