
export default {
  title: 'Crop Ratio',
  description: `The option sets the ratio between the width and height of the item, this is a string that will be evaluated on runtime. Use 'X%/Y%' to indicate that the ratio is responsive. e.g.
  '1' is a square, '16/9' is a wide screen rectangle and '100%/50%' is full width and half the height of the container`,
  isRelevant: (styleParams) => styleParams.cubeImages,
  default: 1,
}