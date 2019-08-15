export function getHoverStyle(styleParams) {
  return {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    boxSizing: 'border-box',
    paddingLeft: styleParams.textsHorizontalPadding + 'px',
    paddingRight: styleParams.textsHorizontalPadding + 'px',
    paddingTop:
      (styleParams.galleryVerticalAlign !== 'center'
        ? styleParams.textsVerticalPadding
        : 0) + 'px',
    paddingBottom:
      (styleParams.galleryVerticalAlign !== 'center'
        ? styleParams.textsVerticalPadding
        : 0) + 'px',
  };
}
