export const getContainerUrlParams = (gallerySettings) => {
    let urlParams = '';

    if (!gallerySettings.isUnknownDimensions){
        urlParams = `&containerWidth=${window.innerWidth}&containerHeight=${window.innerHeight}`
    }

    return urlParams;
}