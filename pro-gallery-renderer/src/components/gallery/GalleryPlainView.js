import React, {PropTypes} from 'react';
import {GalleryItem} from '../../pro-gallery-renderer/src';

const GalleryPlainView = props => {
  const {
    galleryData,
    watermarkData
  } = props;
  return (<div>
    {galleryData.photos.map((item, index) => {
      const core = new GalleryItem({dto: item, watermark: watermarkData});
      const imageUrl = core.resizedUrl('fit', 250, 250, null, null).img;
      return <img key={index} src={imageUrl}/>;
    })}
  </div>);
};

GalleryPlainView.propTypes = {

};

export default GalleryPlainView;
