import React from 'react';
import Logo from '../header/logo';
import Link from 'redux-first-router-link';
import './footer.css';
import SwoleEngineerLogo from '../../assets/se_logo.png';

const Footer = () => {
  return (
    <section className='section_padding section_gray footerSection'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-6 footer_identity'>
            <Logo large={false} />
            <small>CopyRight &copy; 2019 keenpages.com | All rights reserved.</small>
          </div>
          <div className='col-md-6 footer_site_links'>
            <small>Created by <a className='footer_se_link' href='https://swoleengineer.com' target='_blank' style={{ color: 'rgba(0,0,0,.5)'}}><img src={SwoleEngineerLogo} alt='Swole Engineer' /> <strong>Swole Engineer</strong></a></small>
            <ul>
              <li><Link to={{ type: 'PRIVACY' }}>Privacy Policy</Link></li>
              <li><Link to={{ type: 'TERMS' }}>Terms of Use</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Footer;
