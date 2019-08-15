import React from 'react';
import {Button} from 'antd';
import SyntaxHighlighter from 'react-syntax-highlighter';
// choose highlighter style here: https://conorhastings.github.io/react-syntax-highlighter/demo/
import {tomorrowNightEighties} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import s from './CodePanel.module.scss';
import {useGalleryContext} from '../../hooks/useGalleryContext';

function CodePanel() {

  const {styleParams} = useGalleryContext();

  const [hasCopied, setHasCopied] = React.useState(false);
  let timerId;

  const onCopy = () => {
    clearTimeout(timerId);
    copyToClipboard(code);
    setHasCopied(true);
    timerId = setTimeout(() => {
      setHasCopied(false);
    }, 3000);
  };

  const code = getCode(styleParams);
  return (
    <div className={s.wrapper}>
      <Button disabled={hasCopied} className={s.copyButton} onClick={onCopy}>
        {hasCopied ? 'Copy Successful' : 'Copy to clipboard'}
      </Button>
      <SyntaxHighlighter
        useInlineStyles={true}
        language={'javascript'}
        style={tomorrowNightEighties}
        codeTagProps={{
          className: s.code,
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

function getCode(styles) {
  return `import { ProGallery } from 'pro-gallery';

const galleryStyles = ${JSON.stringify(styles, null, 4)};

export function MyComponent({ onGetMoreItems }) {
  return (
    <ProGallery
        at={Date.now()}
        scrollingElement={window}
        container={{
          scrollBase: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        }}
        items={images}
        getMoreItems={onGetMoreItems}
        totalItemsCount={images.length}
        styles={galleryStyles}
    />
  );
}`;
}

// proudly copy and pasted from https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  const selected =
    document.getSelection().rangeCount > 0 ?
      document.getSelection().getRangeAt(0) :
      false;
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  if (selected) {
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(selected);
  }
};

export {CodePanel};
