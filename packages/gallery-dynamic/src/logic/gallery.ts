import React, { useEffect, useState } from 'react';
import { IGallery } from '../types/gallery';

export const GalleryContext = React.createContext<IGallery>(null as any);

export const useGallery = () => React.useContext(GalleryContext);

export const useSettings = () => useGallery().settings;

export function useRerenderOnScroll(
  everyPx: number,
  container = document.body
): void {
  const rerender = useState(0)[1];
  const update = () => rerender(Math.random());
  useEffect(() => {
    let lastScrollPosition = container.scrollTop;
    const handleScroll = () => {
      const currentScrollPosition = container.scrollTop;
      if (Math.abs(currentScrollPosition - lastScrollPosition) > everyPx) {
        update();
        lastScrollPosition = currentScrollPosition;
      }
    };
    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [container, everyPx]);
}
