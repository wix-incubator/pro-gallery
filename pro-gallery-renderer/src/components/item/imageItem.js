import React from 'react';
import utils from '../../utils/index.js';
import Consts from 'photography-client-lib/dist/src/utils/consts';
//import window from 'photography-client-lib/dist/src/sdk/windowWrapper';
import {pgScrollSteps, pgScrollClassName} from '../../constants/cssScroll';

export default class ImageItem extends React.Component {

  constructor() {
    super();
    this.scrollCss = '';
    this.domId = 'pgi' + Math.floor(Math.random() * 1000000);
    this.useRefactoredProGallery = !!(window && window.petri && window.petri['specs.pro-gallery.newGalleryContainer'] === 'true');
    this.useCssScrolling = this.useRefactoredProGallery;
  }

  calcScrollCssIfNeeded() {

    if (!this.useCssScrolling) {
      return;
    }

    const {dimensions, scrollBase, resized_url, styleParams} = this.props;
    const scrollCssProps = JSON.stringify({dimensions, scrollBase, resized_url, oneRow: styleParams.oneRow, loadingMode: styleParams.imageLoadingMode});
    if (scrollCssProps === this.scrollCssProps) {
      return;
    }
    this.scrollCssProps = scrollCssProps;
    this.scrollCss = '';

    const screenSize = (styleParams.oneRow ? window.screen.width : window.screen.height);

    const ceil = (num, step) => Math.ceil(num / step) * step;
    const floor = (num, step) => Math.max(0, Math.floor(num / step) * step);
    const imageTop = styleParams.oneRow ? (dimensions.left - screenSize) : (dimensions.top - screenSize + scrollBase);
    const imageBottom = styleParams.oneRow ? (dimensions.left + dimensions.width) : (dimensions.top + dimensions.height + scrollBase);
    const minStep = pgScrollSteps[pgScrollSteps.length - 1];

    const createScrollClasses = (padding, isInner) => {
      let from = floor(imageTop - padding[0], minStep);
      const to = ceil(imageBottom + padding[1], minStep);
      const scrollClasses = [];
      while (from < to) {
        const largestDividerIdx = pgScrollSteps.findIndex(step => (from % step === 0 && from + step <= to)); //eslint-disable-line
        scrollClasses.push(`.${pgScrollClassName}-${largestDividerIdx}-${from} #${this.domId}${isInner ? '>div' : ''}`);
        from += pgScrollSteps[largestDividerIdx];
        // console.count('pgScroll class created');
      }
      return scrollClasses.join(', ');
    };

    const inScreenPadding = [0, 0];
    const visiblePadding = [screenSize * 3, screenSize];
    const renderedPadding = [screenSize * 5, screenSize * 3];

    //load hi-res image + loading transition
    this.scrollCss += createScrollClasses(visiblePadding, true) + `{opacity: 1; background-image: url(${resized_url.img})}`;

    //this code adds classes for the rendered padding (removing the blurry image)
    if (!(utils.deviceHasMemoryIssues() || styleParams.imageLoadingMode === Consts.loadingMode.COLOR)) {
      //remove blurry thumbnail background
      this.scrollCss += createScrollClasses(inScreenPadding, false) + `{background-image: none}`;
      // add blurred background-image
      this.scrollCss += createScrollClasses(renderedPadding, false) + `{background-image: url(${resized_url.thumb})}`;
    }

    // console.count('pgScroll item created');
  }

  render() {
    this.calcScrollCssIfNeeded();
    const {isThumbnail, alt, visible, loaded, displayed, styleParams, imageDimensions, resized_url, id, actions, settings} = this.props;
    const imageProps = (settings && settings.imageProps && (typeof settings.imageProps === 'function')) ? settings.imageProps(id) : {};
    const backgroundStyle = (this.useCssScrolling || utils.deviceHasMemoryIssues() || styleParams.imageLoadingMode === Consts.loadingMode.COLOR) ? {} : {backgroundImage: `url(${resized_url.thumb})`}; //remove this inline style if rendered padding (using css) is used

    const imageItemClassName = [
      'image-item',
      'gallery-item-visible',
      'gallery-item',
      'gallery-item-preloaded',
      (loaded && !this.useCssScrolling ? 'gallery-item-loaded' : ''),
      ((styleParams.cubeImages && styleParams.cubeType === 'fit') ? 'grid-fit' : ''),
      (styleParams.imageLoadingMode === Consts.loadingMode.COLOR ? 'load-with-color' : '')
    ].join(' ');

    if (visible || this.useCssScrolling) {
      return <div
        id={this.domId}
        className={imageItemClassName}
        onTouchStart={actions.handleItemMouseDown}
        onTouchEnd={actions.handleItemMouseUp}
        key={'image_container-' + id}
        data-hook={'image-item'}
        style={displayed ? {} : backgroundStyle}
        >
        {this.useCssScrolling ? <style>
          {this.scrollCss}
        </style> : null}
        {this.useCssScrolling ? <div
            key={((styleParams.cubeImages && styleParams.cubeType === 'fill') ? 'cubed-' : '') + 'image'}
            className={'gallery-item-visible gallery-item gallery-item-hidden gallery-item-preloaded'}
            style={imageDimensions}
            {...imageProps}
          /> : <img
            onLoad={actions.setItemLoaded}
            key={((styleParams.cubeImages && styleParams.cubeType === 'fill') ? 'cubed-' : '') + 'image'}
            className={'gallery-item-visible gallery-item ' + (loaded ? 'gallery-item-loaded' : 'gallery-item-hidden')}
            src={resized_url.img}
            alt={isThumbnail ? '' : alt}
            onError={actions.setItemError}
            style={imageDimensions}
            {...imageProps}
          />}
      </div>;
    } else {
      return <div
        className={imageItemClassName}
        key={'image_container-' + id}
        style={backgroundStyle}
        data-hook={'image-item'}
      >
        <img onLoad={actions.setItemLoaded}
             key={'image-' + id}
             className={'gallery-item-hidden gallery-item'}
             style={imageDimensions}
             alt={isThumbnail ? '' : alt}
             src=""
        />
      </div>;
    }
  }
}
