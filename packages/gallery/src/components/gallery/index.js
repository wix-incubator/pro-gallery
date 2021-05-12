import React from 'react';
import { BlueprintsManager, GALLERY_CONSTS, utils } from 'pro-gallery-lib';
import ProGallery from './proGallery/proGallery';
import basePropTypes from './proGallery/propTypes';

export default class BaseGallery extends React.Component {
  constructor(props) {
    super();
    this.blueprintsManager = new BlueprintsManager({ id: 'layoutingGallery' });
    this.domId = props.domId || 'default-dom-id';
    this.isUsingCustomInfoElements =
      props.customHoverRenderer ||
      props.customInfoRenderer ||
      props.customSlideshowInfoRenderer;
    this.blueprintsManager.init({
      api: {
        isUsingCustomInfoElements: () => this.isUsingCustomInfoElements,
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
    this.state = {
      blueprint: this.blueprintsManager.createInitialBlueprint(props) || null,
    };
    this.onNewProps(props, 'constructor');
  }

  setBlueprint(blueprint, initialBlueprint) {
    if (initialBlueprint) {
      // the blueprint from the initial blueprint flow will be set in the constructor
    } else {
      this.setState({ blueprint });
    }
  }

  static propTypes = basePropTypes;
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
      domId: this.domId,
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
    this.onNewProps(newProps);
  }

  render() {
    const { blueprint } = this.state;

    if (blueprint && Object.keys(blueprint).length > 0) {
      return <ProGallery {...this.galleryProps} {...blueprint} />;
    } else {
      return null;
    }
  }
}
