import React from 'react';
import { useGalleryUI } from '../../../context/GalleryContext';
import PlayButton from './playButton';
import RotateArrow from './rotateArrow';

const galleryUiComponents = {
  videoPlayButton: PlayButton,
  rotateArrow: RotateArrow,
};

interface GalleryUIProps {
  size: number;
  type: 'videoPlayButton' | 'rotateArrow';
}

export const GalleryUI = ({ type, size }: GalleryUIProps): JSX.Element => {
  let Component;

  const galleryUI = useGalleryUI();
  if (typeof galleryUI?.[type] === 'function') {
    return galleryUI[type](size);
  } else if (galleryUiComponents[type]) {
    Component = galleryUiComponents[type];
  } else {
    return <></>;
  }
  return <Component size={size} />;
};
