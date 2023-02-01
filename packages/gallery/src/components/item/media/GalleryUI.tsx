import React from 'react';
import PropTypes from 'prop-types';
import { useGalleryUI } from '../../../context/GalleryContext';
const galleryUiComponents = {
  videoPlayButton: React.lazy(
    () => import(/* webpackChunkName: "defaultPlayButton" */ './playButton')
  ),
};
export const GalleryUI = ({ type, size }): JSX.Element => {
  let Component;

  const galleryUI = useGalleryUI();
  if (typeof galleryUI?.[type] === 'function') {
    return galleryUI[type](size);
  } else if (galleryUiComponents[type]) {
    Component = galleryUiComponents[type];
  } else {
    return <></>;
  }
  return (
    <React.Suspense fallback={<></>}>
      <Component size={size} />
    </React.Suspense>
  );
};

GalleryUI.propTypes = {
  size: PropTypes.string,
  type: PropTypes.string,
};
