import {createLayout} from 'pro-layouts';

//create random colored boxes
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.floor(Math.random() * 16) || 0;
    return (c === 'x' ? r.toString(16) : c);
  });
}
function rnd(from, to) {
  return Math.floor(Math.random() * (to - from)) + from;
}
const items = [];
for (let i = 0; i < 100; i++) {
  items.push({
    id: generateUUID(),
    width: rnd(500, 1500),
    height: rnd(500, 1500),
    bgColor: 'rgba(' + rnd(100, 255) + ',' + rnd(100, 255) + ',' + rnd(100, 255) + ',1)'
  });
}

const styleParams = {
  rowSize: 500,
  isColumnsLayout: false,
  itemSpacing: 20
  //add more style params here
};
const container = {
  width: window.innerWidth,
  height: window.innerHeight
};

const layoutParams = {
  items,
  styleParams,
  container
};

const layout = createLayout(layoutParams);
const parent = document.createElement('div');
parent.id = 'root';
document.body.prepend(parent);
document.body.style.margin = '-' + styleParams.itemSpacing + 'px';
document.body.style.padding = 0;

for (let column, c = 0; column = layout.columns[c]; c++) {
  const cDom = document.createElement('div');
  cDom.id = 'column';
  cDom.style.width = layout.colWidth + 'px';
  cDom.style.float = 'left';
  cDom.style.position = 'relative';
  parent.prepend(cDom);

  for (let group, g = 0; group = column[g]; g++) {
    const gDom = document.createElement('div');
    gDom.style.width = group.width + 'px';
    gDom.style.height = group.height + 'px';
    gDom.style.display = 'inline-block';
    gDom.style.position = 'relative';
    gDom.style.float = 'left';
    cDom.prepend(gDom);

    for (let item, i = 0; item = group.items[i]; i++) {
      const iDom = document.createElement('div');
      iDom.style.width = item.width + 'px';
      iDom.style.height = item.height + 'px';
      iDom.style.margin = styleParams.itemSpacing + 'px';
      iDom.style.position = item.style.position || 'absolute';
      iDom.style.top = item.style.top + 'px';
      iDom.style.left = item.style.left + 'px';
      iDom.style.right = item.style.right + 'px';
      iDom.style.bottom = item.style.bottom + 'px';
      iDom.style.float = 'left';
      iDom.style.backgroundColor = items[item.idx].bgColor;
      gDom.prepend(iDom);
    }
  }
}
