import {useContext} from 'react';
import {GalleryContext} from './GalleryContext';
import {getInitialStyleParams} from '../constants/styleParams';


export function useGalleryContext() {
  const [context, setContext] = useContext(GalleryContext);

  const setDimentions = (width, height) => {
    setContext({
      galleryWidth: width,
      galleryHeight: height,
    });
  };

  const setPreset = newPreset => {
    setContext({
      preset: newPreset,
      styleParams: getInitialStyleParams(newPreset)
    });
  };

  const setShowSide = () => {
    setContext({showSide: !context.showSide});
  };

  const setStyleParams = (newProp, value) => {
    setContext({styleParams: {...context.styleParams, [newProp]: value}});
  };

  const setItems = items => {
    setContext({items});
  };

  const setGalleryReady = galleryReady => {
    setContext({galleryReady});
  };

  const setIsFullWidth = isFullWidth => {
    setContext({isFullWidth});
  };

  const setGallerySettings = gallerySettings => {
    setContext({gallerySettings: {...context.gallerySettings, ...gallerySettings}});
  }

  const res = {
    showSide: context.showSide,
    setShowSide,
    preset: context.preset,
    setPreset,
    styleParams: context.styleParams,
    setStyleParams,
    items: context.items,
    setItems,
    galleryReady: context.galleryReady,
    setGalleryReady,
    isFullWidth: context.isFullWidth,
    setIsFullWidth,
    gallerySettings: context.gallerySettings,
    setGallerySettings,
    dimensions: {
      width: context.galleryWidth,
      height: context.galleryHeight,
    },
    setDimentions
  };

  return res;
}
