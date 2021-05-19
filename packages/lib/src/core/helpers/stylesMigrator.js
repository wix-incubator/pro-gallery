import utils from '../../common/utils/index';

function stylesMigrator(styles, GALLERY_CONSTS) {
  function consolidateOneRow(styles) {
    // we consolidated oneRow and the scrollDirection SPs into one, scrollDirection
    // This commented code was removed from processStyles:
    // styles.oneRow =
    //   styles.oneRow ||
    //   styles.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL;
    if (!utils.isUndefined(styles.oneRow)) {
      console.warn(
        'Pro Gallery Styles: oneRow is deprecated. use scrollDirection instead'
      );
      styles.scrollDirection = styles.oneRow
        ? GALLERY_CONSTS.scrollDirection.HORIZONTAL
        : styles.scrollDirection;
    }

    if (utils.isUndefined(styles.scrollDirection)) {
      styles.scrollDirection = GALLERY_CONSTS.scrollDirection.VERTICAL;
    }
    delete styles.oneRow;
    return styles;
  }
  consolidateOneRow(styles);
  return styles;
}

export default stylesMigrator;
