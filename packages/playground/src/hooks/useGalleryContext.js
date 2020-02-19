import {useContext} from 'react';
import {GalleryContext} from './GalleryContext';
import {getInitialStyleParams} from '../constants/styleParams';
import { addPresetStyles } from 'pro-gallery/dist/src/components/gallery/presets/presets'


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

  const setGallerySettings = _gallerySettings => {
    const gallerySettings = {...getGallerySettings(), ..._gallerySettings};
    setContext({gallerySettings});
    try {
      console.log('Saving gallerySettings to localStorage', gallerySettings)
      localStorage.gallerySettings = JSON.stringify(gallerySettings);
    } catch (e) {
      console.error('Could not save gallerySettings', e);
    }
  };

  const getGallerySettings = () => {
    if (typeof context.gallerySettings === 'object') {
      return context.gallerySettings
    } else {
      try {
        console.log('Getting gallerySettings from localStorage', localStorage.gallerySettings)
        return JSON.parse(localStorage.gallerySettings) || {};
      } catch (e) {
        // console.error('Could not get gallerySettings', e);
        return {};
      }
    }
  }

  const res = {
    showSide: context.showSide,
    setShowSide,
    preset: context.preset,
    setPreset,
    styleParams: addPresetStyles(context.styleParams),
    setStyleParams,
    items: context.items,
    setItems,
    galleryReady: context.galleryReady,
    setGalleryReady,
    gallerySettings: getGallerySettings(),
    setGallerySettings,
    dimensions: {
      width: context.galleryWidth,
      height: context.galleryHeight,
    },
    setDimentions
  };

  return res;
}
