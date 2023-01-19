import React from 'react';
import PlayBackground from '../../svgs/components/play_background';
import PlayTriangle from '../../svgs/components/play_triangle';
import { clickable } from '../../helpers/mouseCursorPosition';

export const VideoPlayButton = (
  divProps: React.HTMLAttributes<HTMLDivElement>
): JSX.Element => (
  <clickable.div
    style={{
      cursor: 'pointer',
    }}
    className="play-button"
    {...divProps}
  >
    <i
      key="play-triangle"
      data-hook="play-triangle"
      className={'gallery-item-video-play-triangle play-triangle '}
    >
      <PlayTriangle />
    </i>
    <i
      key="play-bg"
      data-hook="play-background"
      className={'gallery-item-video-play-background play-background '}
    >
      <PlayBackground />
    </i>
  </clickable.div>
);
