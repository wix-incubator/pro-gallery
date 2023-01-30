import React from 'react';
import PlayBackground from '../../svgs/components/play_background';
import RotateArrow from '../../svgs/components/rotate_arrow';
import { clickable } from '../../helpers/mouseCursorPosition';
import PropTypes from 'prop-types';

export const ThreeDimensionsRotateArrow = ({ size = '60' }): JSX.Element => (
  <clickable.div
    style={{
      cursor: 'pointer',
    }}
    className="play-button"
  >
    <i
      key="play-triangle"
      data-hook="play-triangle"
      className={'gallery-item-video-play-triangle play-triangle '}
    >
      <RotateArrow size={size} />
    </i>
    <i
      key="play-bg"
      data-hook="play-background"
      className={'gallery-item-video-play-background play-background '}
    >
      <PlayBackground size={size} />
    </i>
  </clickable.div>
);

ThreeDimensionsRotateArrow.propTypes = {
  size: PropTypes.string,
};
