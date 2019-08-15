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
pause.innerHTML = 'PAUSE INFINITE SCROLL';
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
  pause.innerHTML = window.paused ? 'RESUME INFINITE SCROLL' : 'PAUSE INFINITE SCROLL';
}

let windowHeight = 0;
let windowWidth = 0;
let windowScroll = 0;
let layout;

function calcContainer() {
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

  return container;
}

function setItemsVisibility() {
  if (window.paused === true) {
    return;
  }

  if (
    Math.abs(windowScroll - window.scrollY) < 250
  ) {
    console.log('Not re-rendering, change is too small');
    return;
  }

  if (layout) {
    layout.calcVisibilities(calcContainer().bounds);
    createDom();
  } else {
    placeItems();
  }

}

function placeItems() {

  if (window.paused === true) {
    return;
  }

  if (
    Math.abs(windowHeight - window.innerHeight) < 100 &&
    Math.abs(windowWidth - window.innerWidth) < 100
  ) {
    console.log('Not re-rendering, change is too small');
    return;
  }

  const layoutParams = {
    items,
    styleParams,
    container: calcContainer()
  };

  layout = new Layouter(layoutParams);

  createDom();
}

function createDom() {
  console.time('Creating Dom');

  parent.innerHTML = '';
  for (let i = 0; i < layout.items.length; i++) {
    const item = layout.items[i].scheme;
    if (item.visibility.visible || item.visibility.rendered) {
      const iDom = document.createElement('div');
      iDom.innerHTML = i;
      iDom.style.width = item.width + 'px';
      iDom.style.height = item.height + 'px';
      iDom.style.position = 'absolute';
      iDom.style.top = item.offset.top + 'px';
      iDom.style.left = item.offset.left + 'px';
      if (item.visibility.visible) {
        iDom.style.backgroundColor = items[i].bgColor;
      } else {
        iDom.style.backgroundColor = '#ccc';
      }
      parent.prepend(iDom);
    }
  }
  console.timeEnd('Creating Dom');
}

window.addEventListener('scroll', setItemsVisibility);
window.addEventListener('resize', placeItems);
placeItems();
