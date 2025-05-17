import React from 'react';

interface Props {
  url: string;
  dimensions: any;
}
const IframePlayer: React.FC<Props> = ({ url, dimensions }) => {
  const src = url;
  const commonProps: any = {
    'data-hook': 'video-iframe-placeholder',
    className: 'gallery-item-content video-iframe-placeholder',
    title: 'pro-gallery-video',
    style: dimensions,
    allow: 'fullscreen',
    allowFullScreen: true,
    loading: 'lazy',
  };
  if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com')) {
    return <iframe {...commonProps} src={url + '&autoplay=0&muted=1'} />;
  } else {
    return (
      <iframe
        {...commonProps}
        src={src}
        srcDoc={`
      <video controls preload='metadata'>
      <source src='${src}' type='video/mp4'>
    </video>
    `}
      />
    );
  }
};
export default IframePlayer;
