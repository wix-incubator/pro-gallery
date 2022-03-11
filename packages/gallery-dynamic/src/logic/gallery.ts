import React from 'react';
import { IGallery } from '../types/gallery';

export const GalleryContext = React.createContext<IGallery>(null as any);

export const useGallery = () => React.useContext(GalleryContext);

export const useSettings = () => useGallery().settings;
