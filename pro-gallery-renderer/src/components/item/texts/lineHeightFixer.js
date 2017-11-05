const spaceBetweenElements = 20;
const minWidthToShowContent = 135;
const minWithForNormalSizedItem = 190;


class LineHeightFixer {
  getElementHeight(element) {
    return parseInt($(element).height());
  }

  getElementWidth(element) {
    return parseInt($(element).width());
  }

  getDimension(element) {
    return {
      height: this.getElementHeight(element),
      width: this.getElementWidth(element),
    };
  }

  fix(options, container) {
    const {styleParams, fileName, title, description, isSmallItem} = options;

    if (!container || styleParams.isSlideshow) {
      return;
    }
    const dimensions = this.getDimension(container);
    let availableHeight = dimensions.height;

    const customButtonElement = $(container).find('.custom-button-wrapper');
    const customButtonExists = customButtonElement.length > 0;
    const titleElement = $(container).find('.gallery-item-title');
    const descriptionElement = $(container).find('.gallery-item-description');

    const isItemWidthToSmall = dimensions.width < minWidthToShowContent;
    titleElement.hide();
    descriptionElement.hide();
    customButtonElement.hide();

    if (customButtonExists) {
      customButtonElement.show();
      const buttonHeight = this.getElementHeight(customButtonElement);
      const isNotEnoughSpaceForButton = availableHeight < buttonHeight;
      if (isNotEnoughSpaceForButton) {
        const hoverTextAreaPaddings = 30;
        const isNotEnoughSpaceForButton = (availableHeight + hoverTextAreaPaddings) < buttonHeight;
      }
      if (isNotEnoughSpaceForButton) {
        customButtonElement.hide();
      } else if (isItemWidthToSmall) {
        customButtonElement.find('button').css({'min-width': 0 + 'px', 'max-width': minWidthToShowContent + 'px'});
      } else if (dimensions.width < minWithForNormalSizedItem) {
        customButtonElement.find('button').css({'min-width': minWidthToShowContent + 'px', 'max-width': dimensions.width + 'px'});
      }

      const isButtonHeightAvailable = !_.isNaN(buttonHeight);
      if (isButtonHeightAvailable) {
        availableHeight -= buttonHeight;
        availableHeight -= spaceBetweenElements;
        if (availableHeight < 0) {
          availableHeight = 0;
          // customButtonElement.hide();
        }
      }
    } else {
      availableHeight -= spaceBetweenElements;
    }


    const shouldDisplayTitle = (title || fileName) && !isSmallItem && styleParams.allowTitle;
    if (shouldDisplayTitle) {
      titleElement.show();
      titleElement.css({overflow: 'visible'});
      if (titleElement.length == 1) {
        let titleHeight = parseInt(titleElement.height());
        const titleLineHeight = parseInt(titleElement.css('line-height'));
        const numOfTitleLines = Math.floor(titleHeight / titleLineHeight);
        const numOfAvailableLines = Math.floor(availableHeight / titleLineHeight);
        if (numOfAvailableLines == 0) {
          titleElement.hide();
        } else {
          const isTitleFitInAvailableHeight = numOfAvailableLines <= numOfTitleLines;
          if (isTitleFitInAvailableHeight) {
            titleElement.css({'-webkit-line-clamp': (numOfAvailableLines + '')});
            titleHeight = titleLineHeight * numOfAvailableLines;
            titleElement.css({overflow: 'hidden', height: titleHeight});
          } else {
            titleElement.css({'-webkit-line-clamp': 'none'});
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

    const shouldDisplayDescription = descriptionElement.length == 1 && !isSmallItem && styleParams.allowDescription && description && availableHeight > 0;
    if (shouldDisplayDescription) {
      descriptionElement.show();
      availableHeight -= (spaceBetweenElements * 2);
      if (availableHeight < 0) {
        availableHeight = 0;
      }
      const lineHeight = parseInt(descriptionElement.css('line-height'));
      const numOfLines = Math.floor(availableHeight / lineHeight);
      if (numOfLines == 0) {
        descriptionElement.hide();
      } else {
        const descriptionOptimisticHeight = parseInt(descriptionElement.css('height'));
        const descriptionAvailableHeight = lineHeight * numOfLines;
        const isDescriptionHeightBiggerThanAvailableHeight = descriptionOptimisticHeight > descriptionAvailableHeight;
        availableHeight -= isDescriptionHeightBiggerThanAvailableHeight ? descriptionAvailableHeight : descriptionOptimisticHeight;
        //title.height(numOfLines * lineHeight);
        descriptionElement.css({overflow: 'hidden', '-webkit-line-clamp': (numOfLines + '')});
      }
    }
  }
}

export default new LineHeightFixer();
