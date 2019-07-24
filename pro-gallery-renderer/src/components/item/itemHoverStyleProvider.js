export function getHoverStyle(styleParams) {
  return {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    paddingLeft: styleParams.textsHorizontalPadding + 'px',
    paddingRight: styleParams.textsHorizontalPadding + 'px',
    paddingTop: styleParams.textsVerticalPadding + 'px',
    paddingBottom: styleParams.textsVerticalPadding + 'px',
  };
}
