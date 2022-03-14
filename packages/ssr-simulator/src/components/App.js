import React from 'react';
import Head from './Head';
import Gallery from './gallery';
import * as utils from './gallery/utils';

// //dummy commit
const App = ({ location }) => {
  const searchString = location || window.location.search;
  const urlParams = utils.getOptionsFromUrl(searchString);

  return (
    <div className="app">
      <Head />
      <Gallery urlParams={urlParams} />
    </div>
  );
};

export default App;
