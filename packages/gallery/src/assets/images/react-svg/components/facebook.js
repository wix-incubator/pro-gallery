/* eslint-disable */
/* tslint:disable */
import PropTypes from 'prop-types';
import React from 'react';
const facebook = ({size, ...props}) => (
  <svg viewBox="0 0 8 17" fill="currentColor" width={ size || "8" } height={ size || "17" } {...props}>
    <path d="M 7.21 0.91C 7.21 1.79 7.21 3.38 7.21 3.38 7.21 3.38 5.38 3.19 4.92 3.89 4.67 4.27 4.82 5.39 4.8 6.19 5.6 6.19 6.42 6.19 7.22 6.19 7.02 7.12 6.87 7.76 6.72 8.57 6.03 8.57 4.79 8.57 4.79 8.57 4.79 8.57 4.79 16.23 4.79 16.23 4.79 16.23 2.5 16.23 1.43 16.23 1.43 13.87 1.43 11.11 1.43 8.6 0.9 8.6 0.52 8.6-0 8.6-0 7.71-0 7.07-0 6.19 0.5 6.19 0.9 6.19 1.41 6.19 1.48 4.42 1.51 2.68 2.39 1.79 3.38 0.79 4.32 0.91 7.21 0.91Z"
      fill="currentColor" />
  </svg>
);
facebook.displayName = 'facebook';
facebook.propTypes = {
  size: PropTypes.string
}
export default facebook;
/* tslint:enable */
/* eslint-enable */
