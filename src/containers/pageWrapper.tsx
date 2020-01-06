import React, { useEffect } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
// import DashboardFooter from '../components/dashboard/footer';
import pageMap from './pageMap';
import '../components/header/header.css';
import SidebarComponent from '../components/sidebar';
import { useDispatch } from 'react-redux';
import { appActionTypes } from '../state-management/actions';

const PageWrapper = ({ page, searchText }: { page: string, searchText: string }) => {
  const Display = pageMap[page];
  const homePage: boolean = page.endsWith('home');
  const profilePage: boolean = page.includes('/profile');
  const bookPage: boolean = page.includes('/book');
  const dispatch = useDispatch();
  const cancelDisplay = () => searchText.length > 0 ? dispatch({
    type: appActionTypes.updateSearchText,
    payload: ''
  }) : null;
  
  useEffect(() => {
    const body = document.body;
    body.classList.toggle('noscroll', searchText.length > 0);
  }, [searchText]);

  return (
    <>
      <Header />
      {(homePage || profilePage || bookPage)
        ? (
          <div
            className={`${searchText.length > 0 ? 'flatten_shadows' : ''}`}
            onClick={() => cancelDisplay()}
          >
            <Display />
          </div>
        )
        : (
        <section 
          className={`section_gray section_padding ${searchText.length > 0 ? 'flatten_shadows' : ''}`}
          onClick={() => cancelDisplay()}
        >
          <div className='container'>
            <div className='row'>
              <div className='col-md-9'><Display /></div>
              <div className='col-md-3 makeSticky'><SidebarComponent /></div>
            </div>
          </div>
        </section>
      )}
      <Footer />
    </>
  );
}

export default PageWrapper;
