import React, { useState } from 'react';
import ThreadInput from './threadInput';
import { IUser } from '../../state-management/models';
import { Popover, Menu, MenuItem, NonIdealState, Button } from '@blueprintjs/core';
import Icon, { IconTypeEnum } from '../icons';
import Thread from './';

interface IProps {
  inputRef: Function;
  newCommentFormActive: boolean;
  setNewCommentForm: Function;
  user: IUser;
  submitComment: Function;
  threads: Array<any>;
  linkTo: Function;
  deleteCommentClicked: Function;
  reportCommentClicked: Function;
}
const threadSystem = (props: IProps) => {
  const { newCommentFormActive, setNewCommentForm, user, submitComment, threads = [],
    linkTo, deleteCommentClicked, reportCommentClicked
  } = props;
  const [commentPositionTop, commentPositionSet] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<'recent' | 'activity'>('activity');
  let commentInput;
  return (
    <>
      {commentPositionTop && (
        <ThreadInput
          inputRef={input =>  commentInput = input}
          newCommentFormActive={newCommentFormActive}
          setNewCommentForm={setNewCommentForm}
          user={user}
          submitComment={submitComment}
          setPosition={commentPositionSet}
          positionTop={commentPositionTop}
        />
      )}

      <div className='single_container_discussions_actions'>
        <Popover
          position='bottom-right'
          modifiers={{
            arrow: { enabled: false }
          }}
        >
          <span className='single_container_discussions_action'>
            Recent Posts&nbsp;&nbsp;<Icon icon='fa-caret-down' />
          </span>
          <Menu>
            <MenuItem
              icon={<span className='bp3-icon'><Icon icon='fa-history' /></span>}
              text={<span>Recent Posts <small style={{ display: 'block'}}>See most recent posts first</small></span>}
              labelElement={<span className='bp3-icon'><Icon icon='fa-check' type={IconTypeEnum.light} /> </span>}
            />
            <MenuItem
              icon={<span className='bp3-icon'><Icon icon='fa-comment-alt-lines' /></span>}
              text={<span>New Activity <small style={{ display: 'block'}}>See posts with recent comments first</small></span>}
            />
          </Menu>
        </Popover>
      </div>

      {threads.length < 1 && (
        <div className='single_container_discussions_empty'>
          <div className='nonIdealWrapper' style={{ padding: '25px 0 50px'}}>
            <NonIdealState
              icon={<Icon icon='fa-comments' />}
              title={`No discussions`}
              description={<p>No one's said anything yet. Wanna be the first?</p>}
              action={newCommentFormActive ? undefined : (
                <Button
                  minimal={true}
                  text='Comment'
                  small={true}
                  rightIcon={<span className='bp3-icon'><Icon icon='fa-caret-right' /> </span>}
                  large={true}
                  onClick={() =>  commentInput.focus()}
                />
              )}
            />
          </div>
        </div>
      )}
      
      {threads.length > 0 && (
        <div className='single_container_discussions_list'>
          {threads
          .sort((a, b) => {
            const { primaryComment: { created: aMade }} = a;
            const { primaryComment: { created: bMade }} = b;
            return aMade > bMade ? -1 : aMade < b.created ? 1 : 0;
          })
          .map((thread, i) => {
            return (
              <Thread
                key={i}
                content={thread}
                user={user}
                linkTo={linkTo}
                deleteComment={deleteCommentClicked}
                reportComment={reportCommentClicked}
              />
            );
          })}
        </div>
      )}

      {!commentPositionTop && (
        <ThreadInput
          inputRef={props.inputRef}
          newCommentFormActive={newCommentFormActive}
          setNewCommentForm={setNewCommentForm}
          user={user}
          submitComment={submitComment}
          setPosition={commentPositionSet}
          positionTop={commentPositionTop}
        />
      )}
    </>
  );
}

export default threadSystem;
