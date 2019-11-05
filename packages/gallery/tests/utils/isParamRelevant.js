import {
    numberOfImagesPerCol,
    numberOfImagesPerRow
} from './utils';



const relevantParams = (styleParams) => {
    return {
        numberOfImagesPerCol: numberOfImagesPerCol.isRelevant(styleParams),
        numberOfImagesPerRow: numberOfImagesPerRow.isRelevant(styleParams)
    }
}

export { relevantParams }