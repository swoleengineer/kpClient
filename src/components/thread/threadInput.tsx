import React, { useState } from 'react';
import { Collapse, Popover, Menu, MenuItem, Button, InputGroup } from '@blueprintjs/core';
import Icon, { IconTypeEnum } from '../icons';
import { CompactPicker } from 'react-color';
import SearchBooks from './bookSearchPopover';
import { Picker, Emoji } from 'emoji-mart';
import { Editor, EditorState, RichUtils, ContentState } from 'draft-js';
import 'emoji-mart/css/emoji-mart.css';
import { IUser } from '../../state-management/models';
import Avatar from '../avatar';
import './threadInput.css';

interface IProps {
  inputRef: Function;
  newCommentFormActive: boolean;
  setNewCommentForm: Function;
  user?: IUser;
  submitComment: Function;
  setPosition: Function;
  positionTop: boolean;
}

enum RichTextStyles {
  bold = 'BOLD',
  italic = 'ITALIC',
  underline = 'UNDERLINE'
}


const threadInput = (props: IProps) => {
  const { setPosition, positionTop, newCommentFormActive, setNewCommentForm, user = undefined, submitComment } = props;
  const [richTextActive, setRichTextStatus] = useState<boolean>(false);
  const [commentSelectedBook, setCommentSelectedBook] = useState<any>(undefined);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  
  const [inputValue, setInputValue] = useState<string>('');
  const [inputEmojiActive, setInputEmojiActive] = useState<boolean>(false);

  const EmojiPicker = ({ addToText, closePopover }) => (
    <Picker
      emoji={''}
      title='Choose Emoji'
      set='apple'
      onSelect={emoji => {
        addToText(emoji);
        closePopover();
      }}
    />
  );
  const processComment = () => {
    if (!inputValue || !inputValue.length) {
      return;
    }
    const payload = {
      text: inputValue
    }
    if (commentSelectedBook) {
      payload['suggested_book'] = commentSelectedBook;
    }
    submitComment(payload, (e) => {
      if (e) {
        // there was an error submitting the comment.
        return;
      }
      setCommentSelectedBook(undefined);
      setRichTextStatus(false);
      setNewCommentForm(false);
      setEditorState(EditorState.createEmpty());
      setInputValue('');
      setInputEmojiActive(false);
    });
  }

  const handleKeyCommand = (command, currentEditorState) => {
    const newState = RichUtils.handleKeyCommand(currentEditorState, command);
    if (!newState) {
      return;
    }
    setEditorState(newState);
  }
  const handleStyleSet = (style: RichTextStyles) => setEditorState(RichUtils.toggleInlineStyle(editorState, style));

  return (
    <div className={`single_container_discussions_form ${newCommentFormActive ? 'formActive' : ''}`}>
      <Collapse isOpen={newCommentFormActive} transitionDuration={18}>
        <div 
          className='kp_thread_input_active_avatar_wrapper'
          onClick={() => {
            setNewCommentForm(false);
            setRichTextStatus(false);
          }}
        >
          <div className='kp_thread_input_active_avatar_container'>

            <Avatar
              user={user}
              style={{
                border: '1px solid rgba(0,0,0,.1)'
              }}
            />
          </div>
        </div>

        {richTextActive && (
          <div className='single_container_discussions_form_options_rt'>
            <span 
              className='single_container_discussions_form_option'
              onClick={() => {
                setNewCommentForm(false);
                setRichTextStatus(false);
              }}
            >
              <Icon
                icon='fa-arrow-to-left'
              />
            </span>
            <div className='single_container_discussions_form_options_rt_group'>
              <span
                className='single_container_discussions_form_option'
                onClick={() => handleStyleSet(RichTextStyles.bold)}
              >
                <Icon icon='fa-bold' type={IconTypeEnum.regular} />
              </span>
              <span
                className='single_container_discussions_form_option'
                onClick={() => handleStyleSet(RichTextStyles.italic)}
              >
                <Icon icon='fa-italic' type={IconTypeEnum.regular} />
              </span>
              <span
                className='single_container_discussions_form_option'
                onClick={() => handleStyleSet(RichTextStyles.underline)}
              >
                <Icon icon='fa-underline' type={IconTypeEnum.duo} />
              </span>
              <span
                className='single_container_discussions_form_option'
              >
                <Icon icon='fa-strikethrough' type={IconTypeEnum.duo} />
              </span>
            </div>
            <div className='single_container_discussions_form_options_rt_group'>
              <Popover
                className='single_container_discussions_form_option'
              >
                <Icon icon='fa-font' type={IconTypeEnum.duo} />
                <CompactPicker />
              </Popover>
              <Popover
                className='single_container_discussions_form_option'
              >
                <Icon icon='fa-text-size' type={IconTypeEnum.regular} />
                <Menu>
                  <MenuItem
                    text='Large'
                  />
                  <MenuItem
                    text='Medium'
                    labelElement={<span className='bp3-icon'><Icon icon='fa-check' type={IconTypeEnum.light} /> </span>}
                  />
                  <MenuItem
                    text='Small'
                  />
                </Menu>
              </Popover>
              <Popover
                className='single_container_discussions_form_option'
              >
                <Icon icon='fa-paragraph' type={IconTypeEnum.regular} />
                <Menu>
                  <MenuItem
                    text={<span>Heading 1</span>}
                  />
                  <MenuItem
                    text={<span>Paragraph</span>}
                  />
                </Menu>
              </Popover>
            </div>
            <div className='single_container_discussions_form_options_rt_group'>
              <span
                className='single_container_discussions_form_option'
              >
                <Icon icon='fa-list-ul' type={IconTypeEnum.duo} />
              </span>
              <span
                className='single_container_discussions_form_option'
              >
                <Icon icon='fa-list-ol' type={IconTypeEnum.duo} />
              </span>
            </div>
            <div className='single_container_discussions_form_options_rt_group'>
              <span
                className='single_container_discussions_form_option'
              >
                <Icon icon='fa-quote-right' />
              </span>
              <Popover
                className='single_container_discussions_form_option'
                position='bottom-right'
                minimal={true}
                modifiers={{
                  arrow: { enabled: false }
                }}
              >
                <Icon icon='fa-book' type={IconTypeEnum.solid} />
                <SearchBooks callBack={setCommentSelectedBook} />
              </Popover>
              <Popover
                className='single_container_discussions_form_option'
              >
                <Icon icon='fa-smile-beam' type={IconTypeEnum.regular} />
                <EmojiPicker onEmojiClick={e => console.log(e)} />
              </Popover>
            </div>
          </div>
        )}
        {!richTextActive && (
          <div className='single_container_discussions_form_options'>
            <span 
              className='single_container_discussions_form_option'
              onClick={() => {
                setNewCommentForm(false);
                setRichTextStatus(false);
              }}
            >
              <Icon
                icon='fa-arrow-to-left'
              />
            </span>
            <Popover
              className='single_container_discussions_form_option'
              position='bottom-left'
              minimal={true}
              modifiers={{
                arrow: { enabled: false }
              }}
            >
              <Icon icon='fa-book' type={IconTypeEnum.solid} />
              <SearchBooks callBack={setCommentSelectedBook} />
            </Popover>
            <Popover
              className='single_container_discussions_form_option'
              position='bottom-left'
              minimal={true}
              modifiers={{
                arrow: { enabled: false }
              }}
              isOpen={inputEmojiActive}
              hasBackdrop={true}
              onInteraction={(shown) => setInputEmojiActive(shown)}
            >
              <Icon
                icon='fa-smile-beam' type={IconTypeEnum.regular}
                onClick={() => setInputEmojiActive(true)}
              />
              <EmojiPicker
                addToText={emoji => setInputValue(`${inputValue}${emoji.native}`)}
                closePopover={() => setInputEmojiActive(false)}
              />
            </Popover>
            <span 
              className='single_container_discussions_form_option'
              onClick={() => {
                const currentStatus: boolean = richTextActive;
                setRichTextStatus(!currentStatus);
                if (!currentStatus && (inputValue && inputValue.length)) {
                  setEditorState(EditorState.createWithContent(ContentState.createFromText(inputValue)))
                }
              }}
            >
              <Icon
                icon='fa-arrow-from-left'
              />
            </span>
          </div>
        )}
        <div className='single_container_discussions_form_settings'>
          {/* <span
            className='single_container_discussions_form_option'
            onClick={() => setPosition(!positionTop)}
          >
            <Icon icon={`fa-long-arrow-${positionTop ? 'down' : 'up'}`} type={IconTypeEnum.light} />
          </span> */}
          {/* <span
            className='single_container_discussions_form_option'
            onClick={() => {
              const currentStatus: boolean = richTextActive;
              setRichTextStatus(!currentStatus);
              if (!currentStatus && (inputValue && inputValue.length)) {
                setEditorState(EditorState.createWithContent(ContentState.createFromText(inputValue)))
              }
            }}
          >
            <Icon icon={`fa-${richTextActive ? 'compress' : 'expand'}`} type={IconTypeEnum.regular} />
          </span> */}
          {/* <span
            className='single_container_discussions_form_option'
            onClick={() => {
              setNewCommentForm(false);
              setRichTextStatus(false);
            }}
          >
            <Icon icon='fa-times' type={IconTypeEnum.light} />
          </span> */}
        </div>
      </Collapse>
      {commentSelectedBook !== undefined && (
        <div className='single_container_discussions_form_attachedBook'>
          <Icon icon='fa-paperclip' type={IconTypeEnum.regular} />
          <span className='single_container_discussions_form_attachedBook_title'>{commentSelectedBook.title}</span>
          <Button
            icon={<span className='bp3-icon'><Icon icon='fa-trash-alt' /> </span>}
            minimal={true}
            small={true}
            onClick={() => setCommentSelectedBook(undefined)}
          />
        </div>
      )}
      {!richTextActive && (
        <div
          className='single_container_discussions_form_mainInput'
          style={commentSelectedBook !== undefined ? { marginTop: '10px' } : {}}
        >
          <InputGroup
            fill={true}
            leftIcon={!newCommentFormActive
              ? (
                <span 
                  className='bp3-icon'
                  style={{
                    width: '30px',
                    margin: '0'
                  }}
                >
                  <Avatar
                    user={user}
                    style={{
                      border: '1px solid rgba(0,0,0,.1)'
                    }}
                  />
                </span>
              )
              : undefined
            }
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder={`Start a new conversation about this book...`}
            onFocus={() => setNewCommentForm(true)}
            inputRef={props.inputRef}
            onKeyUp={e => {
              if (e.keyCode === 13) {
                processComment();
              }
            }}
            rightElement={!newCommentFormActive ? undefined : (
              <Button
                icon={<span className='bp3-icon'><Icon icon='fa-paper-plane' /> </span>}
                minimal={true}
                onClick={() => processComment()}
              />
            )}
          />
        </div>
      )}
      {richTextActive && (
        <div className='single_container_discussions_form_richTextInput'>
          <Editor
            placeholder={`Start a new conversation about this book...`}
            spellCheck={true}
            editorState={editorState}
            onChange={setEditorState}
            handleKeyCommand={handleKeyCommand}
          />
          <div className='single_container_discussion_form_richText_btns'>
            <Button
              icon={<span className='bp3-icon'><Icon icon='fa-paper-plane' /> </span>}
              text='Submit'
              minimal={true}
              small={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default threadInput
