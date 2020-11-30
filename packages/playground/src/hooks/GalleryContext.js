import React, { useState } from 'react';

const GalleryContext = React.createContext([{}, () => {}]);

const GalleryProvider = (props) => {
  const [viewport, setViewport] = useState({});

  const setContext = (x) => {
    return setViewport({ ...viewport, ...x });
  };
  return (
    <GalleryContext.Provider value={[viewport, setContext]}>
      {props.children}
    </GalleryContext.Provider>
  );
};

export { GalleryContext, GalleryProvider };
