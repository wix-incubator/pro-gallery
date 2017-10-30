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
    var dimensions = this.getDimension(container);
    var availableHeight = dimensions.height;

    var customButtonElement = $(container).find('.custom-button-wrapper');
    var customButtonExists = customButtonElement.length > 0;
    var titleElement = $(container).find('.gallery-item-title');
    var descriptionElement = $(container).find('.gallery-item-description');

    let isItemWidthToSmall = dimensions.width < minWidthToShowContent;
    titleElement.hide();
    descriptionElement.hide();
    customButtonElement.hide();

    if (customButtonExists) {
      customButtonElement.show();
      var buttonHeight = this.getElementHeight(customButtonElement);
      let isNotEnoughSpaceForButton = availableHeight < buttonHeight;
      if (isNotEnoughSpaceForButton) {
        const hoverTextAreaPaddings = 30;
        const isNotEnoughSpaceForButton = (availableHeight + hoverTextAreaPaddings) < buttonHeight;
      }
      if (isNotEnoughSpaceForButton) {
        customButtonElement.hide();
      } else if (isItemWidthToSmall) {
        customButtonElement.find('button').css({'min-width' : 0 + 'px', 'max-width' : minWidthToShowContent + 'px'});
      } else if (dimensions.width < minWithForNormalSizedItem) {
        customButtonElement.find('button').css({'min-width' : minWidthToShowContent + 'px', 'max-width' : dimensions.width + 'px'});
      }

      let isButtonHeightAvailable = !_.isNaN(buttonHeight)
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


    let shouldDisplayTitle = (title || fileName) && !isSmallItem && styleParams.allowTitle;
    if (shouldDisplayTitle) {
      titleElement.show();
      titleElement.css({ 'overflow': 'visible' });
      if (titleElement.length == 1) {
        var titleHeight = parseInt(titleElement.height());
        let titleLineHeight = parseInt(titleElement.css('line-height'));
        let numOfTitleLines = Math.floor(titleHeight / titleLineHeight);
        let numOfAvailableLines = Math.floor(availableHeight / titleLineHeight);
        if (numOfAvailableLines == 0) {
          titleElement.hide();
        } else {
          let isTitleFitInAvailableHeight = numOfAvailableLines <= numOfTitleLines;
          if (isTitleFitInAvailableHeight) {
            titleElement.css({ '-webkit-line-clamp': (numOfAvailableLines + '') });
            titleHeight = titleLineHeight * numOfAvailableLines;
            titleElement.css({ 'overflow': 'hidden', height: titleHeight });
          } else {
            titleElement.css({ '-webkit-line-clamp': 'none' });
            titleHeight = titleLineHeight * numOfTitleLines;
          }

          let isThereAnyAvailableHeightLeft = availableHeight > titleHeight;
          if (isThereAnyAvailableHeightLeft) {
            availableHeight -= titleHeight;
          } else {
            availableHeight = 0;
          }
        }
      }
    }

    let shouldDisplayDescription = descriptionElement.length == 1 && !isSmallItem && styleParams.allowDescription && description && availableHeight > 0
    if (shouldDisplayDescription) {
      descriptionElement.show();
      availableHeight -= (spaceBetweenElements * 2);
      if (availableHeight < 0) {
        availableHeight = 0;
      }
      let lineHeight = parseInt(descriptionElement.css('line-height'));
      let numOfLines = Math.floor(availableHeight / lineHeight);
      if (numOfLines == 0) {
        descriptionElement.hide();
      } else {
        var descriptionOptimisticHeight = parseInt(descriptionElement.css('height'));
        var descriptionAvailableHeight = lineHeight * numOfLines;
        let isDescriptionHeightBiggerThanAvailableHeight = descriptionOptimisticHeight > descriptionAvailableHeight;
        availableHeight -= isDescriptionHeightBiggerThanAvailableHeight ? descriptionAvailableHeight : descriptionOptimisticHeight;
        //title.height(numOfLines * lineHeight);
        descriptionElement.css({ 'overflow': 'hidden', '-webkit-line-clamp': (numOfLines + '') });
      }
    }
  }
}

export default new LineHeightFixer();