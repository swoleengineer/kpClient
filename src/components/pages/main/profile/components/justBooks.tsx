import React from 'react';
import { IStatSnapshot, IUser, IAppState, ITopic } from '../../../../../state-management/models';
import * as moment from 'moment';
import Book from '../../../../book';

interface IProps {
  snapshot: IStatSnapshot;
  user: IUser;
  viewPort: IAppState['viewPort'];
  topic: ITopic;
  openPanel: Function;
}
const justBooksPage = (props: IProps) => {
  const { snapshot, topic } = props;
  const { created, books } = snapshot;
  return (
    <div className='justBooks_wrapper'>
      <header>
        <h6>
          {books.length} {topic.name} Book{books.length !== 1 && 's'} Read
          <small>Updated on {moment(created).format('MMM. Do, YYYY')}</small>
        </h6>
      </header>
      <div className='row'>
          <div className='col-12'>
            {books.map((book, i) => {
              const { book: liv } = book;
              return (
                <div className='justBooks_book' key={i}><Book liv={liv} /> </div>
              )
            })}
          </div>
      </div>
    </div>
  );
}

export default justBooksPage;
