import utils from '../../../common/utils/index.js';
import PLACEMENTS, {hasHorizontalPlacement, hasVerticalPlacement} from '../../../common/constants/placements';
import INFO_TYPE from '../../../common/constants/infoType';
import window from '../../../common/window/windowWrapper';
import designConsts from '../../../common/constants/designConsts.js';

const minWidthToShowContent = 135;
const minWithForNormalSizedItem = 190;

class LineHeightFixer {
  getDimensions(element) {
    const cs = window.getComputedStyle(element);
    const paddingY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    const paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);

    const borderX =
      parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
    const borderY =
      parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);

    return {
      width: element.clientWidth - paddingX - borderX,
      height: element.clientHeight - paddingY - borderY,
    };
  }

  saveCurrentDisplay(element) {
    element &&
      element.setAttribute('data-display', this.getCss(element, 'display'));
  }

  getSavedDisplay(element) {
    return (element && element.getAttribute('data-display')) || '-webkit-box';
  }

  removeElement(element) {
    this.saveCurrentDisplay(element);
    this.setCss(element, { display: 'none' });
  }

  hideElement(element, shouldOverrideDisplay = true) {
    if (element) {
      if (shouldOverrideDisplay) {
        const display = this.getSavedDisplay(element);
        this.setCss(element, { visibility: 'hidden', display });
      } else {
        this.setCss(element, { visibility: 'hidden' });
      }
    }
  }

  showElement(element, shouldOverrideDisplay = true) {
    if (shouldOverrideDisplay) {
      const display = this.getSavedDisplay(element);
      this.setCss(element, { visibility: 'inherit', display });
    } else {
      this.setCss(element, { visibility: 'inherit' });
    }
  }

  getCss(element, rule, _default) {
    return window.getComputedStyle(element)[rule] || _default;
  }

  setCss(element, styles) {
    try {
      Object.assign(element.style, styles);
    } catch (e) {
      //
    }
  }

  shouldFix(oldOptions, newOptions) {
    const { styleParams, title, description, style, externalTotalInfoHeight } = oldOptions;
    const newStyleParams = newOptions.styleParams;
    const newTitle = newOptions.title;
    const newDescription = newOptions.description;
    const newStyle = newOptions.style;
    const newExternalTotalInfoHeight = newOptions.externalTotalInfoHeight;
    const newIsSocialPopulated =
      newStyleParams.allowSocial ||
      newStyleParams.loveButton ||
      newStyleParams.allowDownload;
    const oldIsSocialPopulated =
      styleParams.allowSocial ||
      styleParams.loveButton ||
      styleParams.allowDownload;
    return (
      style.height !== newStyle.height ||
      externalTotalInfoHeight !== newExternalTotalInfoHeight ||
      style.width !== newStyle.width ||
      styleParams.isSlideshow !== newStyleParams.isSlideshow ||
      styleParams.allowTitle !== newStyleParams.allowTitle ||
      styleParams.allowDescription !== newStyleParams.allowDescription ||
      styleParams.slideshowInfoSize !== newStyleParams.slideshowInfoSize ||
      styleParams.textImageSpace !== newStyleParams.textImageSpace ||
      styleParams.textsVerticalPadding !==
        newStyleParams.textsVerticalPadding ||
      styleParams.textsHorizontalPadding !==
        newStyleParams.textsHorizontalPadding ||
      styleParams.titleDescriptionSpace !==
        newStyleParams.titleDescriptionSpace ||
      styleParams.imageInfoType !== newStyleParams.imageInfoType ||
      styleParams.itemDescriptionFont !== newStyleParams.itemDescriptionFont ||
      styleParams.calculateTextBoxHeightMode !==
        newStyleParams.calculateTextBoxHeightMode ||
      styleParams.itemFont !== newStyleParams.itemFont ||
      oldIsSocialPopulated !== newIsSocialPopulated ||
      title !== newTitle ||
      description !== newDescription
    );
  }

  calcAvailableHeight(
    options,
    textPlacementAboveOrBelow,
    textPlacementRightOrLeft,
    textsContainerHeight,
    placement
  ) {
    const { styleParams, itemContainer } = options;
    let availableHeight;

    if (styleParams.isSlideshow) {

      const socialElements = itemContainer.getElementsByClassName(
        'gallery-item-social',
      );
      const socialElement = socialElements.length > 0 && socialElements[0];
      const socialHeight = socialElement.clientHeight;
      const socialMarginBottom = parseInt(
        this.getCss(socialElement, 'margin-bottom', 0),
      );
      const itemInfoChildDivPaddingTop = 24; //padding-top of the div inside gallery-item-info
      availableHeight =
        styleParams.slideshowInfoSize -
        itemInfoChildDivPaddingTop -
        socialHeight -
        socialMarginBottom;

    } else if (textPlacementAboveOrBelow || textPlacementRightOrLeft) {

      const className = {
        [PLACEMENTS.SHOW_BELOW]: 'gallery-item-bottom-info',
        [PLACEMENTS.SHOW_ABOVE]: 'gallery-item-top-info',
        [PLACEMENTS.SHOW_ON_THE_RIGHT]: 'gallery-item-right-info',
        [PLACEMENTS.SHOW_ON_THE_LEFT]: 'gallery-item-left-info',
      }[placement];
      const elements = itemContainer.getElementsByClassName(className);
      const element = elements.length > 0 && elements[0];
      if (typeof element !== 'undefined') {
        const elementPadding =
          parseInt(this.getCss(element, 'padding-top', 0)) +
          parseInt(this.getCss(element, 'padding-bottom', 0));
        const margin =
          styleParams.imageInfoType === INFO_TYPE.SEPARATED_BACKGROUND &&
          (styleParams.allowTitle || styleParams.allowDescription) &&
          styleParams.textImageSpace
            ? styleParams.textImageSpace
            : 0;

        const availableHeightOfTheTextElement = textPlacementAboveOrBelow ? options.externalTotalInfoHeight : textsContainerHeight; //maybe can be textsContainerHeight for textPlacementAboveOrBelow as well
        availableHeight = availableHeightOfTheTextElement - elementPadding - margin;
      }
    } else {

      availableHeight = textsContainerHeight;
    }

    return availableHeight;
  }

  fix(options, container) {
    if (utils.isTest()) {
      return;
    }

    const { styleParams, title, description } = options;

    for (const placement of styleParams.titlePlacement.split(',')) {
      const textPlacementRightOrLeft = hasHorizontalPlacement(placement);
      const textPlacementAboveOrBelow = hasVerticalPlacement(placement);

      if (!container || !(options && options.itemContainer)) {
        return;
      }

      const dimensions = this.getDimensions(container);
      let availableHeight = this.calcAvailableHeight(
        options,
        textPlacementAboveOrBelow,
        textPlacementRightOrLeft,
        dimensions.height,
        placement
      );

      const customButtonElements = container.getElementsByClassName(
        'custom-button-wrapper',
      );
      const titleElements = container.getElementsByClassName(
        'gallery-item-title',
      );
      const descriptionElements = container.getElementsByClassName(
        'gallery-item-description',
      );
      let customButtonExists = customButtonElements.length > 0;

      const customButtonElement = customButtonExists && customButtonElements[0];
      const titleElement = titleElements.length > 0 && titleElements[0];
      const descriptionElement =
        descriptionElements.length > 0 && descriptionElements[0];

      const isItemWidthToSmall = dimensions.width < minWidthToShowContent;

      this.hideElement(titleElement);
      this.hideElement(descriptionElement, !(textPlacementAboveOrBelow || textPlacementRightOrLeft)); //if textPlacementAboveOrBelow or textPlacementRightOrLeft, descriptionElement should not get 'display: -webkit-box'
      this.hideElement(
        customButtonElement,
        !(styleParams.isSlideshow || textPlacementAboveOrBelow || textPlacementRightOrLeft),
      ); //if Slideshow or if textPlacementAboveOrBelow or if textPlacementRightOrLeft, customButtonElement should not get 'display: -webkit-box'

      if (customButtonExists) {
        this.showElement(
          customButtonElement,
          !(styleParams.isSlideshow || textPlacementAboveOrBelow || textPlacementRightOrLeft),
        ); //if Slideshow or if textPlacementAboveOrBelow or if textPlacementRightOrLeft, customButtonElement should not get 'display: -webkit-box'
        const buttonHeight = this.getDimensions(customButtonElement).height;
        if (availableHeight + 30 < buttonHeight) {
          this.removeElement(customButtonElement);
          customButtonExists = false;
        } else if (isItemWidthToSmall) {
          this.setCss(customButtonElement.querySelector('button'), {
            'min-width': 0 + 'px',
            'max-width': minWidthToShowContent + 'px',
          });
        } else if (dimensions.width < minWithForNormalSizedItem) {
          this.setCss(customButtonElement.querySelector('button'), {
            'min-width': minWidthToShowContent + 'px',
            'max-width': dimensions.width + 'px',
          });
        }

        const isButtonHeightAvailable = !Number.isNaN(buttonHeight);
        if (isButtonHeightAvailable && customButtonExists) {
          availableHeight -= buttonHeight;
          availableHeight -= designConsts.spaceBetweenElements;
          if (availableHeight < 0) {
            availableHeight = 0;
          }
        }
      }

      const shouldDisplayTitle = title && styleParams.allowTitle;
      let titleNumOfAvailableLines = 0;
      if (shouldDisplayTitle) {
        this.showElement(titleElement);
        this.setCss(titleElement, { overflow: 'visible' });
        if (titleElements.length === 1) {
          let titleHeight = // when padding is large and the we decrease padding the clientHeight stay small
            parseInt(titleElement.children[0].offsetHeight) >
            parseInt(titleElement.clientHeight)
              ? parseInt(titleElement.children[0].offsetHeight)
              : parseInt(titleElement.clientHeight);
          const titleLineHeight = parseInt(
            this.getCss(titleElement, 'line-height', 1),
          );
          let numOfTitleLines = 1;
          if (titleHeight >= titleLineHeight) {
            numOfTitleLines = Math.floor(titleHeight / titleLineHeight);
          }
          titleNumOfAvailableLines = Math.floor(
            availableHeight / titleLineHeight,
          );

          if (titleNumOfAvailableLines === 0) {
            this.removeElement(titleElement);
          } else {
            this.setCss(titleElement, { overflow: 'hidden' });

            const isTitleFitInAvailableHeight =
              titleNumOfAvailableLines >= numOfTitleLines;
            if (isTitleFitInAvailableHeight) {
              this.setCss(titleElement, { '-webkit-line-clamp': 'none' });
              titleHeight = titleLineHeight * numOfTitleLines;
            } else {
              this.setCss(titleElement, {
                '-webkit-line-clamp': titleNumOfAvailableLines + '',
              });
              titleHeight = titleLineHeight * titleNumOfAvailableLines;
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

      const shouldDisplayDescription =
        descriptionElement &&
        styleParams.allowDescription &&
        description &&
        availableHeight > 0 &&
        ((shouldDisplayTitle && titleNumOfAvailableLines > 0) ||
          !shouldDisplayTitle); // when there s no place for title the description not suppose to be shown
      if (shouldDisplayDescription) {
        this.showElement(descriptionElement, !(textPlacementAboveOrBelow|| textPlacementRightOrLeft)); //if textPlacementAboveOrBelow or textPlacementRightOrLeft, descriptionElement should not get 'display: -webkit-box'
        if (shouldDisplayTitle) {
          availableHeight -= styleParams.titleDescriptionSpace;
        }
        if (availableHeight < 0) {
          availableHeight = 0;
        }
        const lineHeight = parseInt(
          this.getCss(descriptionElement, 'line-height', 1),
        );
        const numOfLines = Math.floor(availableHeight / lineHeight);
        if (numOfLines === 0) {
          this.removeElement(descriptionElement);
        } else {
          this.setCss(descriptionElement, {
            overflow: 'hidden',
            '-webkit-line-clamp': numOfLines + '',
          });
        }
      }
    }
  }
}

export default new LineHeightFixer();
