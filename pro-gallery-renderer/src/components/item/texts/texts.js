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
    if (styleParams.allowMultishare) {
      classNames.push('push-down');
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
    const textsDisplayOnHover = !styleParams.isSlideshow && !styleParams.isSlider && !styleParams.hasThumbnails;
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
    let titleElem = null;
    let descriptionElem = null;
    let buttonElem = null;

    const {title, description, fileName, id, styleParams, style, isSmallItem, isNarrow, shouldShowButton} = this.props;
    const displayTitle = utils.getTitleOrFilename(title, fileName);
    const shouldShowTitle = displayTitle && !isSmallItem && styleParams.allowTitle && styleParams.titlePlacement === Consts.placements.SHOW_ON_HOVER;
    const shouldShowDescription = !isSmallItem && styleParams.allowDescription && description;
    const shouldHaveBottomSpaceInTitle = shouldShowDescription || this.allowAnyAction();

    if (shouldShowTitle) {
      titleElem = <ItemTitle key={'item-title-' + id} title={displayTitle} style={shouldHaveBottomSpaceInTitle ? {} : {marginBottom: 0}} />;
    }

    if (shouldShowDescription) {
      descriptionElem = (<ItemDescription description={description} key={'item-description-' + id} />);
    }

    if (shouldShowButton) {
      buttonElem = <CustomButton type="button" styleParams={styleParams} style={style} small={isNarrow}/>;
    }

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

  componentDidUpdate() {
    lineHeightFixer.fix(this.props, this.container);
  }

  componentDidMount() {
    lineHeightFixer.fix(this.props, this.container);
  }

  render() {
    return this.getItemTexts();
  }
}
