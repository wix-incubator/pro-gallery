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

  const setIsUnknownDimensions = isUnknownDimensions => {
    setContext({isUnknownDimensions});
  };

  const setIsAvoidGallerySelfMeasure = isAvoidGallerySelfMeasure => {
    setContext({isAvoidGallerySelfMeasure});
  };

  const setGallerySettings = gallerySettings => {
    setContext({gallerySettings: {...context.gallerySettings, ...gallerySettings}});
  };

  const setShowAllStyles = showAllStyles => {
    setContext({showAllStyles});
  };

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
    isUnknownDimensions: context.isUnknownDimensions,
    isAvoidGallerySelfMeasure: context.isAvoidGallerySelfMeasure,
    setIsUnknownDimensions,
    setIsAvoidGallerySelfMeasure,
    gallerySettings: context.gallerySettings || {},
    setGallerySettings,
    showAllStyles: context.showAllStyles,
    setShowAllStyles,
    dimensions: {
      width: context.galleryWidth,
      height: context.galleryHeight,
    },
    setDimentions
  };

  return res;
}
