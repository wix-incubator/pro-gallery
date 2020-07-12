import React, {useState} from 'react';
import {getInitialStyleParams} from '../constants/styleParams';
import {SIDEBAR_WIDTH} from '../constants/consts';

const GalleryContext = React.createContext([{}, () => {}]);

const GalleryProvider = props => {
  const [viewport, setViewport] = useState({
    preset: 'empty',
    styleParams: getInitialStyleParams('empty', window.innerWidth - SIDEBAR_WIDTH, window.innerHeight),
    dimensions: {    width: window.innerWidth - SIDEBAR_WIDTH,
    height: window.innerHeight},
  });

  const setContext = x => {
    return setViewport({...viewport, ...x});
  };
  return (
    <GalleryContext.Provider value={[viewport, setContext]}>
      {props.children}
    </GalleryContext.Provider>
  );
};

export {GalleryContext, GalleryProvider};
