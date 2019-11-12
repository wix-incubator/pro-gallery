import React, {useEffect, useState} from 'react';
import {SideBar} from '../SideBar';
import {Button} from 'antd';
import {useGalleryContext} from '../../hooks/useGalleryContext';
import {testItems, testImages, testVideos, testTexts} from './images';
import {mixAndSlice} from "../../utils/utils";
import {SIDEBAR_WIDTH, ITEMS_BATCH_SIZE} from '../../constants/consts';
import { resizeMediaUrl } from '../../utils/itemResizer';
import {setStyleParamsInUrl} from '../../constants/styleParams'
// import { ProFullscreen } from '@wix/pro-fullscreen-renderer';
// import '@wix/pro-fullscreen-renderer/dist/statics/main.css';
// import '@wix/pro-fullscreen-renderer/dist/src/assets/styles/fullscreen.global.scss';0

import ProGallery from 'pro-gallery/dist/src/components/gallery/proGallery';
import GALLERY_EVENTS from 'pro-gallery/dist/src/common/constants/events';
import 'pro-gallery/dist/statics/main.css';
import s from './App.module.scss';

const pJson = require('../../../package.json');

const initialItems = {
  mixed: mixAndSlice(testItems, ITEMS_BATCH_SIZE),
  texts: mixAndSlice(testTexts, ITEMS_BATCH_SIZE),
  videos: mixAndSlice(testVideos, ITEMS_BATCH_SIZE),
  images: mixAndSlice(testImages, ITEMS_BATCH_SIZE)
};

const galleryReadyEvent = new Event('galleryReady');

export function App() {

  const {setDimentions, styleParams, setItems, items, isAvoidWidthMeasuring, isAvoidHeightMeasuring, gallerySettings} = useGalleryContext();
  const [showSide, setShowSide] = useState(false);
  // const [fullscreenIdx, setFullscreenIdx] = useState(-1);
  const {numberOfItems = 0, mediaType = 'mixed'} = gallerySettings || {};

  setStyleParamsInUrl(styleParams);

  const switchState = () => {
    const width = showSide ? window.innerWidth : window.innerWidth - SIDEBAR_WIDTH;
    setDimentions(width, window.innerHeight);
    setShowSide(!showSide);
  };

  useEffect(() => {
    const handleResize = () => {
      const width = showSide ? window.innerWidth : window.innerWidth - SIDEBAR_WIDTH;
      setDimentions(width, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setDimentions, showSide]);

  const setGalleryReady = () => {
    window.dispatchEvent(galleryReadyEvent);
  }

  const eventListener = (eventName, eventData) => {
    switch (eventName) {
      case GALLERY_EVENTS.APP_LOADED:
        setGalleryReady();
        break;
      case GALLERY_EVENTS.GALLERY_CHANGE:
        // setGalleryReady();
        break;
      case GALLERY_EVENTS.NEED_MORE_ITEMS:
        addItems();
        break;
      case GALLERY_EVENTS.ITEM_ACTION_TRIGGERED:
        // setFullscreenIdx(eventData.idx);
        break;
      default:
        // console.log({eventName, eventData});
        break;
    }
  }

  const container = {
    height: isAvoidHeightMeasuring ? '' : window.innerHeight, //if isAvoidWidthMeasuring we want to simulate also 'isUnknownHeight'
    width: isAvoidWidthMeasuring ? '' : window.innerWidth - (showSide ? SIDEBAR_WIDTH : 0), //if isAvoidWidthMeasuring we want to simulate also 'isUnknownWidth'
    scrollBase: 0,
    avoidMeasuringWidth: isAvoidWidthMeasuring,
    avoidHeightMeasuring: isAvoidHeightMeasuring
  };

  const addItems = () => {
    const items = getItems();
    if (!window.benchmarking && (!numberOfItems || items.length < numberOfItems)) { //zero items means infinite
      setItems(items.concat(createItems()));
    }

  }
  const createItems = () => {
    return mixAndSlice((mediaType === 'images' ? testImages : mediaType === 'videos' ? testVideos : mediaType === 'texts' ? testTexts : testItems), numberOfItems || ITEMS_BATCH_SIZE);
  }

  const getItems = () => {

    // return initialItems.mixed.slice(0, 3);

    const theItems = items || initialItems[mediaType];
    if (numberOfItems > 0) {
      return theItems.slice(0, numberOfItems);
    } else {
      return theItems;
    }
  }

  return (
    <main className={s.main}>
      <Button className={s.toggleButton} onClick={switchState} icon={showSide ? "close" : "menu"} shape="circle" size="default" type="primary" />
      <aside className={s.sideBar} style={{width: SIDEBAR_WIDTH, marginLeft: !showSide ? -1 * SIDEBAR_WIDTH : 0}}>
        <div className={s.heading}>
          Pro Gallery Playground <span className={s.version}>v{pJson.version}</span>
        </div>
        <SideBar />
      </aside>
      <section className={s.gallery} style={{paddingLeft: showSide ? SIDEBAR_WIDTH : 0}}>
        <ProGallery
          key={`pro-gallery-${isAvoidWidthMeasuring}-${isAvoidHeightMeasuring}-${getItems()[0].itemId}`}
          scrollingElement={window}
          container={container}
          items={getItems()}
          styles={styleParams}
          eventsListener={eventListener}
          totalItemsCount={numberOfItems > 0 ? numberOfItems : Infinity}
          resizeMediaUrl={resizeMediaUrl}
        />
      </section>
      {/* <section className={['pro-fullscreen-wrapper', s.fullscreen].join(' ')} style={{...container, opacity: (fullscreenIdx >= 0 ? 1 : 0), pointerEvents: (fullscreenIdx >= 0 ? 'initial' : 'none')}}>
      fullscreenIdx >= 0 && (
          <ProFullscreen
            items={images}
            initialIdx={fullscreenIdx}
            totalItemsCount={Infinity}
            container={container}
            actions={{
              getMoreItems: () => setImages(images.concat(mixAndSlice(testItems, ITEMS_BATCH_SIZE))),
              close: () => setFullscreenIdx(-1),
            }}
            locale={'en'}
            deviceType={'desktop'}
            styles={styleParams}
          />
        )
        </section> */}
    </main>
  );
}
