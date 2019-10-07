/* eslint-disable */
/* tslint:disable */
import PropTypes from 'prop-types';
import React from 'react';
const download = ({size, ...props}) => (
  <svg viewBox="0 0 16 15" fill="currentColor" width={ size || "16" } height={ size || "15" } {...props}>
    <path d="M15.5,14H0.5C0.2,14,0,14.2,0,14.5C0,14.8,0.2,15,0.5,15h15.1c0.3,0,0.5-0.2,0.5-0.5C16,14.2,15.8,14,15.5,14z M8.1,10.9 C8.2,11,8.4,11,8.5,11c0.1,0,0.3,0,0.4-0.1l3.5-3.5c0.2-0.2,0.2-0.5,0-0.7c-0.2-0.2-0.5-0.2-0.7,0L9,9.3V0.5C9,0.2,8.8,0,8.5,0 C8.2,0,8,0.2,8,0.5v8.8L5.3,6.6c-0.2-0.2-0.6-0.2-0.7,0c-0.2,0.2-0.2,0.5,0,0.7L8.1,10.9z"
    />
  </svg>
);
download.displayName = 'download';
download.propTypes = {
  size: PropTypes.string
}
export default download;
/* tslint:enable */
/* eslint-enable */
