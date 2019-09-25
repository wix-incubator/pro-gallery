/* eslint-disable */
/* tslint:disable */
import PropTypes from 'prop-types';
import React from 'react';
const play = ({size, ...props}) => (
  <svg viewBox="0 0 11 14" fill="currentColor" width={ size || "11" } height={ size || "14" } {...props}>
    <g id="final" stroke="none" fill="none" strokeWidth="1" fillRule="evenodd">
      <g id="Pause" transform="translate(-490 -763)" fill="currentColor">
        <g id="Group-2" transform="translate(470 284)">
          <g id="Group" transform="translate(20 479)">
            <path id="play" d="M0.0788076641 0L0 14 10.5 6.81856071z" />
          </g>
        </g>
      </g>
    </g>
  </svg>
);
play.displayName = 'play';
play.propTypes = {
  size: PropTypes.string
}
export default play;
/* tslint:enable */
/* eslint-enable */
