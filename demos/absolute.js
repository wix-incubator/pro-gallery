import {Layouter} from 'pro-gallery-layouter';

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
  itemSpacing: 20,
  allowedGroupTypes: ['1', '2v', '3v']
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

const layout = new Layouter(layoutParams);
const parent = document.createElement('div');
parent.id = 'root';
document.body.prepend(parent);

for (let i = 0; i < layout.items.length; i++) {
  const item = layout.items[i].scheme;
  const iDom = document.createElement('div');
  iDom.innerHTML = i;
  iDom.style.width = item.width + 'px';
  iDom.style.height = item.height + 'px';
  iDom.style.position = 'absolute';
  iDom.style.top = item.offset.top + 'px';
  iDom.style.left = item.offset.left + 'px';
  iDom.style.backgroundColor = items[i].bgColor;
  parent.prepend(iDom);
}
