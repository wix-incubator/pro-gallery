import React from 'react';
import CustomButton from '../buttons/customButton.js';
import ItemTitle from './itemTitle.js';
import ItemDescription from './itemDescription.js';
import lineHeightFixer from './lineHeightFixer.js';
import Consts from 'photography-client-lib/dist/src/utils/consts';
import utils from '../../../utils';
import designConsts from '../../../constants/designConsts.js';
import {settingsVersionManager} from 'photography-client-lib/dist/src/versioning/features/settings';
import _ from 'lodash';


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
    if (textsDisplayOnHover && this.allowAnyAction() && (styleParams.allowTitle || styleParams.allowDescription)) {
      elementStyle.paddingBottom = 70;
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
    const isNewMobileSettings = settingsVersionManager.newMobileSettings();
    const titleSpanStyle = {};
    const descSpanStyle = {};
    let titleStyle, descStyle;
    if (shouldShowDescription) {
      titleStyle = {marginBottom: designConsts.spaceBetweenTitleAndDescription};
    } else if (shouldShowButton) {
      titleStyle = {marginBottom: designConsts.spaceBetweenElements};
    } else {
      titleStyle = {marginBottom: 0};
    }

    if (shouldShowButton) {
      descStyle = {marginBottom: designConsts.spaceBetweenElements};
    } else {
      descStyle = {marginBottom: 0};
    }

    if (utils.isMobile() && isNewMobileSettings) { // ovveride desktop color and fonts
      if (styleParams.isSlideshowFont) {
        if (typeof styleParams.itemFontSlideshow !== 'undefined') {
          titleStyle.font = styleParams.itemFontSlideshow.value;
          titleStyle.textDecoration = styleParams.textDecorationTitle;
        }
        if (typeof styleParams.itemDescriptionFontSlideshow !== 'undefined') {
          descStyle.font = styleParams.itemDescriptionFontSlideshow.value;
          descStyle.textDecoration = styleParams.textDecorationDesc;
        }
        if (typeof styleParams.itemFontColorSlideshow !== 'undefined') {
          titleStyle.color = styleParams.itemFontColorSlideshow.value;
          titleStyle.textDecorationColor = styleParams.itemFontColorSlideshow.value;
        }
        if (typeof styleParams.itemDescriptionFontColorSlideshow !== 'undefined') {
          descStyle.color = styleParams.itemDescriptionFontColorSlideshow.value;
          descStyle.textDecorationColor = styleParams.itemDescriptionFontColorSlideshow.value;
        }
      } else {
        if (typeof styleParams.itemFont !== 'undefined') {
          titleStyle.font = styleParams.itemFont.value;
          titleStyle.textDecoration = styleParams.textDecorationTitle;
        }
        if (typeof styleParams.itemDescriptionFont !== 'undefined') {
          descStyle.font = styleParams.itemDescriptionFont.value;
          descStyle.textDecoration = styleParams.textDecorationDesc;
        }
        if (typeof styleParams.itemFontColor !== 'undefined') {
          titleStyle.color = styleParams.itemFontColor.value;
          titleStyle.textDecorationColor = styleParams.itemFontColor.value;
        }
        if (typeof styleParams.itemDescriptionFontColor !== 'undefined') {
          descStyle.color = styleParams.itemDescriptionFontColor.value;
          descStyle.textDecorationColor = styleParams.itemDescriptionFontColor.value;
        }
      }
    }

    const titleElem = shouldShowTitle && <ItemTitle
      key={'item-title-' + id}
      title={title}
      style={titleStyle}
      spanStyle={titleSpanStyle}
    />;
    const descriptionElem = shouldShowDescription && <ItemDescription
      key={'item-description-' + id}
      description={description}
      style={descStyle}
      spanStyle={descSpanStyle}
    />;
    const buttonElem = shouldShowButton && <CustomButton
      type="button"
      styleParams={styleParams}
      style={style}
      small={isNarrow}
    />;

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

  debouncedTryFixLineHeight = _.debounce(this.tryFixLineHeight, 500);
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
      this.debouncedTryFixLineHeight();
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
