import React from 'react';
import GalleryItem from '../item/galleryItem';

const GalleryPlainView = props => {
  const { galleryData, watermarkData } = props;
  return (
    <div>
      {galleryData.photos.map((item, index) => {
        const core = new GalleryItem({ dto: item, watermark: watermarkData });
        const imageUrl = core.resizedUrl('fit', 250, 250, null, null).img;
        return <img alt="" key={index} src={imageUrl} />;
      })}
    </div>
  );
};

GalleryPlainView.propTypes = {};

export default GalleryPlainView;
