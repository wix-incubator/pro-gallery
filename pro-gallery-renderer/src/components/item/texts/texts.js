import React from 'react';
import CustomButton from '../buttons/customButton.js';
import ItemTitle from './itemTitle.js';
import ItemDescription from './itemDescription.js';
import lineHeightFixer from './lineHeightFixer.js';
import consts from '../../consts.js';
import {utils} from '../../../utils/index.js';

export default class Texts extends React.Component {
  constructor(props) {
    super(props);
  }

  getElementClassNames() {
    const {showShare, styleParams, isNarrow} = this.props;
    let classNames = ['gallery-item-text'];
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
      classNames.push('narrow-item')
    }

    return classNames.join(' ');
  }

  allowAnyAction() {
    const {styleParams} = this.props;
    return styleParams.loveButton || styleParams.allowSocial || styleParams.allowDownload;
  }

  getElementStyle() {
    const {styleParams, style} = this.props;
    let textsDisplayOnHover = !styleParams.isSlideshow && !styleParams.isSlider && !styleParams.hasThumbnails;
    let isCentered = style.justifyContent == 'center';

    var elementStyle = {
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
    var titleElem = null;
    var descriptionElem = null;
    var buttonElem = null;

    const {title, description, fileName, id, styleParams, style, isSmallItem, isNarrow, shouldShowButton} = this.props;
    var displayTitle = (title || fileName)
    let shouldShowTitle = displayTitle && !isSmallItem && styleParams.allowTitle && styleParams.titlePlacement == consts.placements.SHOW_ON_HOVER;
    let shouldShowDescription = !isSmallItem && styleParams.allowDescription && description;
    const shouldHaveBottomSpaceInTitle = shouldShowDescription || this.allowAnyAction();

    if (shouldShowTitle) {
      titleElem = <ItemTitle key={'item-title-' + id} title={displayTitle} style={shouldHaveBottomSpaceInTitle ? {} : {marginBottom: 0}} />;
    }

    if (shouldShowDescription) {
      descriptionElem = (<ItemDescription description={description} key={'item-description-' + id} />);
    }

    if (shouldShowButton) {
      buttonElem = <CustomButton type="button" styleParams={styleParams} style={style} small={isNarrow}/>
    }

    let shouldHideElement = !titleElem && !descriptionElem && !buttonElem;
    if (shouldHideElement) {
      return null;
    }

    var elementStyle = this.getElementStyle();
    var classNames = this.getElementClassNames();

    return (
      <div style={elementStyle} ref={x => { this.container = x } } className={classNames}>
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
