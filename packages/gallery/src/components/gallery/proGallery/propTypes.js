import PropTypes from 'prop-types';

export default {
  items: PropTypes.array.isRequired,
  container: PropTypes.object.isRequired,

  id: PropTypes.string,
  scrollingElement: PropTypes.any,
  options: PropTypes.object,
  eventsListener: PropTypes.func,
  totalItemsCount: PropTypes.number,
  createMediaUrl: PropTypes.func,
};
