import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import {App} from './components/App/App';
import {GalleryProvider} from './hooks/GalleryContext';
import 'antd/dist/antd.css';

export const Root = () => (
  <GalleryProvider>
    <App />
  </GalleryProvider>
);

debugger;

export default () => {
  const domString = ReactDOMServer.renderToString(<Root />);
  console.log({domString});
  return domString;
}

const domString = ReactDOMServer.renderToString(<Root />);
console.log({domString});

ReactDOM.render(<Root />, document.getElementById('root'));
