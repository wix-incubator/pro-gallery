import PropTypes from 'prop-types';

export default {
    domId: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    container: PropTypes.object.isRequired,

    scrollingElement: PropTypes.any,
    options: PropTypes.object,
    eventsListener: PropTypes.function,
    totalItemsCount: PropTypes.number,
    resizeMediaUrl: PropTypes.function,
};
