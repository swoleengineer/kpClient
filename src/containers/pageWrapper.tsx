import React from 'react';
import Header from '../components/dashboard/header';
import DashboardFooter from '../components/dashboard/footer';
const Fragment = React.Fragment;
import pageSwitch from './pageSwitch';

const PageWrapper = ({ page }: { page: string }) => {
  const Display = pageSwitch[page];
  return (
    <Fragment>
      <Header/>
      <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
        {/* Where the main body goes <Display /> */}
      </div>
      <DashboardFooter />
    </Fragment>
  );
}

export default PageWrapper;
