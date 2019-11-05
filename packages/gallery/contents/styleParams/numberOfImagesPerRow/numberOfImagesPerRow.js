export const numberOfImagesPerRow = {
    title: 'Items per row',
    description: 'Specifies the number of images to set per each row',
    isRelevant: (styleParams) => (styleParams.scrollDirection === 0 || !styleParams.oneRow) && (styleParams.galleryLayout === 2 && styleParams.gridStyle === 1)
}

