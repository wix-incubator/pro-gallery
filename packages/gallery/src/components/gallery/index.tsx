import React from 'react';
import { BlueprintsManager, GALLERY_CONSTS, utils } from 'pro-gallery-lib';
import ProGallery from './proGallery/proGallery';
import { GalleryProps, GalleryState } from './galleryTypes';
import shouldValidate from './typeValidator/shouldValidate';

export default class BaseGallery extends React.Component<
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
      formFactor: props.formFactor,
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
      !!this.galleryProps.customHoverRenderer ||
      !!this.galleryProps.customInfoRenderer ||
      !!this.galleryProps.customSlideshowInfoRenderer
    );
  }

  onNewProps(props, calledByConstructor) {
    const { eventsListener, ...otherProps } = props;
    const _eventsListener = (...args) => {
      const [eventName, value] = args;
      if (eventName === GALLERY_CONSTS.events.NEED_MORE_ITEMS) {
        this.blueprintsManager.getMoreItems(value);
      } else {
        typeof eventsListener === 'function' && eventsListener(...args);
      }
    };
    this.galleryProps = {
      ...otherProps,
      eventsListener: _eventsListener,
      domId: props.domId || 'default-dom-id',
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

  UNSAFE_componentWillReceiveProps(newProps) {
    this.onNewProps(newProps, false);
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
    const typeErrors = validate(
      this.props.options || this.props.styles || this.props.styleParams
    );
    if (typeErrors.length > 0) {
      this.setState({ typeErrors: typeErrorsUI(typeErrors) });
    }
  }
}
