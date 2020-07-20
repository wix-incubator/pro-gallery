/* eslint-disable */
/* tslint:disable */
import PropTypes from 'prop-types';
import React from 'react';
const x = ({size, ...props}) => (
  <svg viewBox="0 0 15 15" fill="currentColor" width={ size || "15" } height={ size || "15" } {...props}>
    <path d="M15 0.6L14.4 0 7.5 6.9 0.6 0 0 0.6 6.9 7.5 0 14.4 0.6 15 7.5 8.1 14.4 15 15 14.4 8.1 7.5z" fillRule="evenodd" clipRule="evenodd" />
  </svg>
);
x.displayName = 'x';
x.propTypes = {
  size: PropTypes.string
}
export default x;
/* tslint:enable */
/* eslint-enable */
