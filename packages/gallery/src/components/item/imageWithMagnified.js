import ImageItem from './imageItem';
import withMagnified from '../hoc/withMagnified';
import withGlass from '../hoc/withGlass';
export default withMagnified(withGlass(ImageItem));
