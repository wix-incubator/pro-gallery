import cloneDeep from 'lodash.clonedeep';

export function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.floor(Math.random() * 16) || 0;
    return c === 'x' ? r.toString(16) : c;
  });
}

export function mixAndSlice(array, length) {
  let result = [];
  if (array.length > 0) {
    const rndIdx = () => Math.floor(Math.random() * array.length)
    while (result.length < length) {
      const idx = rndIdx();
      let item = cloneDeep(array[idx]);
      // Object.assign(item, array[idx]);
      item.itemId = generateUUID() + '_' + String(result.length);
      item.metadata.title = `Item #${result.length + 1}`;
      // console.log('ITEM CREATED', item, array[idx]);
      result.push(item);
    }
  }
  return result;

}
