/* eslint-disable */
/* tslint:disable */
import PropTypes from 'prop-types';
import React from 'react';
const share_store = ({size, ...props}) => (
  <svg viewBox="0 0 18 17" fill="currentColor" width={ size || "18" } height={ size || "17" } {...props}>
    <path d="M12.221 2.361l4.453 4.722-4.453 4.723v-1.7l-.758-.19a9.37 9.37 0 0 0-2.274-.283c-2.936 0-5.684 1.228-7.673 3.211 2.179-8.31 8.905-8.783 9.758-8.783h.947v-1.7zm-.947.756C9.189 3.21.664 4.627 0 17c1.516-3.778 5.116-6.328 9.19-6.328.663 0 1.326.095 2.084.19v3.305L18 7.083 11.274 0v3.117z"
    />
  </svg>
);
share_store.displayName = 'share_store';
share_store.propTypes = {
  size: PropTypes.string
}
export default share_store;
/* tslint:enable */
/* eslint-enable */
