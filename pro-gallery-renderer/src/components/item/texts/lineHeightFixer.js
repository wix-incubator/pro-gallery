import _ from 'lodash';
import utils from '../../../utils/index.js';
import Consts from 'photography-client-lib/dist/src/utils/consts';
import window from 'photography-client-lib/dist/src/sdk/windowWrapper';
import designConsts from '../../../constants/designConsts.js';

const minWidthToShowContent = 135;
const minWithForNormalSizedItem = 190;

class LineHeightFixer {

  getDimensions(element) {
    const cs = window.getComputedStyle(element);
    const paddingY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    const paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);

    const borderX = parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
    const borderY = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);

    return {
      width: element.clientWidth - paddingX - borderX,
      height: element.clientHeight - paddingY - borderY,
    };
  }

  saveCurrentDisplay(element) {
    element && element.setAttribute('data-display', this.getCss(element, 'display'));
  }

  getSavedDisplay(element) {
    return (element && element.getAttribute('data-display')) || '-webkit-box';
  }

  removeElement(element) {
    this.saveCurrentDisplay(element);
    this.setCss(element, {display: 'none'});
  }

  hideElement(element, shouldOverrideDisplay = true) {
    if (shouldOverrideDisplay) {
      const display = this.getSavedDisplay(element);
      this.setCss(element, {visibility: 'hidden', display});
    } else {
      this.setCss(element, {visibility: 'hidden'});
    }
  }

  showElement(element, shouldOverrideDisplay = true) {
    if (shouldOverrideDisplay) {
      const display = this.getSavedDisplay(element);
      this.setCss(element, {visibility: 'visible', display});
    } else {
      this.setCss(element, {visibility: 'visible'});
    }
  }

  getCss(element, rule) {
    return window.getComputedStyle(element)[rule];
  }

  setCss(element, styles) {
    try {
      Object.assign(element.style, styles);
    } catch (e) {
      //
    }
  }

  shouldFix(oldOptions, newOptions) {
    const {styleParams, title, description, isSmallItem} = oldOptions;
    const newStyleParams = newOptions.styleParams;
    const newTitle = newOptions.title;
    const newDescription = newOptions.description;
    const newIsSmallItems = newOptions.isSmallItem;
    const newIsSocialPopulated = newStyleParams.allowSocial ||
      newStyleParams.loveButton ||
      newStyleParams.allowDownload;
    const oldIsSocialPopulated = styleParams.allowSocial ||
      styleParams.loveButton ||
      styleParams.allowDownload;
    return (
      styleParams.isSlideshow !== newStyleParams.isSlideshow ||
      styleParams.allowTitle !== newStyleParams.allowTitle ||
      styleParams.allowDescription !== newStyleParams.allowDescription ||
      styleParams.slideshowInfoSize !== newStyleParams.slideshowInfoSize ||
      styleParams.externalInfoHeight !== newStyleParams.externalInfoHeight ||
      oldIsSocialPopulated !== newIsSocialPopulated ||
      title !== newTitle ||
      description !== newDescription ||
      isSmallItem !== newIsSmallItems
    );
  }

  calcAvailableHeight(options, textPlacementAboveOrBelow, textsContainerHeight) {
    const {styleParams, itemContainer} = options;
    let availableHeight;

    if (styleParams.isSlideshow) {
      const socialElements = itemContainer.getElementsByClassName('gallery-item-social');
      const socialElement = (socialElements.length > 0) && socialElements[0];
      const socialHeight = socialElement.clientHeight;
      const socialMarginBottom = parseInt(this.getCss(socialElement, 'margin-bottom'));
      const itemInfoChildDivPaddingTop = 24; //padding-top of the div inside gallery-item-info
      availableHeight = styleParams.slideshowInfoSize - itemInfoChildDivPaddingTop - socialHeight - socialMarginBottom;
    } else if (textPlacementAboveOrBelow) {
      const className = styleParams.titlePlacement === Consts.placements.SHOW_BELOW ? 'gallery-item-bottom-info' : 'gallery-item-top-info';
      const elements = itemContainer.getElementsByClassName(className);
      const element = (elements.length > 0) && elements[0];
      const elementPadding = parseInt(this.getCss(element, 'padding-top')) + parseInt(this.getCss(element, 'padding-bottom'));
      availableHeight = styleParams.externalInfoHeight - elementPadding;
    } else {
      availableHeight = textsContainerHeight;
    }

    return availableHeight;
  }

  fix(options, container) {
    if (utils.isTest()) {
      return;
    }

    const {styleParams, title, description, isSmallItem} = options;

    let textPlacementAboveOrBelow = false;
    if (styleParams.titlePlacement === Consts.placements.SHOW_BELOW || styleParams.titlePlacement === Consts.placements.SHOW_ABOVE) {
      textPlacementAboveOrBelow = true;
    }

    if (!container || !(options && options.itemContainer)) {
      return;
    }

    const dimensions = this.getDimensions(container);
    let availableHeight = this.calcAvailableHeight(options, textPlacementAboveOrBelow, dimensions.height);

    const customButtonElements = container.getElementsByClassName('custom-button-wrapper');
    const titleElements = container.getElementsByClassName('gallery-item-title');
    const descriptionElements = container.getElementsByClassName('gallery-item-description');
    let customButtonExists = customButtonElements.length > 0;

    const customButtonElement = customButtonExists && customButtonElements[0];
    const titleElement = (titleElements.length > 0) && titleElements[0];
    const descriptionElement = (descriptionElements.length > 0) && descriptionElements[0];

    const isItemWidthToSmall = dimensions.width < minWidthToShowContent;

    this.hideElement(titleElement);
    this.hideElement(descriptionElement, !textPlacementAboveOrBelow); //if textPlacementAboveOrBelow, descriptionElement should not get 'display: -webkit-box'
    this.hideElement(customButtonElement, !(styleParams.isSlideshow || textPlacementAboveOrBelow)); //if Slideshow or if textPlacementAboveOrBelow, customButtonElement should not get 'display: -webkit-box'

    if (customButtonExists) {
      this.showElement(customButtonElement, !(styleParams.isSlideshow || textPlacementAboveOrBelow)); //if Slideshow or if textPlacementAboveOrBelow, customButtonElement should not get 'display: -webkit-box'
      const buttonHeight = this.getDimensions(customButtonElement).height;
      if ((availableHeight + 30) < buttonHeight) {
        this.removeElement(customButtonElement);
        customButtonExists = false;
      } else if (isItemWidthToSmall) {
        this.setCss(customButtonElement.querySelector('button'), {'min-width': 0 + 'px', 'max-width': minWidthToShowContent + 'px'});
      } else if (dimensions.width < minWithForNormalSizedItem) {
        this.setCss(customButtonElement.querySelector('button'), {'min-width': minWidthToShowContent + 'px', 'max-width': dimensions.width + 'px'});
      }

      const isButtonHeightAvailable = !_.isNaN(buttonHeight);
      if (isButtonHeightAvailable && customButtonExists) {
        availableHeight -= buttonHeight;
        availableHeight -= designConsts.spaceBetweenElements;
        if (availableHeight < 0) {
          availableHeight = 0;
        }
      }
    }

    const shouldDisplayTitle = title && !isSmallItem && styleParams.allowTitle;
    if (shouldDisplayTitle) {
      this.showElement(titleElement);
      this.setCss(titleElement, {overflow: 'visible'});
      if (titleElements.length === 1) {
        let titleHeight = parseInt(titleElement.clientHeight);
        const titleLineHeight = parseInt(this.getCss(titleElement, 'line-height'));
        let numOfTitleLines = 1;
        if (titleHeight >= titleLineHeight) {
          numOfTitleLines = Math.floor(titleHeight / titleLineHeight);
        }
        const numOfAvailableLines = Math.floor(availableHeight / titleLineHeight);

        if (numOfAvailableLines === 0) {
          this.removeElement(titleElement);
        } else {
          this.setCss(titleElement, {overflow: 'hidden'});

          const isTitleFitInAvailableHeight = numOfAvailableLines <= numOfTitleLines;
          if (isTitleFitInAvailableHeight) {
            this.setCss(titleElement, {'-webkit-line-clamp': (numOfAvailableLines + '')});
            titleHeight = titleLineHeight * numOfAvailableLines;
          } else {
            this.setCss(titleElement, {'-webkit-line-clamp': 'none'});
            titleHeight = titleLineHeight * numOfTitleLines;
          }

          const isThereAnyAvailableHeightLeft = availableHeight > titleHeight;
          if (isThereAnyAvailableHeightLeft) {
            availableHeight -= titleHeight;
          } else {
            availableHeight = 0;
          }
        }
      }
    }

    const shouldDisplayDescription = descriptionElement && !isSmallItem && styleParams.allowDescription && description && availableHeight > 0;
    if (shouldDisplayDescription) {
      this.showElement(descriptionElement, !textPlacementAboveOrBelow); //if textPlacementAboveOrBelow, descriptionElement should not get 'display: -webkit-box'
      if (shouldDisplayTitle) {
        availableHeight -= designConsts.spaceBetweenTitleAndDescription;
      }
      if (availableHeight < 0) {
        availableHeight = 0;
      }
      const lineHeight = parseInt(this.getCss(descriptionElement, 'line-height'));
      const numOfLines = Math.floor(availableHeight / lineHeight);
      if (numOfLines === 0) {
        this.removeElement(descriptionElement);
      } else {
        this.setCss(descriptionElement, {overflow: 'hidden', '-webkit-line-clamp': (numOfLines + '')});
      }
    }
  }
}

export default new LineHeightFixer();
