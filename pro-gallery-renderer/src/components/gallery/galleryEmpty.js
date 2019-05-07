import React from 'react';
import translationUtils from '@wix/photography-client-lib/dist/src/utils/translationUtils';
import utils from '../../utils';
import window from '@wix/photography-client-lib/dist/src/sdk/windowWrapper';

class GalleryEmpty extends React.Component {
  componentWillMount() {
    this.props.actions.setWixHeight(390, window.innerHeight);
    //TODO-NewGalleryContianer - remove this function because the functionality is now in the TPAwrapper
  }

  render() {
    if (utils.isVerbose()) {
      console.log('Not rendering - gallery is empty');
    }
    const emptyContent = utils.isStoreGallery() ? (
      <div>
        <div className="pro-gallery-empty-title">
          {translationUtils.getByKey(
            'Gallery_ArtStore_Organize_Images_EmptyState_Header',
          )}
          <br />
          {translationUtils.getByKey(
            'Gallery_ArtStore_Organize_Images_EmptyState_Header2',
          )}
        </div>
        <div className="pro-gallery-empty-info">
          {translationUtils.getByKey(
            'Gallery_ArtStore_Organize_Images_EmptyState_Text',
          )}
          <br />
        </div>
      </div>
    ) : (
      <div>
        <div className="pro-gallery-empty-title">
          {translationUtils.getByKey('Gallery_Empty_Title')}
          <br />
          {translationUtils.getByKey('Gallery_Empty_Title2')}
        </div>
        <div className="pro-gallery-empty-info">
          {translationUtils.getByKey('Gallery_Empty_Description')}
          <br />
          {translationUtils.getByKey('Gallery_Empty_Description2')}
        </div>
      </div>
    );
    return (
      <div className="pro-gallery-empty">
        <div className="pro-gallery-empty-wrapper">
          <div className="pro-gallery-empty-image" />
          {emptyContent}
        </div>
      </div>
    );
  }
}

export default GalleryEmpty;
