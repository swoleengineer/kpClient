import React from 'react';
import { IPanel, PanelStack } from '@blueprintjs/core';
import './newBook.css';

import Page1 from './page1';

const NewBookPage = () => {

  const initialPage: IPanel = {
    component: Page1,
    props: {
      panelNumber: 1
    },
    title: 'Search The Internet'
  }

  return (
    <div>
      <PanelStack
        initialPanel={initialPage}
        className='newBookPanelWrapper'
      />
    </div>
  )
}


export default NewBookPage;
