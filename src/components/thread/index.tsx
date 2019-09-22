import React, { useState } from 'react';
import './thread.css';
import Avatar from '../avatar';
import { Popover, Menu, MenuItem, Tooltip, Button, InputGroup } from '@blueprintjs/core';
import Icon, { IconTypeEnum } from '../icons';
import * as moment from 'moment';
import { IUser, AuthModalTypes, ProfileNavOptions } from '../../state-management/models';
import KPBOOK from '../../assets/kp_book.png';
import Topic from '../topic';
import { getAuthorName } from '../../state-management/utils';
import { showAuthModal } from '../../state-management/thunks';

interface IProps {
  content: any;
  deleteComment: Function;
  user: IUser;
  reportComment: Function;
  linkTo: Function;
}
const threadComponent = (props: IProps) => {
  const { user, linkTo, deleteComment, reportComment } = props;
  const { primaryComment: comment } = props.content;
  const { author = {}, created = new Date(), text = '', suggested_book = undefined } = comment || {};

  const [newCommentFormActive, setNewCommentForm] = useState<boolean>(false);
  const [bookExpanded, setBookExpanded] = useState<boolean>(false);

  const { title = '', pictures = [], topics = [], likes = [] }  = suggested_book || {};
  const [ picture = { link: undefined}] = pictures;

  return (
    <div className='threadItem_wrapper'>
      <div className='threadItem_mainComment'>
        <div className='threadComment_wrapper'>
          <div className='threadComment_header_wrapper'>
            <div className='threadComment_header_avatar'>
              <Avatar user={comment.author} />
            </div>
            <div className='threadComment_header_info'>
              <span className='threadComment_header_info_username'>{author.username}</span>
              <Tooltip
                content={moment(created).format('MM/DD/YYYY')}
                intent='none'
              >
                <span
                  className='threadComment_header_info_created'
                >
                  {moment(created).fromNow()}
                </span>
              </Tooltip>
            </div>
            <div className='threadComment_header_actions'>
            <Popover>
              <span className='threadComment_header_actions_target'>
                <Icon icon='fa-ellipsis-h' type={IconTypeEnum.regular} />
              </span>
              <Menu>
                {user && user._id === comment.author._id
                  ? <MenuItem
                      icon='trash' 
                      text='Delete comment'
                      onClick={() => deleteComment(comment)}
                    />
                  : <MenuItem
                      icon='flag'
                      text='Report comment'
                      onClick={() => reportComment(comment)}
                    />
                }
              </Menu>
            </Popover>
            </div>
          </div>
          <div className='threadComment_content_wrapper'>
            {
              text.charAt(0) === '<'
                ? <div dangerouslySetInnerHTML={{ __html: text}} />
                : <p className='threadComment_content'>{text}</p>
            }
          </div>
          {suggested_book !== undefined && (
            <div className={`threadComment_content_book_wrapper ${bookExpanded ? 'threadCommentBookExpanded' : ''}`}>
              <div className='threadComment_content_book_container'>
                <div className='threadComment_conent_book_picture_wrapper'>
                  <div 
                    className='threadComment_content_book_picture'
                    style={{backgroundImage: `url(${picture.link || KPBOOK})`}}
                  />
                </div>
                <div className='threadComment_content_book_info_wrapper'>
                  <div
                    className='threadComment_content_book_title_wrapper'
                    onClick={() => setBookExpanded(!bookExpanded)}
                  >
                    <span>{title}</span>
                  </div>
                  {bookExpanded && (
                    <>
                      <div className='threadComment_content_book_meta_wrapper'>
                        <span className='threadComment_content_book_meta_author'>{getAuthorName(suggested_book)}</span>
                        <span className='threadComment_content_engagements'>
                          <span><Icon icon='fa-heart' type={IconTypeEnum.solid} /> {likes.length}</span>
                          <span><Icon icon='fa-graduation-cap' /> {topics.length}</span>
                        </span>

                      </div>
                      <div className='threadComment_content_book_actions_wrapper'>
                        <div className='threadComment_content_book_actions_container'>
                          <Button
                            small={true}
                            minimal={true}
                            text={<span className='hidden-sm'>Buy</span>}
                            icon={<span className='bp3-icon'><Icon icon='fa-amazon' type={IconTypeEnum.brand} /></span>}
                          />
                          <Button
                            small={true}
                            minimal={true}
                            text={<span>Add <span className='hidden-sm'>to shelf</span></span>}
                            icon={<span className='bp3-icon'><Icon icon='fa-books' /> </span>}
                            onClick={() => showAuthModal(AuthModalTypes.bookToShelf, suggested_book)}
                          />
                          <Button
                            small={true}
                            minimal={true}
                            text={<span className='hidden-sm'>View</span>}
                            icon={<span className='bp3-icon'><Icon icon='fa-chevron-right' /> </span>}
                            onClick={() => linkTo({ type: 'SINGLEBOOK', payload: { id: suggested_book._id }})}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {!bookExpanded && (
                  <span className='threadComment_content_clipIcon'>
                    <Icon icon='fa-paperclip' type={IconTypeEnum.regular} />
                  </span>
                )}
                
              </div>
            </div>
          )}
          <div className='threadComment_engage_wrapper'>
            <div className='threadComment_engage_button_container'>
              <Popover
                interactionKind='hover'
                hoverOpenDelay={350}
              >
                <span className='threadComment_engage_button'><Icon icon='fa-thumbs-up' style={{ color: '#5c7080' }} /> Like </span>
                <div className='threadComment_engage_options'>
                  <span
                    className='threadComment_engage_option'
                  >
                    <Icon icon='fa-thumbs-up' />  
                  </span>
                  <span
                    className='threadComment_engage_option'
                  >
                    <Icon icon='fa-heart' type={IconTypeEnum.solid} />  
                  </span>
                  <span
                    className='threadComment_engage_option'
                  >
                    <Icon icon='fa-graduation-cap' />  
                  </span>
                  <span
                    className='threadComment_engage_option'
                  >
                    <Icon icon='fa-frown' type={IconTypeEnum.solid}/>  
                  </span>
                </div>
              </Popover>
            </div>
            <div className='threadComment_engage_evidence'>
              <span className='threadComment_engage_evidence_item'>
                <Icon icon='fa-thumbs-up' />
              </span>
              <span className='threadComment_engage_evidence_item'>
                <Icon icon='fa-heart' type={IconTypeEnum.solid} />
              </span>
              <span className='threadComment_engage_evidence_item'>
                <Icon icon='fa-graduation-cap' />
              </span>
              <span className='threadComment_engage_evidence_count'>
                15
              </span>
            </div>
          </div>
        </div>
        
        <div className='threadItem_comment_notes'></div>
        <div className='threadItem_comments_wrapper'></div>

        <div className='threadItem_newComment_wrapper'>
          <div className='threadItem_newComment_input_container'>
            {!newCommentFormActive && (
              <span
              className='threadItem_newComment_input_btn'
              onClick={() => setNewCommentForm(true)}
            >
              <Icon icon='fa-reply'  /> Reply
            </span>
            )}
            {newCommentFormActive && (
              <div className='threadItem_newComment_input_div'>
                <InputGroup
                  fill={true}
                  inputRef={elem => {
                    if (!elem) {
                      return;
                    }
                    // elem.autofocus = true;
                    elem.focus()
                  }}
                  onBlur={event => {
                    const value = event.target.value;
                    if (!value || !value.length) {
                      setNewCommentForm(false);
                    }
                  }}
                  leftIcon={(
                    <span className='bp3-icon'><Avatar user={user} /></span>
                  )}
                  rightElement={(
                    <Button
                      icon={<span className='bp3-icon'><Icon icon='fa-paper-plane' /> </span>}
                      minimal={true}
                      small={true}
                    />
                  )}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default threadComponent;
