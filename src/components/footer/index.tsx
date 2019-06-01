import React from 'react';
import Logo from '../header/logo';
import Link from 'redux-first-router-link';
import './footer.css';
import { Icon } from '@blueprintjs/core';

const Footer = () => {
  return (
    <section className='section_padding section_gray footerSection'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-6'>
            <Logo />
            <br />
            <small>CopyRight &copy; 2019 keenpages.com | All rights reserved.</small>
          </div>
          <div className='col-md-6 footer_site_links'>
            <small>Created with <Icon icon='heart' iconSize={10}/> by <a href='https://swoleengineer.com' target='_blank' style={{ color: 'rgba(0,0,0,.5)'}}><strong>Swole Engineer</strong></a></small>
            <ul>
              <li><Link to={{}}>Content Policy</Link></li>
              <li><Link to={{}}>Privacy Policy</Link></li>
              <li><Link to={{}}>Terms of Use</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Footer;
