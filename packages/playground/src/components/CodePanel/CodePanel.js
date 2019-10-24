import React from 'react';
import {Modal, Button} from 'antd';
import SyntaxHighlighter from 'react-syntax-highlighter';
// choose highlighter style here: https://conorhastings.github.io/react-syntax-highlighter/demo/
import {tomorrowNightEighties} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import s from './CodePanel.module.scss';
import {useGalleryContext} from '../../hooks/useGalleryContext';
import {settingsManager} from '../../settings/settingsManager';

function CodePanel() {

  const {styleParams} = useGalleryContext();

  const [hasCopied, setHasCopied] = React.useState(false);
  const [modalVisible, set_modalVisible] = React.useState(false);
  let timerId;

  const onCopy = () => {
    clearTimeout(timerId);
    copyToClipboard(code);
    setHasCopied(true);
    timerId = setTimeout(() => {
      setHasCopied(false);
    }, 3000);
  };

  const getStyleParams = () => {
    return Object.entries(settingsManager)
      .filter(([key, settings]) => Boolean(styleParams[key]) && settings.isRelevant(styleParams, {}))
      .reduce((acc, [key]) => {
        const val = typeof styleParams[key] === 'string' ? `'${styleParams[key]}'` : styleParams[key];
        return acc.concat(`    ${key}: ${val},`);
    }, []).join(`\n`);
  }

  const code = getCode(getStyleParams());
  return (
    <div className={s.wrapper}>
      <Modal
        title="ProGallery Code"
        centered
        width={window.innerWidth > 600 ? window.innerWidth - 200 : window.innerWidth}
        visible={modalVisible}
        onOk={onCopy}
        okText={hasCopied ? 'Copy Successful' : 'Copy to clipboard'}
        okButtonProps={{disabled: hasCopied}}
        cancelText={'Close'}
        onCancel={() => set_modalVisible(false)}
      >
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
      </Modal>
      <Button icon="code" shape="" size="large" disabled={modalVisible} onClick={() => set_modalVisible(true)}>
        Generate Gallery Code 
      </Button>
    </div>
  );
}

function getCode(options) {
  return `
  import { ProGallery } from 'pro-gallery';

  export function Gallery() {

    // Add your images here...
    const items = [];

    // The options of the gallery (from the playground current state)
    const options = {
${options}
    };

    // The size of the gallery container. The images will fit themselves in it
    const container = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    // The eventsListener will notify you anytime something has happened in the gallery.
    const eventsListener = (eventName, eventData) => console.log({eventName, eventData}); 

    // The scrollingElement is usually the window, if you are scrolling inside another element, suplly it here
    const scrollingElement = window;

    return (
      <ProGallery
        items={items}
        options={options}
        container={container}
        eventsListener={eventsListener}
        scrollingElement={scrollingElement}
      />
    );
  }

  // Enjoy using your new gallery!
  // For more options, visit https://github.com/wix-incubator/pro-gallery
`;
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
