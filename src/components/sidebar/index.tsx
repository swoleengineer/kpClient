import React from 'react';
import membership from '../../assets/logged_out.png';
import { connect } from 'react-redux';
import { IStore, IUserState, AuthModalTypes } from '../../state-management/models';
import { redirect } from 'redux-first-router';
import { showModal } from '../../state-management/thunks';
import { Card, Button } from '@blueprintjs/core'
import './sidebar.css';
const SidebarComponent = (props: {
  user: IUserState;
}) => {
  const { loggedIn } = props.user;
  return (
    <div style={{zIndex: 999}}>
      
      {!loggedIn && <div className='sidebarImageAdd unauth'>
      <img src={membership} className='img-fluid' onClick={() => showModal(AuthModalTypes.login)}/>
      </div>}
      <br />
      <Card className='sideAskSuggestions'>
        <strong>Looking for a book that covers a topic?</strong>
        <span>Ask users for book suggestions.</span>
        <br />
        <div className='text-right'>
          <Button text='Request Suggestions' icon='help' small={true} onClick={() => showModal(AuthModalTypes.question)}/>
        </div>
      </Card>
    </div>
  )
}

const mapStateToProps = (state: IStore) => ({
  user: state.user
})

const mapDispatch = dispatch => ({
  linkTo: payload => dispatch(redirect(payload))
})

export default connect(mapStateToProps, mapDispatch)(SidebarComponent);
