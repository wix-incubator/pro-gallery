import React from 'react';
import { GALLERY_CONSTS, utils } from 'pro-gallery-lib';
import { BlueprintsManager } from 'pro-gallery-blueprints';
import ProGallery from './proGallery/proGallery';

import { GalleryProps, GalleryState } from 'pro-gallery-lib';
import shouldValidate from './typeValidator/shouldValidate';

export default class Gallery extends React.Component<
  GalleryProps,
  GalleryState
> {
  private blueprintsManager: any;
  private galleryProps: any;

  constructor(props: GalleryProps) {
    super(props);
    this.isUsingCustomInfoElements = this.isUsingCustomInfoElements.bind(this);
    this.blueprintsManager = new BlueprintsManager({ id: 'layoutingGallery' });
    this.blueprintsManager.init({
      deviceType: props.deviceType,
      api: {
        isUsingCustomInfoElements: this.isUsingCustomInfoElements,
        fetchMoreItems: (from) => {
          typeof props.eventsListener === 'function' &&
            props.eventsListener(GALLERY_CONSTS.events.NEED_MORE_ITEMS, from);
        },
        onBlueprintReady: ({
          blueprint,
          blueprintChanged,
          initialBlueprint,
        }) => {
          if (blueprintChanged) {
            this.setBlueprint(blueprint, initialBlueprint);
          } else {
            if (utils.isVerbose()) {
              console.count('>>> Blueprint not changed, not setting it');
            }
          }
        },
      },
    });
    this.onNewProps(props, true);
    this.state = {
      blueprint: this.blueprintsManager.createInitialBlueprint(props) || null,
    };
  }

  setBlueprint(blueprint, initialBlueprint) {
    if (initialBlueprint) {
      // the blueprint from the initial blueprint flow will be set in the constructor
    } else {
      this.setState({ blueprint });
    }
  }

  isUsingCustomInfoElements() {
    return (
      !!this.galleryProps.customComponents.customHoverRenderer ||
      !!this.galleryProps.customComponents.customInfoRenderer ||
      !!this.galleryProps.customComponents.customSlideshowInfoRenderer
    );
  }

  onNewProps(props, calledByConstructor) {
    const { eventsListener, ...otherProps } = props;
    const _eventsListener = (eventName, eventData) => {
      if (eventName === GALLERY_CONSTS.events.NEED_MORE_ITEMS) {
        this.blueprintsManager.getMoreItems(eventData);
      } else {
        typeof eventsListener === 'function' &&
          eventsListener(eventName, eventData);
      }
    };
    this.galleryProps = {
      ...otherProps,
      eventsListener: _eventsListener,
      id: props.id || 'default-dom-id',
      customComponents: props.customComponents || {},
    };
    if (calledByConstructor) {
      // the blueprint will be initiated with the state
    } else {
      this.blueprintsManager.createBlueprint(this.galleryProps).catch((e) => {
        //TODOVER3 check totalItemsCount
        console.error('Could not create a blueprint from the new props', e);
      });
    }
  }

  componentDidUpdate() {
    this.onNewProps(this.props, false);
  }

  render() {
    const { blueprint, typeErrors } = this.state;

    if (typeErrors) {
      return typeErrors;
    }
    if (blueprint && Object.keys(blueprint).length > 0) {
      return <ProGallery {...this.galleryProps} {...blueprint} />;
    } else {
      return null;
    }
  }

  async componentDidMount() {
    if (shouldValidate(this.props, utils.isSSR()) === false) {
      return;
    }
    const validateTypesModule = await import(
      /* webpackChunkName: "proGallery_validateTypes" */ './typeValidator/validateTypes'
    );
    const { validate, typeErrorsUI } = validateTypesModule;
    const typeErrors = validate(this.state.blueprint.options);
    if (typeErrors.length > 0) {
      this.setState({ typeErrors: typeErrorsUI(typeErrors) });
    }
  }
}
