import PropTypes from 'prop-types';

export default {
    items: PropTypes.array.isRequired,
    container: PropTypes.object.isRequired,

    domId: PropTypes.string,
    scrollingElement: PropTypes.any,
    options: PropTypes.object,
    eventsListener: PropTypes.function,
    totalItemsCount: PropTypes.number,
    resizeMediaUrl: PropTypes.function,
};
