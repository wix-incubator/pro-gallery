/* eslint-disable */
/* tslint:disable */
import PropTypes from 'prop-types';
import React from 'react';
const rotate_arrow = ({size = 20, ...props}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={ size } height={ size } {...props} viewBox="0 0 20 20" fill="currentColor">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M11 13.9502C12.4415 13.8056 13.7613 13.3512 14.7973 12.6605C16.0619 11.8174 17 10.543 17 9C17 7.45705 16.0619 6.18257 14.7973 5.33952C13.5258 4.49182 11.8267 4 10 4C8.17326 4 6.47422 4.49182 5.20266 5.33952C3.93809 6.18257 3 7.45705 3 9C3 10.4989 3.88534 11.7445 5.09526 12.5873L5.89741 11.9188C4.72961 11.189 4 10.1513 4 9C4 6.79086 6.68629 5 10 5C13.3137 5 16 6.79086 16 9C16 10.982 13.8377 12.6273 11 12.9447V11L8 13.5L11 16V13.9502Z"/>
  </svg>
);
rotate_arrow.displayName = 'rotate_arrow';
rotate_arrow.propTypes = {
  size: PropTypes.number
}
export default rotate_arrow;
/* tslint:enable */
/* eslint-enable */
