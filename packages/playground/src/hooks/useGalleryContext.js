import { useContext } from 'react';
import { GalleryContext } from './GalleryContext';
import {
  getInitialOptions,
  getOptionsFromUrl,
} from '../constants/options';
import { addPresetOptions } from 'pro-gallery';
import { SIDEBAR_WIDTH } from '../constants/consts';
import {
  utils,
  flatToNested,
} from 'pro-gallery-lib';


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
    let { items, options, container } = params;

    container = container || context.container || calcGalleryContainer();
    const _options = options || context.options || flatToNested(getInitialOptions());
    const url = `https://www.wix.com/_serverless/pro-gallery-blueprints-server/createBlueprint`;

    if (!items || !container || !_options) {
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
        options,
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
      options: flatToNested(getInitialOptions(newPreset)),
    };

    if (getGallerySettings().useBlueprints) {
      requestNewBlueprint(newContext);
    }

    setContext(newContext);
  };

  const setOptions = (newProp, value) => {
    // console.log(`[OPTIONS - VALIDATION] settings options in the context`, newProp, value, context.options);
    const options = flatToNested({
      ...getInitialOptions(),
      ...getOptionsFromUrl(window.location.search),
      [newProp]: value,
    })
    console.log('setting new context and requesting BP', options.layoutParams)
    const newContext = {
      options,
    };
    if (getGallerySettings().useBlueprints) {
      requestNewBlueprint(newContext);
    }
    // console.log(`[OPTIONS - VALIDATION] settings options in the context`, newContext.options);

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
    options: addPresetOptions(
      context.options || flatToNested(getInitialOptions())
    ), //TODO - this is a double even for the normal flow - maybe used for the sidebar somehow?
    setOptions,
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
