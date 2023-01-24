import React from 'react';

interface Props {
  isCustomVideo: boolean;
  url: string;
  dimensions: any;
}
const IframePlayer: React.FC<Props> = ({ url, dimensions }) => {
  return (
    <iframe
      data-hook="video-iframe-placeholder"
      title="pro-gallery-video"
      style={{ ...dimensions }}
      allow={'fullscreen'}
      src={url}
      allowFullScreen
      loading="lazy"
    />
  );
};
console.log('iframe!!!!!!4');
export default IframePlayer;
