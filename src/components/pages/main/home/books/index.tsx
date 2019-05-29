import React from 'react';
import './book.css';
import { Icon, Tooltip } from '@blueprintjs/core'

const BooksSection = () => {
  return (
    <section className='section_padding'>
      <div className='container'>
        <h6>Recent Books</h6>
        <div className='row'>
          <div className='col-2'>
            <div className='singleBookWrapper'>
              <div className='bookPicture' style={{backgroundImage: `url('http://inspiredwomenamazinglives.com/wp-content/uploads/2018/12/Becoming-Michelle-Obama.jpg')`}}>
                <div className='bookMenu'>
                  <div>
                    <Tooltip content='Report book'>
                      <span><Icon icon='flag' /></span>
                    </Tooltip>
                  </div>
                  <div>
                    <Tooltip content='Save Book'>
                      <span><Icon icon='floppy-disk' /></span>
                    </Tooltip>
                  </div>
                  <div>
                    <Tooltip content='View book'>
                      <span><Icon icon='share' /></span>
                    </Tooltip>
                  </div>
                </div>
              </div>
              <span className='bookTitle'>Becoming</span>
              <span className='bookAuthor'>Michelle Obama</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BooksSection
