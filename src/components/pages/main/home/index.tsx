import React from 'react';
import Hero from './hero';
import BooksSection from './books';
import './home.css';

const HomePage = () => {
  return (
    <div>
      <Hero />
      <BooksSection />
      <p>Hello this will eventually become the home page of Keen Pages.</p>
    </div>
  );
}

export default HomePage;
