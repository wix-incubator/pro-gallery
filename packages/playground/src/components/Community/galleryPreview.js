import React from 'react';

import { ProGallery } from 'pro-gallery';
import { testImages } from '../App/images';

import { resizeMediaUrl } from '../../utils/itemResizer';

export const GalleryPreview = ({item}) => {

    return (
        <div
            key={item.href}
            style={{
                width: 736,
                overflow: 'hidden',
                height: 700,
                zoom: 0.5,
                pointerEvents: 'none'
            }}>
            <ProGallery
                items={(window.playgroundItems || testImages).slice(0, 20)}
                options={item.options}
                container={{ width: 736, height: 700 }}
                resizeMediaUrl={resizeMediaUrl}
            ></ProGallery>
        </div>
    )
}