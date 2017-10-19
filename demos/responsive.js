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
for (let i = 0; i < 1000; i++) {
  items.push({
    id: generateUUID(),
    width: rnd(500, 1500),
    height: rnd(500, 1500),
    bgColor: 'rgba(' + rnd(100, 255) + ',' + rnd(100, 255) + ',' + rnd(100, 255) + ',1)'
  });
}

const styleParams = {
  columnSize: 500,
  isColumnsLayout: true,
  itemSpacing: 20
  //add more style params here
};
const parent = document.createElement('div');
parent.id = 'root';
document.body.prepend(parent);
document.body.style.margin = '-' + styleParams.itemSpacing + 'px';
document.body.style.padding = 0;

const pause = document.createElement('button');
pause.id = 'pause-button';
pause.onclick = togglePause;
pause.innerHTML = 'PAUSE LAYOUTER';
pause.style.position = 'fixed';
pause.style.zIndex = 999;
pause.style.top = '10px';
pause.style.right = '10px';
document.body.prepend(pause);

const warning = document.createElement('div');
warning.id = 'warning';
warning.innerHTML = '' +
'Notice: this demo is using a method of replacing the dom completely after every scroll / resize event. This is inefficient and not recommended for production usage. <br/>' +
'Please use React virtual dom or any other efficient process to replace dom elements.';
warning.style.position = 'fixed';
warning.style.zIndex = 998;
warning.style.bottom = '0';
warning.style.left = '0';
warning.style.backgroundColor = 'rgb(240, 245, 115)';
warning.style.padding = '20px';
warning.style.width = '100%';
document.body.prepend(warning);

function togglePause() {
  window.paused = !window.paused;
  pause.innerHTML = window.paused ? 'RESUME LAYOUTER' : 'PAUSE LAYOUTER';
}

let windowHeight = 0;
let windowWidth = 0;
let windowScroll = 0;

function placeItems() {

  if (window.paused === true) {
    return;
  }

  if (
    Math.abs(windowHeight - window.innerHeight) < 100 &&
    Math.abs(windowWidth - window.innerWidth) < 100 &&
    Math.abs(windowScroll - window.scrollY) < 250
  ) {
    console.log('Not re-rendering, change is too small');
    return;
  }

  console.time('Placing Items');

  windowHeight = window.innerHeight;
  windowWidth = window.innerWidth;
  windowScroll = window.scrollY;

  const visiblePadding = 0;
  const renderedPadding = windowHeight * 2;

  const container = {
    width: windowWidth,
    height: windowHeight,
    bounds: {
      visibleTop: windowScroll - visiblePadding,
      visibleBottom: windowScroll + windowHeight + visiblePadding,
      renderedTop: windowScroll - renderedPadding,
      renderedBottom: windowScroll + windowHeight + renderedPadding,
    }
  };

  const layoutParams = {
    items,
    styleParams,
    container
  };

  const layout = new Layouter(layoutParams);
  let totalVisibleItems = 0;
  let totalRenderedItems = 0;

  parent.innerHTML = '';
  for (let column, c = 0; column = layout.columns[c]; c++) {
    const cDom = document.createElement('div');
    cDom.id = 'column';
    cDom.style.width = layout.colWidth + 'px';
    cDom.style.float = 'left';
    cDom.style.position = 'relative';
    parent.append(cDom);

    let isFirstRenderedGroup = true;
    for (let group, g = 0; group = column[g]; g++) {

      if (group.rendered) {
        totalRenderedItems += group.items.length;

        const gDom = document.createElement('div');
        gDom.style.width = group.width + 'px';
        gDom.style.height = group.height + 'px';
        gDom.style.display = 'inline-block';
        gDom.style.position = 'relative';
        gDom.style.float = 'left';

        if (isFirstRenderedGroup) {
          gDom.style.marginTop = group.top + 'px';
          isFirstRenderedGroup = false;
        }

        cDom.append(gDom);

        if (!group.visible) {
          const iDom = document.createElement('div');
          iDom.style.width = (group.width - styleParams.itemSpacing * 2) + 'px';
          iDom.style.height = (group.height - styleParams.itemSpacing * 2) + 'px';
          iDom.style.position = 'absolute';
          iDom.style.top = styleParams.itemSpacing + 'px';
          iDom.style.left = styleParams.itemSpacing + 'px';
          iDom.style.border = '2px solid #eee';
          gDom.append(iDom);

        } else {
          totalVisibleItems += group.items.length;
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
            gDom.append(iDom);
          }
        }
      }
    }
  }
  console.timeEnd('Placing Items');
  console.log('Placed ' + totalRenderedItems + ' Rendered Items and ' + totalVisibleItems + ' Visible Items');
}

window.addEventListener('scroll', placeItems);
window.addEventListener('resize', placeItems);
placeItems();
