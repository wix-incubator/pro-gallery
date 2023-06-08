/* eslint-disable */
import React from 'react';
import { clickable } from 'pro-gallery';
interface VideoPlayButtonProps {
  size: number;
}
export const VideoPlayButton = ({ size }: VideoPlayButtonProps): JSX.Element => (
  <clickable.div
    style={{
      cursor: 'pointer',
    }}
    className="playground-play-button"
  >
    <div
      style={{
        zIndex: 11,
        color: 'red',
        fontSize: `${size}px`,
        top: '50%',
        left: '50%',
        position: 'absolute',
        display: 'inline-block',
        textRendering: 'auto',
        height: `${size}px`,
        width: `${size}px`,
        textAlign: 'center',
        margin: `-${size / 2}px 0 0 -${size / 2}px`,
      }}
    >
      {' '}
      {'▶'}{' '}
    </div>
  </clickable.div>
);

export default VideoPlayButton;
