import { isPrerenderMode } from 'pro-gallery-lib';
import React from 'react';
import { GalleryComponent } from '../galleryComponent';

export default class TextItem extends GalleryComponent {
  constructor(props){
    super(props);
    if (typeof this.props.actions.setItemLoaded === 'function') {
      this.props.actions.setItemLoaded();
    }
  }

  getTextDimensions() {
    const { style, styleParams, cubeRatio, imageDimensions } = this.props;
    const isVerticalItem = style.ratio < cubeRatio - 0.01;
    //text dimensions include scaling
    const textHeight =
      (isVerticalItem
        ? style.height / style.maxHeight
        : style.width / style.maxWidth) * style.maxHeight;
    const textWidth =
      (!isVerticalItem
        ? style.width / style.maxWidth
        : style.height / style.maxHeight) * style.maxWidth;
    const translate = styleParams.cubeType === 'fit' ? '0, 0' : `${Math.round((style.width - textWidth) / 2)}px, ${Math.round((style.height - textHeight) / 2)}px`
    const transform = `translate(${translate}) scale(${(isVerticalItem ? style.height / style.maxHeight : style.width / style.maxWidth)}`;
    return {
      width: style.maxWidth + 'px',
      height: style.maxHeight + 'px',
      transformOrigin: '0 0',
      WebkitTransform: transform,
      MsTransform: transform,
      OTransform: transform,
      transform,
    };
  }

  processInnerhtml(html) {
    // Remove html class name from inner html elements
    // In older version of the text editor we used font themes (set as classes). Without the iframe it clashes with Santa's css
    try {
      return html.replace(/class="font_\d+"/gm, '');
    } catch (e) {
      return html;
    }
  }

  render() {
    const {
      id,
      styleParams,
      html,
      style,
      actions,
      imageDimensions,
    } = this.props;
    const processedHtml = this.processInnerhtml(html);
    const dimensions = this.getTextDimensions();
    const htmlParam = { dangerouslySetInnerHTML: { __html: processedHtml } };
    const changeBgColor = {
      style: Object.assign(
        dimensions,
        styleParams.cubeType === 'fit'
          ? { backgroundColor: style.bgColor }
          : {},
      ),
    };
    const attributes = {
      ...htmlParam,
      ...changeBgColor,
    };
    const itemContentStyle = {
      height: imageDimensions && !isPrerenderMode() ? imageDimensions.height : 'inherit',
      backgroundColor:
        styleParams.cubeType !== 'fit' ? style.bgColor : 'inherit',
    };

    if (imageDimensions && imageDimensions.borderRadius) {
      itemContentStyle.borderRadius = imageDimensions.borderRadius;
    }

    return (
      <div className={'gallery-item-content'} style={itemContentStyle}>
        <div
          className={
            'gallery-item-visible gallery-item gallery-item-loaded text-item'
          }
          key={'item-text-' + id}
          onTouchStart={actions.handleItemMouseDown}
          onTouchEnd={actions.handleItemMouseUp}
          data-hook="text-item"
          {...attributes}
        />
      </div>
    );
  }
}
