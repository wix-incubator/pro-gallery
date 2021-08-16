/* eslint-disable prettier/prettier */
import React from 'react';
import { GalleryComponent } from '../galleryComponent';

export default class TextItem extends GalleryComponent {
  constructor(props) {
    super(props);
    if (typeof this.props.actions.setItemLoaded === 'function') {
      this.props.actions.setItemLoaded();
    }
  }

  getTextDimensions() {
  const { style, styleParams, cropRatio, imageDimensions } = this.props;
    const isVerticalItem = style.ratio < cropRatio - 0.01;
    const { marginLeft, marginTop } = imageDimensions;
    //text dimensions include scaling
    const textHeight =
      (isVerticalItem
        ? style.height / style.maxHeight
        : style.width / style.maxWidth) * style.maxHeight;
    const textWidth =
      (!isVerticalItem
        ? style.width / style.maxWidth
        : style.height / style.maxHeight) * style.maxWidth;
    const translate =
      styleParams.cubeType === 'fit'
        ? '0, 0'
        : `${Math.round((style.width - textWidth) / 2)}px, ${Math.round(
            (style.height - textHeight) / 2
          )}px`;
    const scale = isVerticalItem
      ? style.height / style.maxHeight
      : style.width / style.maxWidth;
      const transform = `translate(${translate}) scale(${scale})`;
    const scaledMarginLeft = Math.round(marginLeft / scale);
    const scaledMarginTop = Math.round(marginTop / scale);
    return {
      width: style.maxWidth + 'px',
      height: style.maxHeight + 'px',
      marginLeft: scaledMarginLeft,
      marginTop: scaledMarginTop,
      transformOrigin: `${-scaledMarginLeft}px ${-scaledMarginTop}px`,
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
    const { id, styleParams, html, style, actions, imageDimensions } =
      this.props;
    const processedHtml = this.processInnerhtml(html);
    const dimensions = this.getTextDimensions();
    const htmlParam = { dangerouslySetInnerHTML: { __html: processedHtml } };
    const changeBgColor = {
      style: Object.assign(
        dimensions,
        styleParams.cubeType === 'fit' ? { backgroundColor: style.bgColor } : {}
      ),
    };
    const attributes = {
      ...htmlParam,
      ...changeBgColor,
    };
    const itemContentStyle = {
      height:
        imageDimensions && !this.props.isPrerenderMode
          ? imageDimensions.height
          : 'inherit',
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
/* eslint-enable prettier/prettier */
