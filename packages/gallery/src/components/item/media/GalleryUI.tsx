import React from 'react';
import { useGalleryUI } from '../../../context/GalleryContext';
const galleryUiComponents = {
  videoPlayButton: React.lazy(() => import(/* webpackChunkName: "defaultPlayButton" */ './playButton')),
  rotateArrow: React.lazy(() => import(/* webpackChunkName: "defaultRotateArrow" */ './rotateArrow')),
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
  return (
    <React.Suspense fallback={<></>}>
      <Component size={size} />
    </React.Suspense>
  );
};
