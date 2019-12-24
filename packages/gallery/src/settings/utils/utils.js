import GALLERY_CONSTS from '../../common/constants';
import { isInPreset } from '../../components/helpers/layoutHelper'

export const formatTitle = title => title.replace(/_/g, ' ').split(' ').map(word => word[0].toUpperCase() + word.substr(1).toLowerCase()).join(' ');
export const createOptions = constName => Object.entries(GALLERY_CONSTS[constName]).map(([title, value]) => ({ value, title: formatTitle(title) }));
export const always = () => true;
export const imageMargin = (styleParams) => !isInPreset(styleParams,'imageMargin');
export const hoveringBehaviour = (styleParams)  => !isInPreset(styleParams,'hoveringBehaviour')
export const allowHover = (styleParams) => !isInPreset(styleParams,'allowHover');