import React from 'react';
import PlayBackground from '../../svgs/components/play_background';
import PlayTriangle from '../../svgs/components/play_triangle';
import { clickable } from '../../helpers/mouseCursorPosition';
interface VideoPlayButtonProps {
  size?: number;
}
export const VideoPlayButton = ({ size = 60 }: VideoPlayButtonProps): JSX.Element => (
  <clickable.div
    style={{
      cursor: 'pointer',
    }}
    className="play-button"
  >
    <i key="play-triangle" data-hook="play-triangle" className={'gallery-item-video-play-triangle play-triangle '}>
      <PlayTriangle size={size} />
    </i>
    <i key="play-bg" data-hook="play-background" className={'gallery-item-video-play-background play-background '}>
      <PlayBackground size={size} />
    </i>
  </clickable.div>
);

export default VideoPlayButton;
