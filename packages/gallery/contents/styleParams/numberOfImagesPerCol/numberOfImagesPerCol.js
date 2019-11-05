export const numberOfImagesPerCol = {
    title: 'Items Per Column',
    description: 'Specifies the number of items to set per each col',
    isRelevant: (styleParams) => styleParams.scrollDirection === 'horizontal'//(styleParams.scrollDirection === 1 || styleParams.oneRow) && styleParams.galleryLayout === 2,
}