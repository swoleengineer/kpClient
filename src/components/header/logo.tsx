import React from 'react';
import Link from 'redux-first-router-link';

const Logo = () => (
  <Link to={{ type: 'HOME' }} className='logoWrapper'>
    <span className='logoKeen'>KEEN</span>
    <span className='logoPages'>PAGES</span>
    <span className='logoTld'>.com</span>
  </Link>
);

export default Logo;
