import React from 'react';
import Head from './Head';
import Gallery from './gallery';
import * as utils from './gallery/utils';

const App = ({ location }) => {
  const searchString = location || window.location.search;
  const urlParams = utils.getStyleParamsFromUrl(searchString);

  return (
  <div className="app">
    <Head />
      <Gallery urlParams={urlParams}/>
  </div>
)
}

export default App;
