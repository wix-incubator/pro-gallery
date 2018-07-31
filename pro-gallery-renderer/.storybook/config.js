import { configure } from '@storybook/react';

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /.stories.js$/);

function setIframeStyles() {
  Object.assign(top.document.body.getElementsByTagName('iframe')[0].style, {
    display: 'block',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 100,
    background: 'white'
  });
}
function loadStories() {
  setIframeStyles();
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
