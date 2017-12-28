import _ from 'lodash';
import utils from '../../../utils/index.js';

const spaceBetweenElements = 20;
const minWidthToShowContent = 135;
const minWithForNormalSizedItem = 190;

class LineHeightFixer {
  getElementHeight(element) {
    return parseInt(element.clientHeight);
  }

  getElementWidth(element) {
    return parseInt(element.clientWidth);
  }

  getDimension(element) {
    return {
      height: this.getElementHeight(element),
      width: this.getElementWidth(element),
    };
  }

  hideElement(element) {
    try {
      element.style.display = 'none';
    } catch (e) {
      //
    }

  }

  showElement(element) {
    try {
      element.style.display = 'block';
    } catch (e) {
      //
    }
  }

  setCss(element, styles) {
    try {
      Object.assign(element.style, styles);
    } catch (e) {
      //
    }
  }

  fix(options, container) {

    if (utils.isTest()) {
      return;
    }

    const {styleParams, fileName, title, description, isSmallItem} = options;

    if (!container || styleParams.isSlideshow) {
      return;
    }
    const dimensions = this.getDimension(container);
    let availableHeight = dimensions.height;

    const customButtonElements = container.getElementsByClassName('custom-button-wrapper');
    const titleElements = container.getElementsByClassName('gallery-item-title');
    const descriptionElements = container.getElementsByClassName('gallery-item-description');
    const customButtonExists = customButtonElements.length > 0;

    const customButtonElement = (customButtonElements.length > 0) && customButtonElements[0];
    const titleElement = (titleElements.length > 0) && titleElements[0];
    const descriptionElement = (descriptionElements.length > 0) && descriptionElements[0];

    const isItemWidthToSmall = dimensions.width < minWidthToShowContent;
    this.hideElement(titleElement);
    this.hideElement(descriptionElement);
    this.hideElement(customButtonElement);

    if (customButtonExists) {
      this.showElement(customButtonElement);
      const buttonHeight = this.getElementHeight(customButtonElement);
      let isNotEnoughSpaceForButton = availableHeight < buttonHeight;
      if (isNotEnoughSpaceForButton) {
        const hoverTextAreaPaddings = 30;
        isNotEnoughSpaceForButton = (availableHeight + hoverTextAreaPaddings) < buttonHeight;
      }
      if (isNotEnoughSpaceForButton) {
        this.hideElement(customButtonElement);
      } else if (isItemWidthToSmall) {
        this.setCss(customButtonElement.querySelector('button'), {'min-width': 0 + 'px', 'max-width': minWidthToShowContent + 'px'});
      } else if (dimensions.width < minWithForNormalSizedItem) {
        this.setCss(customButtonElement.querySelector('button'), {'min-width': minWidthToShowContent + 'px', 'max-width': dimensions.width + 'px'});
      }

      const isButtonHeightAvailable = !_.isNaN(buttonHeight);
      if (isButtonHeightAvailable) {
        availableHeight -= buttonHeight;
        availableHeight -= spaceBetweenElements;
        if (availableHeight < 0) {
          availableHeight = 0;
          // this.hideElement(customButtonElement);
        }
      }
    } else {
      availableHeight -= spaceBetweenElements;
    }


    const shouldDisplayTitle = utils.getTitleOrFilename(title, fileName) && !isSmallItem && styleParams.allowTitle;
    if (shouldDisplayTitle) {
      this.showElement(titleElement);
      this.setCss(titleElement, {overflow: 'visible'});
      if (titleElements.length === 1) {
        let titleHeight = parseInt(titleElement.clientHeight);
        const titleLineHeight = parseInt(titleElement.style.lineHeight);
        const numOfTitleLines = Math.floor(titleHeight / titleLineHeight);
        const numOfAvailableLines = Math.floor(availableHeight / titleLineHeight);
        if (numOfAvailableLines === 0) {
          this.hideElement(titleElement);
        } else {
          const isTitleFitInAvailableHeight = numOfAvailableLines <= numOfTitleLines;
          if (isTitleFitInAvailableHeight) {
            this.setCss(titleElement, {'-webkit-line-clamp': (numOfAvailableLines + '')});
            titleHeight = titleLineHeight * numOfAvailableLines;
            this.setCss(titleElement, {overflow: 'hidden', height: titleHeight});
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

    const shouldDisplayDescription = descriptionElement.length === 1 && !isSmallItem && styleParams.allowDescription && description && availableHeight > 0;
    if (shouldDisplayDescription) {
      this.showElement(descriptionElement);
      availableHeight -= (spaceBetweenElements * 2);
      if (availableHeight < 0) {
        availableHeight = 0;
      }
      const lineHeight = parseInt(descriptionElement.style.lineHeight);
      const numOfLines = Math.floor(availableHeight / lineHeight);
      if (numOfLines === 0) {
        this.hideElement(descriptionElement);
      } else {
        const descriptionOptimisticHeight = parseInt(descriptionElement.style.height);
        const descriptionAvailableHeight = lineHeight * numOfLines;
        const isDescriptionHeightBiggerThanAvailableHeight = descriptionOptimisticHeight > descriptionAvailableHeight;
        availableHeight -= isDescriptionHeightBiggerThanAvailableHeight ? descriptionAvailableHeight : descriptionOptimisticHeight;
        //title.height(numOfLines * lineHeight);
        this.setCss(descriptionElement, {overflow: 'hidden', '-webkit-line-clamp': (numOfLines + '')});
      }
    }
  }
}

export default new LineHeightFixer();
