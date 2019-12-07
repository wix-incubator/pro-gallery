export default ({items, options}) => {
    return items.length <= 100 &&
    //   items.every(item => item.type === 'image') &&
      options.galleryLayout === 13
    ; //or something like that....
}