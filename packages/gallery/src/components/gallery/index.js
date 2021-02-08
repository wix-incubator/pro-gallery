import React from 'react';
import {
  defaultStyles,
  BlueprintsManager,
  GALLERY_CONSTS,
  utils,
} from 'pro-gallery-lib';
import ProGallery from './proGallery/proGallery';
import basePropTypes from './proGallery/propTypes';

export default class BaseGallery extends React.Component {
  constructor(props) {
    super();
    this.blueprintsManager = new BlueprintsManager({ id: 'layoutingGallery' });
    this.domId = props.domId || 'default-dom-id';
    this.state = {
      blueprint: this.blueprintsManager.existingBlueprint || null,
    };
    this.blueprintsManager.init({
      api: {
        isUsingCustomInfoElements: () =>
          props.customHoverRenderer ||
          props.customInfoRenderer ||
          props.customSlideshowInfoRenderer,
        fetchMoreItems: (from) => {
          typeof props.eventsListener === 'function' &&
            props.eventsListener(GALLERY_CONSTS.events.NEED_MORE_ITEMS, from);
        },
        onBlueprintReady: ({ blueprint, blueprintChanged }) => {
          if (blueprintChanged) {
            this.setBlueprint(blueprint);
          } else {
            if (utils.isVerbose()) {
              console.count('>>> Blueprint not changed, not setting it');
            }
          }
        },
      },
    });
    this.onNewProps(props);
  }
  setBlueprint(blueprint) {
    this.setState({ blueprint });
  }
  static propTypes = basePropTypes;
  onNewProps(props) {
    const {
      styles,
      options,
      styleParams,
      eventsListener,
      ...otherProps
    } = props;
    const _eventsListener = (...args) => {
      const [eventName, value] = args;
      if (eventName === GALLERY_CONSTS.events.NEED_MORE_ITEMS) {
        this.blueprintsManager.getMoreItems(value);
      } else {
        typeof eventsListener === 'function' && eventsListener(...args);
      }
    };
    const _styles = { ...defaultStyles, ...options, ...styles, ...styleParams };
    this.galleryProps = {
      ...otherProps,
      styles: _styles,
      eventsListener: _eventsListener,
      domId: this.domId,
    };

    this.blueprintsManager.createBlueprint(this.galleryProps).catch((e) => {
      //TODOVER3 check totalItemsCount
      console.error(
        'Could not breate a blueprints in layoutingIndex from given props',
        e
      );
    });
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
