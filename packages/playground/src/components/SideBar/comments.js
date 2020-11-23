
// eslint-disable-next-line no-sparse-arrays
const comments = ['setting that now we save in "appSettings" storage but can be converted to styleParams \n'+
'watermarkOpacity\n'+
'watermarkSize\n'+
'watermarkDock\n'
,
'--> properties to support when building settings:\n'+
'Font \\ Color picker: \n'+
'INPUT_TYPES.TEXT - maxLength\n'+
'INPUT_TYPES.NUMBER - step\n'
,
'--> settings that are in styleParamBuilder but can not be changed form playground interface: \n'+
'fullscreen\n'+
'collageAmount\n'+
'gallerySizeType - wixers\n'+
'groupSize\n'+
'chooseBestGroup - wixers\n'+
'groupTypes - wixers\n'+
'rotatingGroupTypes - wixers\n'+
'rotatingCropRatios - wixers\n'+
'cubeImages - wixers\n'+
'smartCrop - wixers\n'+
'cubeRatio - wixers\n'+
'fixedColumns - wixers\n'+
'groupsPerStrip - wixers\n'+
'placeGroupsLtr - wixers\n'+
'galleryType - check that all layout define this property\n',
,
'--> Mobile: \n'+
'*) in mobile the default are deferent\n'+
'*) context.isMobile - itemClick option is responsive to mobile \n'+
'*) I saw that mobile properties are generated with \'m_\' in settings-controller \n'+
'*) properties that are not implemented  - mobile needs to be checked - this is not a complete list \n'+
'm_numberOfImagesPerRow\n'+
'mobilePanorama\n'+
'm_isAutoSlideshow\n'+
'm_galleryLayout\n'+
'm_slideshowLoop - defined but I don\'t see where we use it\n'+
'm_playButtonForAutoSlideShow - defined but I don\'t see where we use it\n'+
'mobileSwipeAnimation\n'];

export default comments;
