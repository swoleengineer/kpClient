import React from 'react';
import { connect } from 'react-redux';
import { IStore } from '../state-management/models';
import AuthWrapper from './authWrapper';
import PageWrapper from './pageWrapper';

const Switcher = ({ page }: { 
  page: string
}) => page.startsWith('auth')
  ? <AuthWrapper page={page} />
  : <PageWrapper page={page} />

const mapStateToProps = (state: IStore) => ({
  page: state.page
});

export default connect(mapStateToProps)(Switcher);
