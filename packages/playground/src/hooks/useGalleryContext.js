import {useContext} from 'react';
import {GalleryContext} from './GalleryContext';
import {getInitialStyleParams, getStyleParamsFromUrl} from '../constants/styleParams';
import { addPresetStyles } from 'pro-gallery';
import {SIDEBAR_WIDTH} from '../constants/consts';
import {utils} from 'pro-gallery-lib';

export function useGalleryContext(blueprintsManager) {
  const [context, setContext] = useContext(GalleryContext);

  const setShowSide = (newShowSide) => {
    setGallerySettings({showSide: newShowSide});
//    const widthChange = SIDEBAR_WIDTH * (newShowSide ? -1 : 1)

  //  setDimensions({width: calcGalleryDimensions().width + widthChange});
    setDimensions()
  };

  const setDimensions = (config = {}) => {
    const {width, height} = config;
    const newContext = { 
      dimensions: {
        ...calcGalleryDimensions(),
        ...(width && {width}),
        ...(height && {height}),
      }
    };

    if(getGallerySettings().useBlueprints) {
      blueprintsManager.createBlueprint({...newContext})
    }

    setContext(newContext);
  };

  const setPreset = newPreset => {
    const newContext = {
      preset: newPreset,
      styleParams: getInitialStyleParams(newPreset)
    };

    if(getGallerySettings().useBlueprints) {
      blueprintsManager.createBlueprint({...newContext})
    }

    setContext(newContext);
  };


  const setStyleParams = (newProp, value) => {

    // console.log(`[STYLE PARAMS - VALIDATION] settings styleParam in the context`, newProp, value, context.styleParams);
    const newContext = {styleParams: {...getStyleParamsFromUrl(), [newProp]: value}}
    if(getGallerySettings().useBlueprints) {
      blueprintsManager.createBlueprint({...newContext})
    }
    // console.log(`[STYLE PARAMS - VALIDATION] settings styleParams in the context`, newContext.styleParams);

    setContext(newContext);
  };


  const setItems = items => {

    const newContext = {items};
    if(getGallerySettings().useBlueprints) {
      blueprintsManager.createBlueprint({...newContext})
    }

    setContext(newContext);
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
    setContext(newContext);
    try {
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

  const calcGalleryDimensions = () => {
    let dimensions = {};
    const showSide = !!getGallerySettings().showSide && !utils.isMobile();
    dimensions.width = !showSide ? window.innerWidth : window.innerWidth - SIDEBAR_WIDTH;
    dimensions.height = window.innerHeight;

    return dimensions;
  };
  
  

  const res = {
    showSide: context.showSide,
    setShowSide,
    preset: context.preset,
    setPreset,
    styleParams: addPresetStyles(context.styleParams || getInitialStyleParams()), //TODO - this is a double even for the normal flow - maybe used for the sidebar somehow?
    setStyleParams,
    items: context.items,
    setItems,
    blueprint: context.blueprint,
    setBlueprint,
    galleryReady: context.galleryReady,
    setGalleryReady,
    gallerySettings: getGallerySettings(),
    setGallerySettings,
    dimensions: context.dimensions || calcGalleryDimensions(),
    setDimensions,
  };

  return res;
}
