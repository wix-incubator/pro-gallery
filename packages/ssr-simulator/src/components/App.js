import React, { useEffect, useState } from 'react';
import Head from './Head';
import Gallery from './gallery';

const DEFAULT_CONTAINER = {
  width: 980,
  height: 500
};

const App = ({ location }) => {
  const [container, setContainer] = useState(DEFAULT_CONTAINER)

  useEffect(() => { 
    const handleResize = () => {
      const container = {
        width: window.innerWidth,
        height: window.innerHeight
      }

      setContainer(container);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setContainer])

  return (
  <div className="app">
    <Head />
      <Gallery location={location} container={container}/>
  </div>
)
}

export default App;
