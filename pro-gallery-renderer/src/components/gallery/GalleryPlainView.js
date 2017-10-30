import React, { PropTypes } from 'react'
import { ItemCore } from '../../_domain/item-core';

const GalleryPlainView = props => {
  const {
    galleryData,
    watermarkData
  } = props;
  return (<div>
    {galleryData.photos.map((item, index) => {
      const core = new ItemCore({dto: item, watermark: watermarkData});
      const imageUrl = core.resizedUrl('fit', 250, 250, null, null)['img'];
      return <img key={index} src={imageUrl}/>
    })}
  </div>);
}

GalleryPlainView.propTypes = {

}

export default GalleryPlainView
