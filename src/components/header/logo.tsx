/// <reference path='../../../index.d.ts' />

import React from 'react';
import Link from 'redux-first-router-link';
import logo from '../../assets/simple.png';


const Logo = ({ large = false }: { large: boolean }) => (
  <Link to={{ type: 'HOME' }} className={large ? 'logoWrapper larger' : 'logoWrapper'}>
    <img src={logo} alt='Keen Pages' />
    <span className='logoKeen'>KEEN</span>
    <span className='logoPages'>PAGES</span>
    <span className='logoTld'>.com</span>
  </Link>
);

export default Logo;
