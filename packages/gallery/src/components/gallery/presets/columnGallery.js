
import React from 'react';
import ProGallery from '../proGallery/proGallery';
import LAYOUTS from '../../../common/constants/layout';
import GALLERY_CONSTS from '../../../common/constants';

export const fixedStyles = {
  galleryLayout: LAYOUTS.COLUMN,
  scrollDirection: GALLERY_CONSTS.scrollDirection.HORIZONTAL
}
export default class ColumnGallery extends React.Component {

    render() {
        return (
            <ProGallery
                {...this.props}
                styles={{
                    ...this.props.styles,
                    ...fixedStyles
                }}
            />
        );
    }
}
