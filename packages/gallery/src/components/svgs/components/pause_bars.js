/* eslint-disable */
/* tslint:disable */
import PropTypes from 'prop-types';
import React from 'react';
const pause_bars = ({ size, ...props }) => (
  <svg viewBox="0 0 60 60" fill="currentColor" width={size || "60"} height={size || "60"} {...props}>
    <rect x="21" y="19.5" width="6" height="22" />
    <rect x="33" y="19.5" width="6" height="22" />
  </svg>
);
pause_bars.displayName = 'pause-bars';
pause_bars.propTypes = {
  size: PropTypes.string
}
export default pause_bars;
/* tslint:enable */
/* eslint-enable */
