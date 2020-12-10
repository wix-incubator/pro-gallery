import { useContext } from 'react';
import { GalleryContext } from './GalleryContext';
import {
  getInitialStyleParams,
  getStyleParamsFromUrl,
} from '../constants/styleParams';
import { addPresetStyles } from 'pro-gallery';
import { SIDEBAR_WIDTH } from '../constants/consts';
import { utils } from 'pro-gallery-lib';

export function useGalleryContext(
  blueprintsManager,
) {
  const [context, setContext] = useContext(GalleryContext);

  const setShowSide = (newShowSide) => {
    setGallerySettings({ showSide: newShowSide });
    //    const widthChange = SIDEBAR_WIDTH * (newShowSide ? -1 : 1)

    //  setDimensions({width: calcGalleryDimensions().width + widthChange});
    setDimensions();
  };

  const getBlueprintFromServer = async (params) => {
    let { items, styleParams, dimensions } = params;

    dimensions = dimensions || context.dimensions || calcGalleryDimensions();
    const styles = styleParams || context.styleParams || getInitialStyleParams();
    const url = `https://www.wix.com/_serverless/pro-gallery-blueprints-server/createBlueprint`;

    if (!items || !dimensions || !styles) {
      return;
    }
    
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'omit', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items,
        styles,
        dimensions
      }) // body data type must match "Content-Type" header
    });
    const data = await response.json();
    setBlueprint(data.blueprint);
  };

  const requestNewBlueprint = (newContext, settingNewItems) => {
    if (getGallerySettings().shouldUseBlueprintsFromServer) {
      getBlueprintFromServer({ ...context, ...newContext });
    } else {
      if (settingNewItems) {
        blueprintsManager.resetItemLooping();
      }
      blueprintsManager.createBlueprint({ ...newContext });
    }
  };

  const setDimensions = (config = {}) => {
    const { width, height } = config;
    const newContext = {
      dimensions: {
        ...calcGalleryDimensions(),
        ...(width && { width }),
        ...(height && { height }),
      },
    };

    if (
      JSON.stringify(newContext.dimensions) !==
      JSON.stringify({ ...context.dimensions })
    ) {
      if (getGallerySettings().useBlueprints) {
        requestNewBlueprint(newContext);
      }

      setContext(newContext);
    }
  };

  const setPreset = (newPreset) => {
    const newContext = {
      preset: newPreset,
      styleParams: getInitialStyleParams(newPreset),
    };

    if (getGallerySettings().useBlueprints) {
      requestNewBlueprint(newContext);
    }

    setContext(newContext);
  };

  const setStyleParams = (newProp, value) => {
    // console.log(`[STYLE PARAMS - VALIDATION] settings styleParam in the context`, newProp, value, context.styleParams);
    const newContext = {
      styleParams: {
        ...getInitialStyleParams(),
        ...getStyleParamsFromUrl(),
        [newProp]: value,
      },
    };
    if (getGallerySettings().useBlueprints) {
      requestNewBlueprint(newContext);
    }
    // console.log(`[STYLE PARAMS - VALIDATION] settings styleParams in the context`, newContext.styleParams);

    setContext(newContext);
  };

  const setItems = (items) => {
    const newContext = { items };
    if (getGallerySettings().useBlueprints) {
      requestNewBlueprint(newContext, true);
    }

    setContext(newContext);
  };

  const setBlueprint = (blueprint) => {
    setContext({ blueprint });
  };

  const setGalleryReady = (galleryReady) => {
    setContext({ galleryReady });
  };

  const setGallerySettings = (_gallerySettings) => {
    const gallerySettings = { ...getGallerySettings(), ..._gallerySettings };
    const newContext = { gallerySettings };
    setContext(newContext);
    try {
      localStorage.gallerySettings = JSON.stringify(gallerySettings);
    } catch (e) {
      console.error('Could not save gallerySettings', e);
    }
  };

  const getGallerySettings = () => {
    if (typeof context.gallerySettings === 'object') {
      return context.gallerySettings;
    } else {
      try {
        return JSON.parse(localStorage.gallerySettings) || {};
      } catch (e) {
        // console.error('Could not get gallerySettings', e);
        return {};
      }
    }
  };

  const calcGalleryDimensions = () => {
    let dimensions = {};
    const showSide = !!getGallerySettings().showSide && !utils.isMobile();
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!getGallerySettings().isUnknownDimensions) {
      dimensions = !utils.isMobile()
        ? {
            width: 500,
            height: 500,
          }
        : {
            width: 320,
            height: 500,
          };
    } else {
      dimensions.width = !showSide
        ? window.innerWidth
        : window.innerWidth - SIDEBAR_WIDTH;
      dimensions.height = window.innerHeight;
    }

    return dimensions;
  };

  const res = {
    showSide: context.showSide,
    setShowSide,
    preset: context.preset,
    setPreset,
    styleParams: addPresetStyles(
      context.styleParams || getInitialStyleParams()
    ), //TODO - this is a double even for the normal flow - maybe used for the sidebar somehow?
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
    getBlueprintFromServer,
  };

  return res;
}
