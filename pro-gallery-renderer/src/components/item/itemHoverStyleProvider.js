export function getHoverStyle(styleParams) {
  return {
    paddingLeft: styleParams.textsHorizontalPadding + 'px',
    paddingRight: styleParams.textsHorizontalPadding + 'px',
    paddingTop: styleParams.textsVerticalPadding + 'px',
    paddingBottom: styleParams.textsVerticalPadding + 'px',
  };
}
