import React, { useEffect, useState } from 'react';
import { useGalleryUI } from '../../../context/GalleryContext.js';

type ComponentType = React.ComponentType<{ size: number }>;

interface GalleryComponents {
  videoPlayButton: ComponentType;
  rotateArrow: ComponentType;
}

const galleryUiComponents = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  videoPlayButton: React.lazy(() => import(/* webpackChunkName: "defaultPlayButton" */ './playButton.js')),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  rotateArrow: React.lazy(() => import(/* webpackChunkName: "defaultRotateArrow" */ './rotateArrow.js')),
};

interface GalleryUIProps {
  size: number;
  type: keyof GalleryComponents;
}

export const GalleryUI = ({ type, size }: GalleryUIProps): JSX.Element => {
  const [isMounted, setIsMounted] = useState(false);
  const galleryUI = useGalleryUI();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <></>;
  }

  if (typeof galleryUI?.[type] === 'function') {
    return galleryUI[type](size);
  }

  const Component = galleryUiComponents[type];

  if (!Component) {
    return <></>;
  }

  return (
    <React.Suspense fallback={<></>}>
      <Component size={size} />
    </React.Suspense>
  );
};
