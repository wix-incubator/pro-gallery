import React from 'react';
import Head from './Head';
import Gallery from './gallery';

const App = ({ location }) => (
  <div className="app">
    <Head />
    <Gallery location={location} />
  </div>
);

export default App;
