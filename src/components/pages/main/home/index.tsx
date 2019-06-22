import React from 'react';
import Hero from './hero';
import ResultsSection from './results';
import BooksSection from './books';
import Questions from './questions';
import './home.css';
import { connect } from 'react-redux';
import { IStore, IAppState } from '../../../../state-management/models';


const HomePage = (props: {
  home: IAppState['home']
}) => {
  const { home: { searchText }} = props;
  return (
    <div>
      <Hero />
      {searchText.length > 0 && <ResultsSection />}
      {!searchText.length && <>
        <BooksSection />
        <Questions />
      </>}
    </div>
  );
}

const mapStateToProps = (state: IStore) => ({
  home: state.app.home
})
export default connect(mapStateToProps)(HomePage);
