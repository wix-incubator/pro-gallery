import React from 'react';
import {TranslationUtil} from '../../utils';
import {utils} from '../../utils';


class GalleryEmpty extends React.Component {
  constructor(props) {
    super(props);

  }

  componentWillMount() {
    this.props.actions.setWixHeight(390, window.innerHeight);
  }

  render() {
    console.log('Not rendering - gallery is empty');

    const emptyContent = utils.isStoreGallery() ? (
      <div>
        <div className="pro-gallery-empty-title">
          {TranslationUtil.getByKey('Gallery_ArtStore_Organize_Images_EmptyState_Header')}<br/>
          {TranslationUtil.getByKey('Gallery_ArtStore_Organize_Images_EmptyState_Header2')}
        </div>
        <div className="pro-gallery-empty-info">
          {TranslationUtil.getByKey('Gallery_ArtStore_Organize_Images_EmptyState_Text')}<br/>
        </div>
        </div>) : (
      <div>
        <div className="pro-gallery-empty-title">
          {TranslationUtil.getByKey('Gallery_Empty_Title')}<br/>
          {TranslationUtil.getByKey('Gallery_Empty_Title2')}
        </div>
        <div className="pro-gallery-empty-info">
          {TranslationUtil.getByKey('Gallery_Empty_Description')}<br/>
          {TranslationUtil.getByKey('Gallery_Empty_Description2')}
        </div>
      </div>);
    return (
      <div className="pro-gallery-empty">
        <div className="pro-gallery-empty-wrapper">
          <div className="pro-gallery-empty-image"></div>
          {emptyContent}
        </div>
      </div>
    );
  }
}

export default GalleryEmpty;
