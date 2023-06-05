import React from 'react';
import { CodeOutlined } from '@ant-design/icons';
import { Modal, Button } from 'antd';
import SyntaxHighlighter from 'react-syntax-highlighter';
// choose highlighter style here: https://conorhastings.github.io/react-syntax-highlighter/demo/
import { tomorrowNightEighties } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import s from './CodePanel.module.scss';
import { useGalleryContext } from '../../hooks/useGalleryContext';
import { getOptionsFromUrl } from '../../constants/options';
import { flatToNested } from 'pro-gallery-lib';

function CodePanel() {
  const { options } = useGalleryContext();

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
    const { layoutParams_structure_galleryLayout } = options;
    const migratedOptions = flatToNested({
      layoutParams_structure_galleryLayout,
      ...getOptionsFromUrl(window.location.search),
    });
    let { layoutParams, behaviourParams, stylingParams } = migratedOptions;
    const v4Options = { layoutParams, behaviourParams, stylingParams };
    return JSON.stringify(v4Options, null, 4);
  };

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
        okButtonProps={{ disabled: hasCopied }}
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
      <Button
        type="primary"
        icon={<CodeOutlined />}
        shape="round"
        size="large"
        disabled={modalVisible}
        onClick={() => set_modalVisible(true)}
        block
      >
        Generate Gallery Code
      </Button>
    </div>
  );
}

function getCode(options) {
  return `
  import { ProGallery } from 'pro-gallery';
  import 'pro-gallery/dist/statics/main.css';

  export function Gallery() {

    // Add your images here...
    const items = [
            { // Image item:
                    itemId: 'sample-id',
                    mediaUrl: 'https://i.picsum.photos/id/674/200/300.jpg?hmac=kS3VQkm7AuZdYJGUABZGmnNj_3KtZ6Twgb5Qb9ITssY',
                    metaData: {
                            type: 'image',
                            height: 200,
                            width: 100,
                            title: 'sample-title',
                            description: 'sample-description',
                            focalPoint: [0, 0],
                            link: {
                                    url: 'http://example.com',
                                    target: '_blank'
                            },
                    }
            },
            { // Another Image item:
                    itemId: 'differentItem',
                    mediaUrl: 'https://i.picsum.photos/id/1003/1181/1772.jpg?hmac=oN9fHMXiqe9Zq2RM6XT-RVZkojgPnECWwyEF1RvvTZk',
                    metaData: {
                            type: 'image',
                            height: 200,
                            width: 100,
                            title: 'sample-title',
                            description: 'sample-description',
                            focalPoint: [0, 0],
                            link: {
                                    url: 'http://example.com',
                                    target: '_blank'
                            },
                    }
            },
            { // HTML item:
                    itemId: 'htmlItem',
                    html: "<div style='width: 300px; height: 200px; background:pink;'>I am a text block</div>",
                    metadata: {
                            type: "text",
                            height: 200,
                            width: 300,
                            title: 'sample-title',
                            description: 'sample-description',
                            backgroundColor: 'pink'
                    },

            },
    ]


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
  // For more options, visit https://github.com/wix/pro-gallery
`;
}

// proudly copy and pasted from https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
const copyToClipboard = (str) => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  if (selected) {
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(selected);
  }
};

export { CodePanel };
