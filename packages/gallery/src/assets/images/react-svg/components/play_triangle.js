/* eslint-disable */
/* tslint:disable */
import PropTypes from 'prop-types';
import React from 'react';
const play_triangle = ({size, ...props}) => (
  <svg viewBox="0 0 60 60" fill="currentColor" width={ size || "60" } height={ size || "60" } {...props}>
    <path d="M41.5,30l-17,10V20L41.5,30z" />
  </svg>
);
play_triangle.displayName = 'play_triangle';
play_triangle.propTypes = {
  size: PropTypes.string
}
export default play_triangle;
/* tslint:enable */
/* eslint-enable */
