import React from 'react';
import Hero from './hero';
import BooksSection from './books';
import Questions from './questions';
import './home.css';

const HomePage = () => {
  return (
    <div>
      <Hero />
      <BooksSection />
      <Questions />
      <p>Hello this will eventually become the home page of Keen Pages.</p>
    </div>
  );
}

export default HomePage;
