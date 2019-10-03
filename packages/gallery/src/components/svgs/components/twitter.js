/* eslint-disable */
/* tslint:disable */
import PropTypes from 'prop-types';
import React from 'react';
const twitter = ({size, ...props}) => (
  <svg viewBox="0 0 16 13" fill="currentColor" width={ size || "16" } height={ size || "13" } {...props}>
    <path d="M 15.99 1.6C 15.91 2.19 15.04 2.79 14.51 3.23 15.03 10.77 6.33 15.48 0.01 11.66 1.78 11.67 3.78 11.19 4.83 10.21 3.3 9.96 2.21 9.28 1.79 7.94 2.24 7.9 2.87 8.04 3.17 7.85 1.77 7.33 0.66 6.52 0.59 4.68 1.09 4.73 1.35 5.02 1.97 4.95 1.06 4.38 0.03 2.21 0.96 0.61 2.61 2.4 4.66 3.79 7.87 4.05 7.08 0.72 11.57-1.34 13.59 1.06 14.38 0.89 15.04 0.61 15.71 0.33 15.44 1.09 14.88 1.57 14.33 2.06 14.92 1.95 15.55 1.87 15.99 1.6Z"
      fill="currentColor" />
  </svg>
);
twitter.displayName = 'twitter';
twitter.propTypes = {
  size: PropTypes.string
}
export default twitter;
/* tslint:enable */
/* eslint-enable */
