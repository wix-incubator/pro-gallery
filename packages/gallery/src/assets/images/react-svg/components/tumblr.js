/* eslint-disable */
/* tslint:disable */
import PropTypes from 'prop-types';
import React from 'react';
const tumblr = ({size, ...props}) => (
  <svg viewBox="0 0 8 15" fill="currentColor" width={ size || "8" } height={ size || "15" } {...props}>
    <path d="M 7.99 6.38C 7.99 6.38 5 6.38 5 6.38 5 6.38 5 10.53 5 10.53 5 11.28 5.09 11.7 6.09 11.7 6.09 11.7 7.99 11.7 7.99 11.7 7.99 11.7 7.99 14.89 7.99 14.89 7.99 14.89 6.99 15 5.89 15 3.3 15 2 13.29 2 11.38 2 11.38 2 6.38 2 6.38 2 6.38 0.01 6.38 0.01 6.38 0.01 6.38 0.01 3.41 0.01 3.41 2.4 3.2 2.6 1.28 2.8 0 2.8 0 5 0 5 0 5 0 5 3.2 5 3.2 5 3.2 7.99 3.2 7.99 3.2 7.99 3.2 7.99 6.38 7.99 6.38Z"
      fill="currentColor" />
  </svg>
);
tumblr.displayName = 'tumblr';
tumblr.propTypes = {
  size: PropTypes.string
}
export default tumblr;
/* tslint:enable */
/* eslint-enable */
