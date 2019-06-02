import React from 'react';
import pageMap from './pageMap';
import Logo from '../components/header/logo';

type IAuthWrapperProps = {
  page: string
}


const AuthWrapper = (props: IAuthWrapperProps) => {
  const { page } = props;
  const Display = pageMap[page];
  const pageType = page.split('/')[1];
  const { cardWidth, topPadding, pageSubtitle, pageTitle, pageDescription } = {
    login: {
      cardWidth: 'col-md-3',
      topPadding: '25%',
      pageTitle: 'Login,',
      pageSubtitle: 'Good to see you!',
      pageDescription: 'Login to get the best of keenpages.com'
    }
  }[pageType];


  return (
  <div className='authWrapper'>
    <div className='container'>
      <div className={`authContainer ${cardWidth}`} style={{ paddingTop: topPadding }}>
        <div className='authLogoWrapper'>
          <Logo />
        </div>
        <h3>{pageTitle}&nbsp;
          <small>{pageSubtitle}</small>
        </h3>
        <p>{pageDescription}</p>
        <div className='authContainerPageWrapper'><Display /></div>
      </div>
    </div>
  </div>
  )
}

export default AuthWrapper
