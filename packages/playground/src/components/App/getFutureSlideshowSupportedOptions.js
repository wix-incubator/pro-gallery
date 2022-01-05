import {GALLERY_CONSTS} from 'pro-gallery-lib'

export default function getFutureSlideshowSupportedOptions(options){ 
  if(options.galleryLayout !== GALLERY_CONSTS.layout.FUTURE_SLIDESHOW) return options
  const sourceToDestinationOptions = {
    slideshowInfoSize: 'textBoxHeight'
  }
  const overrides = Object
    .keys(sourceToDestinationOptions)
    .map(k => ({[sourceToDestinationOptions[k]]: options[k]}))
    .reduce(Object.assign)
  const result = Object.assign({}, options, overrides)
  Object
    .keys(sourceToDestinationOptions)
    .forEach(slideShowKey => delete result[slideShowKey])
  return result
}
