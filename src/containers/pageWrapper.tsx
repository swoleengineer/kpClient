import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
// import DashboardFooter from '../components/dashboard/footer';
const Fragment = React.Fragment;
import pageMap from './pageMap';
import '../components/header/header.css'

const PageWrapper = ({ page }: { page: string }) => {
  const Display = pageMap[page];
  return (
    <Fragment>
      <Header/>
      <div>
        <Display />
      </div>
      <Footer />
    </Fragment>
  );
}

export default PageWrapper;
