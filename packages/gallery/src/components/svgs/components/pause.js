/* eslint-disable */
/* tslint:disable */
import PropTypes from 'prop-types';
import React from 'react';
const pause = ({size, ...props}) => (
  <svg viewBox="0 0 10 14" fill="currentColor" width={ size || "10" } height={ size || "14" } {...props}>
    <g id="final" stroke="none" fill="none" strokeWidth="1" fillRule="evenodd">
      <g id="Play" transform="translate(-490 -763)" fill="currentColor">
        <g id="Group-2" transform="translate(470 284)">
          <g id="Group" transform="translate(20 479)">
            <path d="M7,0 L10,0 L10,14 L7,14 L7,0 Z M0,0 L3,0 L3,14 L0,14 L0,0 Z" id="_copy_3" />
          </g>
        </g>
      </g>
    </g>
  </svg>
);
pause.displayName = 'pause';
pause.propTypes = {
  size: PropTypes.string
}
export default pause;
/* tslint:enable */
/* eslint-enable */
