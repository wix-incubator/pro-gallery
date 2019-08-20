import React from 'react';
import CustomButton from '../buttons/customButton.js';
import ItemTitle from './itemTitle.js';
import ItemDescription from './itemDescription.js';
import lineHeightFixer from './lineHeightFixer.js';
import PLACEMENTS from '../../../utils/constants/placements';
import utils from '../../../utils';
import designConsts from '../../../constants/designConsts.js';
import { featureManager } from '../../helpers/versionsHelper';
import _ from 'lodash';
import { GalleryComponent } from '../../galleryComponent';

export default class Texts extends GalleryComponent {
  constructor(props) {
    super(props);
    this.debouncedTryFixLineHeight = utils.debounce(this.tryFixLineHeight, 500);
  }

  getElementClassNames() {
    const { showShare, styleParams, isNarrow } = this.props;
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
    const { styleParams } = this.props;
    return (
      styleParams.loveButton ||
      styleParams.allowSocial ||
      styleParams.allowDownload
    );
  }

  getElementStyle() {
    const { styleParams, style } = this.props;
    const textsDisplayOnHover =
      !styleParams.isSlideshow &&
      !styleParams.isSlider &&
      !styleParams.hasThumbnails &&
      (styleParams.titlePlacement === PLACEMENTS.SHOW_ON_HOVER ||
        styleParams.titlePlacement === PLACEMENTS.SHOW_NOT_ON_HOVER ||
        styleParams.titlePlacement === PLACEMENTS.SHOW_ALWAYS);
    const isCentered = style.justifyContent === 'center';
    const elementStyle = {
      justifyContent: styleParams.galleryVerticalAlign,
      alignItems: styleParams.galleryHorizontalAlign,
      textAlign: styleParams.galleryTextAlign,
    };

    //Set the texts fixed height considering the height of the love and share buttons which is about 100px;
    if (
      textsDisplayOnHover &&
      this.allowAnyAction() &&
      (styleParams.allowTitle || styleParams.allowDescription)
    ) {
      elementStyle.paddingBottom = 70;
    }

    if (isCentered) {
      elementStyle.marginTop = style.height / 15;
    }

    return elementStyle;
  }

  getItemTexts() {
    const {
      title,
      description,
      id,
      styleParams,
      style,
      isNarrow,
      shouldShowButton,
      container,
    } = this.props;
    const shouldShowTitle = title && styleParams.allowTitle;
    const shouldShowDescription = description && styleParams.allowDescription;
    const isNewMobileSettings = featureManager.supports.mobileSettings;
    const titleSpanStyle = {};
    const descSpanStyle = {};
    let titleStyle, descStyle;
    if (shouldShowDescription) {
      titleStyle = {
        marginBottom: styleParams.titleDescriptionSpace,
      };
    } else if (shouldShowButton) {
      titleStyle = { marginBottom: designConsts.spaceBetweenElements };
    } else {
      titleStyle = { marginBottom: 0 };
    }

    if (shouldShowButton) {
      descStyle = { marginBottom: designConsts.spaceBetweenElements };
    } else {
      descStyle = { marginBottom: 0 };
    }

    if (utils.isMobile() && isNewMobileSettings) {
      // ovveride desktop color and fonts
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
          titleStyle.textDecorationColor =
            styleParams.itemFontColorSlideshow.value;
        }
        if (
          typeof styleParams.itemDescriptionFontColorSlideshow !== 'undefined'
        ) {
          descStyle.color = styleParams.itemDescriptionFontColorSlideshow.value;
          descStyle.textDecorationColor =
            styleParams.itemDescriptionFontColorSlideshow.value;
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
          descStyle.textDecorationColor =
            styleParams.itemDescriptionFontColor.value;
        }
      }
    }

    if (
      styleParams.isSlideshow &&
      container &&
      container.galleryWidth &&
      container.galleryWidth < 800
    ) {
      let maxWidth = container.galleryWidth;
      if (styleParams.allowSlideshowCounter) {
        maxWidth -= 30;
      }
      if (styleParams.playButtonForAutoSlideShow) {
        maxWidth -= 30;
      }
      titleStyle.maxWidth = maxWidth;
      descStyle.maxWidth = maxWidth;
    }

    const titleElem = shouldShowTitle && (
      <ItemTitle
        key={'item-title-' + id}
        title={title}
        style={titleStyle}
        spanStyle={titleSpanStyle}
      />
    );
    const descriptionElem = shouldShowDescription && (
      <ItemDescription
        key={'item-description-' + id}
        description={description}
        style={descStyle}
        spanStyle={descSpanStyle}
      />
    );
    const buttonElem = shouldShowButton && (
      <CustomButton
        type="button"
        styleParams={styleParams}
        style={style}
        small={isNarrow}
        actions={{
          eventsListener: this.props.actions.eventsListener,
        }}
      />
    );

    const shouldHideElement = !titleElem && !descriptionElem && !buttonElem;
    if (shouldHideElement) {
      return null;
    }

    const elementStyle = this.getElementStyle();
    const classNames = this.getElementClassNames();

    return (
      <div
        style={elementStyle}
        ref={x => (this.container = x)}
        className={classNames}
        dir="auto"
      >
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
      this.debouncedTryFixLineHeight();
    }
  }

  componentDidMount() {
    this.tryFixLineHeight();
    setTimeout(() => {
      this.tryFixLineHeight(); //waiting for wix inline styles to take affect
    }, 1000);
  }

  render() {
    return this.getItemTexts();
  }
}
