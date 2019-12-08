import React from 'react';

// function resizedUrl({url, resizeMethod, requiredWidth, requiredHeight, resizeMediaUrl}) {

//     const resizeUrl = ({item, method, width, height, focalPoint}) => {
//       let _resizedUrl;
//       if (typeof resizeMediaUrl === 'function') {
//         try {
//           _resizedUrl = resizeMediaUrl(item, url, method, width, height, false, false, focalPoint) || '';
//         } catch (e) {
//           _resizedUrl = String(url);
//         }
//       } else {
//         _resizedUrl = String(url);
//       }
//       return _resizedUrl;
//     };

//     requiredWidth = Math.ceil(requiredWidth);
//     requiredHeight = Math.ceil(requiredHeight);
//     const thumbSize = 250;

//     const focalPoint =
//       resizeMethod === 'fill' && options.focalPoint;

//     const urls = {};

//     urls['HIGH_RES'] = () =>
//       resizeUrl(
//         this,
//         url,
//         resizeMethod,
//         requiredWidth,
//         requiredHeight,
//         sharpParams,
//         focalPoint,
//       );

//     urls['LOW_RES'] = () =>
//       resizeUrl(
//         this,
//         url,
//         resizeMethod,
//         thumbSize,
//         (thumbSize * requiredHeight) / requiredWidth,
//         { ...sharpParams, quality: 30, blur: 30 },
//         focalPoint,
//       );
// }

const resizeUrl = ({ item, options, resizeMediaUrl }) => {
    const { url } = item;
    const method = options.cubeType;
    const width = 400;
    const height = 300;
    const focalPoint = false;

    if (typeof resizeMediaUrl === 'function') {
        try {
            return resizeMediaUrl(item, url, method, width, height, false, false, focalPoint) || '';
        } catch (e) {
            return String(url);
        }
    } else {
        return String(url);
    }
};

export default ({ items, options, resizeMediaUrl }) => {
    return (
        <div className="gallery-root">
            asd
        {items.map(item => {
                const src = resizeUrl({ item, options, resizeMediaUrl })
                return (
                    <img src={src} />
                )
            })}

        </div>
    )
}