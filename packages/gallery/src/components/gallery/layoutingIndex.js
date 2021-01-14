import React from 'react';
import {
  defaultStyles,
  BlueprintsManager,
  GALLERY_CONSTS,
  utils,
} from 'pro-gallery-lib';
import ProGallery from './proGallery/proBlueprintsGallery';
import basePropTypes from './proGallery/propTypes';

const blueprintsManager = new BlueprintsManager({ id: 'layoutingGallery' });
export default class BaseGallery extends React.Component {
  constructor(props) {
    super();
    this.domId = props.domId || 'default-dom-id';
    this.state = {
      blueprint: null,
    };
    blueprintsManager.init({
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
        blueprintsManager.getMoreItems(value);
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

    blueprintsManager.createBlueprint(this.galleryProps).catch((e) => {
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
