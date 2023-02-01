import React from 'react';

const GalleryContext = React.createContext({});
console.log(
  'Adding context................................................................'
);
export const GalleryProvider = ({ children, ...rest }) => {
  const galleryUI = rest.customComponents.EXPERIMENTAL_customGalleryUI;
  return (
    <GalleryContext.Provider value={{ galleryUI }}>
      {children}
    </GalleryContext.Provider>
  );
};

export const useGalleryUI = () => {
  const { galleryUI } = React.useContext(GalleryContext);
  return galleryUI;
};
