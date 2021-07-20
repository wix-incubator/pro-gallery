import PropTypes from 'prop-types';

export default {
  items: PropTypes.array.isRequired,
  dimensions: PropTypes.object.isRequired,

  domId: PropTypes.string,
  scrollingElement: PropTypes.any,
  options: PropTypes.object,
  eventsListener: PropTypes.func,
  totalItemsCount: PropTypes.number,
  resizeMediaUrl: PropTypes.func,
};
