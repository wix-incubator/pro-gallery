import React from 'react';

import { ProGallery } from 'pro-gallery';
import { testImages } from '../App/images';
import { mixAndSlice } from "../../utils/utils";
import { resizeMediaUrl } from '../../utils/itemResizer';

export const GalleryPreview = (item) => {
    return (
        <div style={{ 
            width: 736, 
            overflow: 'hidden', 
            height: 700, 
            zoom: 0.5,
            pointerEvents: 'none'
        }}>
            <ProGallery
                items={mixAndSlice(testImages, 50)}
                options={item.options}
                container={{ width: 736, height: 700 }}
                resizeMediaUrl={resizeMediaUrl}
            ></ProGallery>
        </div>
    )
}