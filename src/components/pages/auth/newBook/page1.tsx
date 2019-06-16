import React from 'react';
import { IStore } from '../../../../state-management/models';
import { connect } from 'react-redux';


const NewBookP1 = (props: any) => {
  // const sampleBooks = [{
  //   _id: '001',
  //   title: 'How To Win Friends And Influence People',
  //   subtitle:'this is an example of sub',
  //   authors: ['Joram Clervius', 'Juriste Jean Baptiste'],
  //   publisher: 'Simon and Shuester',
  //   publishYear: '2014'
  // }, {
  //   _id: '002',
  //   title: 'Clean Code - How to code the right way',
  //   authors: ['Jeremy Fry'],
  //   publisher: 'Simon and Shuester',
  //   publishYear: '2010'
  // }, {
  //   _id: '001',
  //   title: 'How To Win Friends And Influence People',
  //   subtitle:'this is an example of sub',
  //   authors: ['Joram Clervius', 'Juriste Jean Baptiste'],
  //   publisher: 'Simon and Shuester',
  //   publishYear: '2014'
  // }, {
  //   _id: '002',
  //   title: 'Clean Code - How to code the right way',
  //   authors: ['Jeremy Fry'],
  //   publisher: 'Simon and Shuester',
  //   publishYear: '2010'
  // }, {
  //   _id: '001',
  //   title: 'How To Win Friends And Influence People',
  //   subtitle:'this is an example of sub',
  //   authors: ['Joram Clervius', 'Juriste Jean Baptiste'],
  //   publisher: 'Simon and Shuester',
  //   publishYear: '2014'
  // }, {
  //   _id: '002',
  //   title: 'Clean Code - How to code the right way',
  //   authors: ['Jeremy Fry'],
  //   publisher: 'Simon and Shuester',
  //   publishYear: '2010'
  // }]
  return (
    <div 
      style={{
        width: '99%',
        margin: '10px auto 0'
      }}
    >
      {/* <ControlGroup fill={true}>
        <FormGroup>
          <InputGroup
            large={true}
            round={true}
            placeholder='Type Book Title'
            leftIcon='book'
            onChange={e => {
              const value = e.target.value;
              updateText(value);
            }}
            onKeyUp={$event => {
              if ($event.keyCode === 13) {
                searchGoogle(searchText)
                  .then(() => {
                    updateText('');
                  })
              }
            }}
            rightElement={<Button
              icon='search'
              minimal={true}
              onClick={() => {
                searchGoogle(searchText)
                  .then(() => {
                    updateText('');
                  })
              }}
              />}
          />
        </FormGroup>
      </ControlGroup>
      <div>
        <h6>{googleBooks.length} results from Google</h6>
        <ul className='bookSearchList'>
          {googleBooks.map((book, i, arr) => {
            return (
              <div key={i}>
                <MenuItem
                  icon='book'
                  labelElement={<Icon icon='chevron-right' />}
                  onClick={() => {
                    openPanel({
                      component: Page2,
                      props: {
                        book
                      },
                      title: book.title
                    });
                  }}
                  text={<div>
                    <strong>{book.title}</strong>
                    {book.subtitle && <>
                      <br />
                      <span>{book.subtitle}</span>
                    </>}
                    <br />
                    {
                      book.authors && <small>
                      <strong>Author{book.authors.length > 1 && 's'}:</strong> {book.authors.join(', ')}
                      &nbsp;&nbsp;
                      <strong></strong>
                    </small>
                    }
                  </div>}
                />
                {i !== arr.length - 1 && <Menu.Divider />}
                
              </div>
            )
          })}
        </ul>
      </div> */}
    </div>
  );
}

const mapStateToProps = (state: IStore) => ({
  googleBooks: state.book.googleBooks
})

export default connect(mapStateToProps)(NewBookP1);
