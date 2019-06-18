// import React, { useState } from 'react';
// import { connect } from 'react-redux';
// import { IStore, IExpandedBook, IBook } from '../../../../state-management/models';
// import { searchBooks } from '../../../../state-management/thunks';
// import { MenuItem, Menu, ButtonGroup, Button } from '@blueprintjs/core';
// import { Select, ItemRenderer } from '@blueprintjs/select';
// import { filterBook, getAuthorName } from '../../../../state-management/utils/book.util';
// import Book from '../../../book';
// const BookSelect = Select.ofType<IExpandedBook>();

// const BookSearchDropdown = (props: {
//   books: IExpandedBook[];
//   itemSelected: Function;
//   placeholder: string;
// }) => {
//   const { books, itemSelected, placeholder = 'Search For Book' } = props;
//   const [selected, updateSelected] = useState();
//   const [typed, updateQuery] = useState('');
//   const [searched, updateStatus] = useState(false);
//   const renderBook: ItemRenderer<IExpandedBook> = (book, { handleClick, modifiers, query }) => {
//     if (!modifiers.matchesPredicate) {
//       return null;
//     }
//     return (
//       <MenuItem
//         active={modifiers.active}
//         disabled={modifiers.disabled}
//         key={book._id}
//         icon='book'
//         text={<div style={{ maxWidth: '150px'}}><strong>{book.title}</strong><br /><small>{getAuthorName(book)}</small></div>}
//         onClick={() => {
//           itemSelected(book);
//           updateSelected(book);
//         }}
//       >
//         <Book liv={book} />
//       </MenuItem>
//     )
//   }
//   const processQueryChange = query => {
//     updateQuery(query);
    
//     // console.log(`query: ${query}, processed: ${query.slice(0, -1)}, typed: ${typed}`);
//   //  !typed.startsWith(query.slice(0, -1))
//     if (query.length > 3) {
//       // updateStatus(true);
//       searchBooks(query).catch(() => console.log('error from req.'))
//     }
//   }
//   const addBookProps = {
//     itemPredicate: filterBook,
//     itemRenderer: renderBook,
//     items: books,
//     filterable: true,
//     hasInitialContent: false,
//     resetOnClose: true,
//     resetOnQuery: true,
//     resetOnSelect: true,
//     onQueryChange: processQueryChange
//   }
//   return (
//     <BookSelect
//       {...addBookProps}
//       noResults={<MenuItem disabled={true} text='No books.' />}
//       onItemSelect={(item: IExpandedBook) => {
//         itemSelected(item);
//         updateSelected(item);
//       }}
//     >
//       <Button
//         icon='book'
//         minimal={true}
//       >
//         {selected ? selected.title : placeholder}
//       </Button>
//     </BookSelect>
//   ); 
// }

// const mapStateToProps = (state: IStore) => ({
//   books: state.book.books
// })

// export default connect(mapStateToProps)(BookSearchDropdown);
