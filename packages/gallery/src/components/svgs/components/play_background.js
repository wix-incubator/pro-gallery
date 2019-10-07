/* eslint-disable */
/* tslint:disable */
import PropTypes from 'prop-types';
import React from 'react';
const play_background = ({size, ...props}) => (
  <svg viewBox="0 0 60 60" fill="currentColor" width={ size || "60" } height={ size || "60" } {...props}>
    <path d="M30,0c16.6,0,30,13.4,30,30S46.6,60,30,60C13.4,60,0,46.6,0,30S13.4,0,30,0z" fillRule="evenodd" clipRule="evenodd" />
  </svg>
);
play_background.displayName = 'play_background';
play_background.propTypes = {
  size: PropTypes.string
}
export default play_background;
/* tslint:enable */
/* eslint-enable */
