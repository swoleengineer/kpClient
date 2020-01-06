import React, { useState } from 'react';
import KPBOOK from '../../assets/kp_book.png';
import { getAuthorName } from '../../state-management/utils';
import Icon from '../icons';

interface IProps {
  book: any;
  onClick: Function;
}

const searchResultRow = (props: IProps) => {
  const { book, onClick = (x: any, y: Function) => null } = props;
  const { pictures, _id, title, topics, subtitle = undefined } = book;
  const [ picture = { link: undefined }] = pictures || [];
  const [loading, setLoading] = useState<boolean>(false);
  if (!book) {
    return null;
  }
  const author = getAuthorName(book) || <Icon icon='fa-head-side' />
  return (
    <div
      className='kp_search_result_wrapper'
      onClick={() => {
        setLoading(true);
        onClick(book, () => setLoading(false));
      }}
    >
      <div className='kp_search_result_container'>
        <div className='kp_sr_img_wrapper'>
          <div
            className='kp_sr_img_container'
            style={{backgroundImage: `url(${picture.link || KPBOOK})`}}
          >
            {loading && (
              <span className='kp_sr_img_loader'>
                <Icon icon='fa-spinner fa-spin fa-pulse' />
              </span>
            )}
          </div>
        </div>
        <div className='kp_sr_details_wrapper'>
          <div className='kp_sr_details'>
            <span className='kp_sr_d_title'>{title}</span>
            {subtitle && (
              <span className='kp_sr_d_subtitle'>{subtitle}</span>
            )}
            <span className='kp_sr_d_author'>by: {author}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default searchResultRow;
