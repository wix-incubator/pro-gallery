import React from 'react';
import CustomButton from '../buttons/customButton.js';
import ItemTitle from './itemTitle.js';
import ItemDescription from './itemDescription.js';
import lineHeightFixer from './lineHeightFixer.js';
import Consts from 'photography-client-lib/dist/src/utils/consts';
import utils from '../../../utils';

export default class Texts extends React.Component {

  getElementClassNames() {
    const {showShare, styleParams, isNarrow} = this.props;
    const classNames = ['gallery-item-text'];
    if (showShare) {
      classNames.push('hidden');
    }
    if (styleParams.showArrows) {
      classNames.push('padded-horizontal');
    }
    if (isNarrow) {
      classNames.push('narrow-item');
    }

    return classNames.join(' ');
  }

  allowAnyAction() {
    const {styleParams} = this.props;
    return styleParams.loveButton || styleParams.allowSocial || styleParams.allowDownload;
  }

  getElementStyle() {
    const {styleParams, style} = this.props;
    const textsDisplayOnHover = !styleParams.isSlideshow && !styleParams.isSlider && !styleParams.hasThumbnails && (styleParams.titlePlacement === Consts.placements.SHOW_ON_HOVER);
    const isCentered = style.justifyContent === 'center';
    const elementStyle = {
      justifyContent: styleParams.galleryVerticalAlign,
      alignItems: styleParams.galleryHorizontalAlign,
      textAlign: styleParams.galleryTextAlign,
    };

    //Set the texts fixed height considering the height of the love and share buttons which is about 100px;
    if (textsDisplayOnHover && this.allowAnyAction()) {
      elementStyle.paddingBottom = 45;
    }

    if (isCentered) {
      elementStyle.marginTop = style.height / 15;
    }

    return elementStyle;
  }

  getItemTexts() {
    const {title, description, id, styleParams, style, isSmallItem, isNarrow, shouldShowButton} = this.props;
    const shouldShowTitle = title && !isSmallItem && styleParams.allowTitle;
    const shouldShowDescription = description && !isSmallItem && styleParams.allowDescription;
    //if there is a description, it will take care of the bottom part.
    //if no description: if there are actions, we will add marginBottom of 20. if no actions, we will add marginBottom of 0.
    const titleStyle = shouldShowDescription ? {} : (this.allowAnyAction() ? {marginBottom: 20} : {marginBottom: 0});
    const titleSpanStyle = {};
    const descStyle = {};
    if (utils.isMobile()) {
      if (styleParams.isSlideshowFont) {
        if (typeof styleParams.itemFontSlideshow !== 'undefined') {
          titleSpanStyle.font = styleParams.itemFontSlideshow.value.slice(5, -1);
        }
        if (typeof styleParams.itemDescriptionFontSlideshow !== 'undefined') {
          descStyle.font = styleParams.itemDescriptionFontSlideshow.value.slice(5, -1);
        }
        if (typeof styleParams.itemFontColorSlideshow !== 'undefined') {
          titleSpanStyle.color = styleParams.itemFontColorSlideshow.value;
        }
        if (typeof styleParams.itemDescriptionFontColorSlideshow !== 'undefined') {
          descStyle.color = styleParams.itemDescriptionFontColorSlideshow.value;
        }
      } else {
        if (typeof styleParams.itemFont !== 'undefined') {
          titleSpanStyle.font = styleParams.itemFont.value.slice(5, -1);
        }
        if (typeof styleParams.itemDescriptionFont !== 'undefined') {
          descStyle.font = styleParams.itemDescriptionFont.value.slice(5, -1);
        }
        if (typeof styleParams.itemFontColor !== 'undefined') {
          titleSpanStyle.color = styleParams.itemFontColor.value;
        }
        if (typeof styleParams.itemDescriptionFontColor !== 'undefined') {
          descStyle.color = styleParams.itemDescriptionFontColor.value;
        }
      }
    }

    const titleElem = shouldShowTitle && <ItemTitle
      key={'item-title-' + id}
      title={title}
      style={{titleStyle, titleSpanStyle}}
    />;
    const descriptionElem = shouldShowDescription && <ItemDescription description={description} key={'item-description-' + id} style={descStyle}/>;
    const buttonElem = shouldShowButton && <CustomButton type="button" styleParams={styleParams} style={style} small={isNarrow}/>;

    const shouldHideElement = !titleElem && !descriptionElem && !buttonElem;
    if (shouldHideElement) {
      return null;
    }

    const elementStyle = this.getElementStyle();
    const classNames = this.getElementClassNames();

    return (
      <div style={elementStyle}
           ref={x => this.container = x}
           className={classNames}
           dir="auto" >
        {titleElem}
        {descriptionElem}
        {buttonElem}
      </div>
    );

  }

  tryFixLineHeight() {
    try {
      lineHeightFixer.fix(this.props, this.container);
    } catch (e) {
      if (utils.isVerbose()) {
        console.error('Error on componentDidUpdate', e);
      }
    }

  }

  componentDidUpdate(prevProps) {
    if (lineHeightFixer.shouldFix(prevProps, this.props)) {
      this.tryFixLineHeight();
    }
  }

  componentDidMount() {
    this.tryFixLineHeight();
    setTimeout(
      () => {
        this.tryFixLineHeight(); //waiting for wix inline styles to take affect
      }, 1000
    );
  }

  render() {
    return this.getItemTexts();
  }
}
