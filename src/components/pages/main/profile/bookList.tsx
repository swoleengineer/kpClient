import React, { useState, useEffect } from 'react';
import { IUser, ITopicBodyObj, IAppState, IBook, IShelf, IComment, ShelfEditType } from '../../../../state-management/models';
import { flatten } from 'lodash';
import Icon, { IconTypeEnum } from '../../../icons';
import { Button, Popover, Menu, MenuItem, MenuDivider, Collapse, InputGroup, Spinner,  } from '@blueprintjs/core';
import ShelfBooks from './shelfComponents/shelfBooks';
import * as moment from 'moment';
import { dateFromObjectId } from '../../../utils';
import KPBOOK from '../../../../assets/kp_book.png';
import { getAuthorName } from '../../../../state-management/utils';
import { LocationState } from 'redux-first-router';
import { editShelf } from '../../../../state-management/thunks';
import { keenToaster } from '../../../../containers/switcher';

const getUnique = (arr, prop) => arr.filter(e => e).map(e => e[prop]).map((e, i, f) => f.indexOf(e) === i && i).filter(e => arr[e]).map(e => arr[e])

const BookList = (props: {
  viewPort: IAppState['viewPort'];
  profileNav: IAppState['profile'];
  user: IUser;
  location: LocationState;
  selectedShelf: IShelf;
  shelfComments: Array<IComment>
}) => {
  const { user, viewPort, location: { payload: { page, part: listType }}, selectedShelf, shelfComments } = props;
  if (!user) {
    return null;
  }
  const [isLoading, setLoading] = useState<boolean>(false);
  const integratedShelf: boolean = ['likedBooks', 'readBooks'].includes(listType);

  const books: Array<IBook> = integratedShelf
    ? user[listType === 'likedBooks' ? 'savedBooks' : listType] || []
    : selectedShelf
      ? selectedShelf.books
      : []
  const icon = integratedShelf
    ? listType === 'likedBooks'
      ? 'fa-heart'
      : 'fa-bookmark'
    : 'fa-books';
  
  const iconProps = {
    likedBooks: {
      type: IconTypeEnum.solid,
      icon
    },
    readBooks: { icon },
    [selectedShelf ? selectedShelf._id : '']: {
      icon: isLoading ? 'fa-spin fa-spinner' : icon
    }
  }
  const listName = {
    likedBooks: 'Liked Books',
    readBooks: 'Read Books',
    [selectedShelf ? selectedShelf._id : '']: selectedShelf ? selectedShelf.title : 'Selected Shelf'
  }[listType];
  const isPublic = {
    [integratedShelf]: user.listPublicStatus[listType === 'readBooks' ? listType : 'savedBooks'],
    [selectedShelf && selectedShelf._id.length > 0]: { ...(selectedShelf || { public: false })}.public
  }[true];
  // const [isPublic, setPublic] = useState<boolean>(false);
  const [shareActive, setShareStatus] = useState<boolean>(false)
  const [mainActiveTab, setMainTab] = useState<'books' | 'feed'>('books');
  const [selectedBook, setSelectedBook] = useState<IBook>();
  const [topBg, setTopBg] = useState<boolean>(true);
  const { pictures } = selectedBook || { pictures: [] };
  const [ picture = { link: undefined}] = pictures || [];
  const [filterText, setFilter] = useState<string>('');
  const [editTitle, setTitleEdit] = useState<Boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  
  
  const allTopics = getUnique(flatten(books.map(book => book.topics.map((topic : ITopicBodyObj) => topic.topic))), '_id')
  useEffect(() => setTopBg(books.length > 0), [books]);
  const shownBooks = books.filter(book => {
    if (!filterText || !filterText.length) {
      return true;
    }
    const properTitle = book.title.toLowerCase().trim();
    const properSub = book.subtitle ? book.subtitle.toLowerCase().trim() : '';
    const properDesc = book.description ? book.description.toLowerCase().trim() : '';
    const properSearch = filterText.toLowerCase().trim();
    return `${properTitle}${properSub}${properDesc}`.includes(properSearch);
  });
  const processFilter = (text: string) => {
    setFilter(text);
    if (selectedBook) {
      setSelectedBook(undefined);
    }
  }
  const topStyle = topBg
    ? {
      height: '475px',
      marginBottom: '200px',
      backgroundColor: '#5c7080'
    }
    : {
      backgroundColor: 'white',
      height: 'auto'
    };
  if (newTitle.length) {
    setNewTitle('');
  }
  const loadingShelf = !integratedShelf && (!selectedShelf || !selectedShelf.title);
  return (
    <div className={`library_list_wrapper ${loadingShelf ? 'bp3-skeleton' : ''}`}>
      <div className={`library_list_top_container ${loadingShelf ? 'bp3-skeleton' : ''}`} style={topStyle}>
        <header className='library_list_top_header'>
          <span className='library_list_top_header_text'>
            {!editTitle && <><Icon {...iconProps[listType]} /> <span onClick={() => {
              if (['Read Books', 'Liked Books', 'Saved Books'].includes(listName)) {
                return;
              }
              setTitleEdit(true);
              }}>{listName}</span></>}
            {editTitle && (
              <div className='library_list_top_header_title_edit' style={{ display: editTitle ? 'block' : 'none'}}>
                <InputGroup
                  fill={true}
                  inputRef={elem => {
                    if (!elem) {
                      return;
                    }
                    elem.autofocus = true;
                    // elem.select();
                  }}
                  leftIcon={<span className='bp3-icon'><Icon {...iconProps[listType]} iconSize={14} style={{ top: '-7px', position: 'relative'}} /></span>}
                  className='library_list_title_input'
                  rightElement={(
                    <div className='library_list_top_header_title_edit_input_btns'>
                      <Button
                        icon={<Icon icon='fa-times' />}
                        small={true}
                        minimal={true}
                        onClick={() => {
                          setNewTitle('');
                          setTitleEdit(false);
                        }}
                      />
                      <Button
                        icon={<Icon icon='fa-save' />}
                        small={true}
                        minimal={true}
                        onClick={() => {
                          if (!newTitle || !newTitle.length || newTitle === listName) {
                            return 
                          }
                          const edit = {
                            type: ShelfEditType.editTitle,
                            payload: { newTitle }
                          }
                          setLoading(true)
                          editShelf(selectedShelf._id, {edits: [edit]}).then(
                            () => {
                              setTitleEdit(false);
                              setLoading(false)
                            },
                            err => {
                              console.error(err);
                              setLoading(false);
                              setTitleEdit(false);
                            }
                          )
                        }}
                      />
                    </div>
                  )}
                  placeholder='Edit Shelf Name'
                  onBlur={() => {
                    if (!newTitle || !newTitle.length || newTitle === listName) {
                      setTitleEdit(false);
                      setNewTitle('');
                      return 
                    }
                    const edit = {
                      type: ShelfEditType.editTitle,
                      payload: { newTitle }
                    }
                    setLoading(true);
                    editShelf(selectedShelf._id, {edits: [edit]}).then(
                      () => {
                        setTitleEdit(false);
                        setLoading(false);
                      },
                      err => {
                        console.error(err);
                        setLoading(false);
                        setTitleEdit(false);
                      }
                    )
                  }}
                  onChange={$event => {
                    const value = $event.target.value;
                    setNewTitle(value);
                  }}
                  onKeyUp={$event => {
                    const value = $event.target.value;
                    setNewTitle(value);
                    if ($event.keyCode === 13) {
                      const edit = {
                        type: ShelfEditType.editTitle,
                        payload: {
                          newTitle: value
                        }
                      }
                      setLoading(true);
                      editShelf(selectedShelf._id, {edits: [edit]}).then(
                        () => {
                          setLoading(false);
                          setTitleEdit(false);
                        },
                        err => {
                          console.error(err);
                          setLoading(false);
                          setTitleEdit(false);
                        }
                      )
                      
                    }
                  }}
                />
              </div>
            )}
            
            <span className='library_list_top_header_meta'>
              <span className='library_list_top_header_meta_r'>
                <strong>{books.length}</strong> book{books.length !== 1 && 's'}
              </span>
              <span className='library_list_top_header_meta_r'><strong>{allTopics.length}</strong> topic{allTopics.length !== 1 && 's'}</span>
              {!isPublic && <span className='library_list_top_header_meta_r'><strong><Icon icon='fa-lock' /></strong> Private Shelf</span>}
              {isPublic && <>
                <span className='library_list_top_header_meta_r'><strong>25</strong> followers</span>
                <span className='library_list_top_header_meta_r'><strong>12</strong> coments</span>
              </>}
            </span>
          </span>
        </header>
        <div className='library_list_top_nav_wrapper'>
          <ul className='library_list_top_nav'>
            <li
              className={mainActiveTab === 'books' ? 'activeMainTab' : ''}
              onClick={() => setMainTab('books')}
            >
              <Icon icon='fa-books' /> Books
            </li>
            <li
              className={mainActiveTab === 'feed' ? 'activeMainTab' : ''}
              onClick={() => setMainTab('feed')}
            >
              <Icon icon='fa-stream' /> Feed
            </li>
            <li style={{ margin: '0 0 0 auto' }}>
              {(isPublic && books.length > 0) && (
              <>
                <Button
                  icon={<Icon icon={shareActive ? 'fa-chevron-up' : 'fa-share-all'} />}
                  text={<span className='hidden-sm'>{shareActive ? 'Cancel' : 'Share'}</span>}
                  minimal={true}
                  small={true}
                  onClick={() => setShareStatus(!shareActive)}
                />
                <Button
                  icon={<Icon icon='fa-plus-circle' />}
                  text={<span className='hidden-sm'>Follow</span>}
                  minimal={true}
                  small={true}
                />
              </>
              )}
              <Popover>
                <Button
                  icon={<Icon icon={isPublic ? 'fa-globe-americas' : 'fa-lock-alt'} />}
                  minimal={true}
                  small={true}
                >
                  <span className='hidden-sm'>{isPublic ? 'Public' : 'Private'}</span>
                </Button>
                <Menu>
                  <MenuDivider title='Shelf Privacy' />
                  <MenuItem
                    icon={<Icon icon='fa-lock-alt' push={true} />}
                    text='Make private'
                    onClick={() => {
                      const req = {
                        type: ShelfEditType.makePrivate
                      }
                      setLoading(true);
                      editShelf(selectedShelf._id, { edits: [req]}).then(
                        () => {
                          keenToaster.show({
                            message: <><strong>{listName}</strong> is now Private.</>,
                            icon: <span className='bp3-icon'><Icon icon='fa-lock-alt' /></span>
                          })
                          setLoading(false)
                        },
                        err => {
                          console.error(err);
                          setLoading(false);
                        }
                      )
                    }}
                    disabled={!isPublic}
                  />
                  <MenuItem
                    icon={<Icon icon='fa-globe-americas' push={true} />}
                    text='Make public'
                    onClick={() => {
                      const req = {
                        type: ShelfEditType.makePublic
                      }
                      if (!books.length) {
                        keenToaster.show({
                          message: 'You must add at least one book before sharing this shelf.',
                          icon: <span className='bp3-icon'><Icon icon='fa-exclamation'/></span>
                        });
                        return;
                      }
                      setLoading(true);
                      editShelf(selectedShelf._id, { edits: [req]}).then(
                        () => {
                          keenToaster.show({
                            message: <><strong>{listName}</strong> is now Public.</>,
                            icon: <span className='bp3-icon'><Icon icon='fa-globe-americas' /></span>
                          })
                          setLoading(false)
                        },
                        err => {
                          console.error(err);
                          setLoading(false);
                        }
                      )
                    }}
                    disabled={isPublic}
                  />
                  <MenuDivider />
                  <MenuItem
                    text='Delete Shelf'
                    icon={<Icon icon='fa-trash' push={true} intent='danger'/>}
                  />
                </Menu>
              </Popover>
            </li>
          </ul>
        </div>
        {isPublic && <Collapse isOpen={shareActive} transitionDuration={55}>
          <div className='library_list_top_share_wrapper'>
            <ul className='library_list_top_share_container'>
              <li className='library_list_top_share_title'>
                Share to:
              </li>
              <li className='library_list_top_share_btn'>
                <Button
                  icon={<Icon icon='fa-facebook-square'  type={IconTypeEnum.brand} />}
                  text={<span className='hidden-sm'>Facebook</span>}
                  minimal={true}
                  small={true}
                />
              </li>

              <li className='library_list_top_share_btn'>
                <Button
                  icon={<Icon icon='fa-twitter-square' type={IconTypeEnum.brand} />}
                  text={<span className='hidden-sm'>Twitter</span>}
                  minimal={true}
                  small={true}
                />
              </li>
              <li className='library_list_top_share_btn'>
                <Button
                  icon={<Icon icon='fa-link'  />}
                  text={<span className='hidden-sm'>Link</span>}
                  minimal={true}
                  small={true}
                />
              </li>
              <li className='library_list_top_share_btn'>
                <Button
                  icon={<Icon icon='fa-chevron-up' />}
                  minimal={true}
                  small={true}
                  onClick={() => setShareStatus(false)}
                />
              </li>
            </ul>
          </div>
        </Collapse>}
        {mainActiveTab === 'books' && <ShelfBooks
          allTopics={allTopics}
          books={shownBooks}
          viewPort={viewPort}
          setSelectedBook={setSelectedBook}
          selectedBook={selectedBook}
          filterText={filterText}
          setFilter={processFilter}
          showTopBg={setTopBg}  
        />}
        {mainActiveTab === 'feed' && (
          <div className='feedholder'>
            This is where feed stuff will go for the book shelf
          </div>
        )}
      </div>
      {selectedBook &&
      <div className='library_list_bottom_container'>
        <div className='library_list_bottom_book_header'>
          <div className='library_list_bottom_header_book_img' style={{backgroundImage: `url(${picture.link || KPBOOK})`}} />
          <header className='library_list_bottom_header'>
            <span className='library_list_bottom_title' >{selectedBook.title}</span>
            {(selectedBook.subtitle && viewPort !== 'mobile')&& <span className='library_list_bottom_subtitle'>{selectedBook.subtitle}</span>}
            {getAuthorName(selectedBook) && <span className='library_list_bottom_author'>By: {getAuthorName(selectedBook)}</span>}
          </header>
        </div>
        <div className='library_list_bottom_actionsWrapper'>
          <div className='library_list_bottom_date'>
            <strong>Saved:</strong>
            <span>{moment(dateFromObjectId(selectedBook._id)).fromNow()}</span>
          </div>
          <div className='library_list_bottom_buttons'>
            <Button
              text={<span className='hidden-sm'>View</span>}
              rightIcon={<Icon icon='fa-chevron-right' />}
              minimal={true}
            />
            <Button
              icon={<Icon icon='fa-times' />}
              minimal={true}
            />
            <Button
              icon={<Icon icon='fa-trash-alt' />}
              minimal={true}
              intent='danger'
            />
          </div>
        </div>
      </div>
        }
    </div>
  );
}



export default BookList;
