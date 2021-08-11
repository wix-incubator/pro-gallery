function convertStyles(initialStyles) {
  let styles = { ...initialStyles };
  styles['cropRatio'] = initialStyles['cubeRatio'];
  return styles;
}

export { convertStyles };
