import React from 'react';

interface Props {
  url: string;
  dimensions: any;
}
const IframePlayer: React.FC<Props> = ({ url, dimensions }) => {
  return (
    <iframe
      data-hook="video-iframe-placeholder"
      className="gallery-item-content video-iframe-placeholder"
      title="pro-gallery-video"
      style={{ ...dimensions }}
      allow={'fullscreen'}
      src={url}
      allowFullScreen
      loading="lazy"
    />
  );
};
export default IframePlayer;
