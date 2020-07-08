import {useContext} from 'react';
import {GalleryContext} from './GalleryContext';
import {getInitialStyleParams} from '../constants/styleParams';
import { addPresetStyles } from 'pro-gallery';


export function useGalleryContext(blueprintsManager) {
  const [context, setContext] = useContext(GalleryContext);

  const setDimentions = (width, height) => {
    const newContext = {
      galleryWidth: width,
      galleryHeight: height,
    };

    if(getGallerySettings().useBlueprints) {
      setBlueprintParam(newContext);
    } else {
      setContext(newContext);
    }
  };

  const setPreset = newPreset => {
    const newContext = {
      preset: newPreset,
      styleParams: getInitialStyleParams(newPreset)
    };

    if(getGallerySettings().useBlueprints) {
      setBlueprintParam(newContext);
    } else {
      setContext(newContext);
    }
  };

  const setShowSide = () => {
    setContext({showSide: !context.showSide});
  };

  const setStyleParams = (newProp, value) => {

    const newContext = {styleParams: {...context.styleParams, [newProp]: value}}
    if(getGallerySettings().useBlueprints) {
      setBlueprintParam(newContext);
    } else {
      setContext(newContext);
    }
  };

  const setItems = items => {

    const newContext = {items};
    if(getGallerySettings().useBlueprints) {
      setBlueprintParam(newContext);
    } else {
      setContext(newContext);
    }
  };

  const setBlueprint = blueprint => {
    setContext({blueprint});
  };

  const setGalleryReady = galleryReady => {
    setContext({galleryReady});
  };

  const setGallerySettings = _gallerySettings => {
    const gallerySettings = {...getGallerySettings(), ..._gallerySettings};
    const newContext = {gallerySettings}
    if(getGallerySettings().useBlueprints) {
      setBlueprintParam(newContext);
    } else {
      setContext(newContext);
    }
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

  const setBlueprintParam = (newContext) => {
    const blueprint = blueprintsManager.getOrCreateBlueprint({...newContext})
    setContext({blueprint, ...newContext})
  }
  const res = {
    showSide: context.showSide,
    setShowSide,
    preset: context.preset,
    setPreset,
    styleParams: addPresetStyles(context.styleParams), //TODO - this is a double even for the normal flow - maybe used for the sidebar somehow?
    setStyleParams,
    items: context.items,
    setItems,
    blueprint: context.blueprint,
    setBlueprint,
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
