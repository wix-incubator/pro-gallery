function findNeighborItem(itemIdx, dir, layoutItems) {
  const currentItem = layoutItems[itemIdx];

  let neighborItem;

  const findClosestItem = (currentItemX, currentItemY, condition) => {
    let minDistance = null;
    let minDistanceItem = {};

    let itemY;
    let itemX;
    let distance;

    // each(slice(layoutItems, itemIdx - 50, itemIdx + 50), (item) => {
    layoutItems.forEach(item => {
      itemY = item.offset.top + item.height / 2;
      itemX = item.offset.left + item.width / 2;
      distance = Math.sqrt(
        Math.pow(itemY - currentItemY, 2) + Math.pow(itemX - currentItemX, 2),
      );
      if (
        (minDistance === null || (distance > 0 && distance < minDistance)) &&
        condition(currentItemX, currentItemY, itemX, itemY)
      ) {
        minDistance = distance;
        minDistanceItem = item;
      }
    });
    return minDistanceItem;
  };

  switch (dir) {
    case 'up':
      neighborItem = findClosestItem(
        currentItem.offset.left + currentItem.width / 2,
        currentItem.offset.top,
        (curX, curY, itmX, itmY) => itmY < curY,
      );
      break;

    case 'left':
      neighborItem = findClosestItem(
        currentItem.offset.left,
        currentItem.offset.top + currentItem.height / 2,
        (curX, curY, itmX) => itmX < curX,
      );
      break;

    case 'down':
      neighborItem = findClosestItem(
        currentItem.offset.left + currentItem.width / 2,
        currentItem.offset.bottom,
        (curX, curY, itmX, itmY) => itmY > curY,
      );
      break;

    default:
    case 'right':
      neighborItem = findClosestItem(
        currentItem.offset.right,
        currentItem.offset.top + currentItem.height / 2,
        (curX, curY, itmX) => itmX > curX,
      );
      break;
  }

  if (neighborItem.idx >= 0) {
    return neighborItem.idx;
  } else {
    console.warn('Could not find offset for itemIdx', itemIdx, dir);
    return itemIdx; //stay on the same item
  }
}

export default findNeighborItem;
