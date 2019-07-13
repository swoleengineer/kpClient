/// <reference path='../../../index.d.ts' />

import React from 'react';
import Link from 'redux-first-router-link';
import logo from '../../assets/simple.png';
import logoLight from '../../assets/simple_light.png';



const Logo = ({ large = false, dark = false, noText = false }: { large: boolean; dark?: boolean; noText: boolean }) => (
  <Link to={{ type: 'HOME' }} className={['logoWrapper', ...(large ? ['larger'] : []), ...(dark ? ['logoLight'] : [])].join(' ')}>
    <img src={dark ? logoLight : logo} alt='Keen Pages' />
    {noText ? null : <>
      <span className='logoKeen'>KEEN</span>
      <span className='logoPages'>PAGES</span>
      <span className='logoTld'>.com</span>
    </>}
  </Link>
);

export default Logo;
