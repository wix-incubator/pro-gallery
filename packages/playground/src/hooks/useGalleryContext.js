import { useContext } from 'react';
import { GalleryContext } from './GalleryContext';
import {
  getInitialStyleParams,
  getStyleParamsFromUrl,
} from '../constants/styleParams';
import { addPresetStyles } from 'pro-gallery';
import { SIDEBAR_WIDTH } from '../constants/consts';
import { utils, flatToNested } from 'pro-gallery-lib';

export function useGalleryContext(
  blueprintsManager,
) {
  const [context, setContext] = useContext(GalleryContext);

  const setShowSide = (newShowSide) => {
    setGallerySettings({ showSide: newShowSide });
    //    const widthChange = SIDEBAR_WIDTH * (newShowSide ? -1 : 1)

    //  setDimensions({width: calcGalleryContainer().width + widthChange});
    setContainer();
  };

  const getBlueprintFromServer = async (params) => {
    let { items, styleParams, container } = params;

    container = container || context.container || calcGalleryContainer();
    const styles = styleParams || context.styleParams || flatToNested(getInitialStyleParams());
    const url = `https://www.wix.com/_serverless/pro-gallery-blueprints-server/createBlueprint`;

    if (!items || !container || !styles) {
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
        container
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

  const setContainer = (config = {}) => {
    const { width, height } = config;
    const newContext = {
      container: {
        ...calcGalleryContainer(),
        ...(width && { width }),
        ...(height && { height }),
      },
    };

    if (
      JSON.stringify(newContext.container) !==
      JSON.stringify({ ...context.container })
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
      styleParams: flatToNested(getInitialStyleParams(newPreset)),
    };

    if (getGallerySettings().useBlueprints) {
      requestNewBlueprint(newContext);
    }

    setContext(newContext);
  };

  const setStyleParams = (newProp, value) => {
    // console.log(`[STYLE PARAMS - VALIDATION] settings styleParam in the context`, newProp, value, context.styleParams);
    const styleParams = flatToNested({
      ...getInitialStyleParams(),
      ...getStyleParamsFromUrl(),
      [newProp]: value,
    })
    console.log('setting new context and requesting BP', styleParams.layoutParams)
    const newContext = {
      styleParams,
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

  const calcGalleryContainer = () => {
    let container = {};
    const showSide = !!getGallerySettings().showSide && !utils.isMobile();
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!getGallerySettings().isUnknownDimensions) {
      container = !utils.isMobile()
        ? {
            width: 500,
            height: 500,
          }
        : {
            width: 320,
            height: 500,
          };
    } else {
      container.width = !showSide
        ? window.innerWidth
        : window.innerWidth - SIDEBAR_WIDTH;
      container.height = window.innerHeight;
    }

    return container;
  };

  const res = {
    showSide: context.showSide,
    setShowSide,
    preset: context.preset,
    setPreset,
    styleParams: addPresetStyles(
      context.styleParams || flatToNested(getInitialStyleParams())
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
    container: context.container || calcGalleryContainer(),
    setContainer,
    getBlueprintFromServer,
  };

  return res;
}
