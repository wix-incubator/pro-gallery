import React, {useEffect, useState} from 'react';
import {SideBar} from '../SideBar';
import {Button} from 'antd';
import {useGalleryContext} from '../../hooks/useGalleryContext';
import {testItems, testImages, testVideos, testTexts} from './images';
import {mixAndSlice} from "../../utils/utils";
import {SIDEBAR_WIDTH, ITEMS_BATCH_SIZE} from '../../constants/consts';
import { resizeMediaUrl } from '../../utils/itemResizer';
import {setStyleParamsInUrl} from '../../constants/styleParams'
import {GALLERY_CONSTS, ExpandableProGallery} from 'pro-gallery';
import 'pro-gallery/dist/statics/main.css';
import s from './App.module.scss';

const pJson = require('../../../package.json');

const GALLERY_EVENTS = GALLERY_CONSTS.events;

const initialItems = {
  mixed: mixAndSlice(testItems, ITEMS_BATCH_SIZE),
  texts: mixAndSlice(testTexts, ITEMS_BATCH_SIZE),
  videos: mixAndSlice(testVideos, ITEMS_BATCH_SIZE),
  images: mixAndSlice(testImages, ITEMS_BATCH_SIZE)
};

const galleryReadyEvent = new Event('galleryReady');

export function App() {

  const {setDimentions, styleParams, setItems, items, isUnknownDimensions, isAvoidGallerySelfMeasure, gallerySettings} = useGalleryContext();
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
    height: isUnknownDimensions ? '' : window.innerHeight,
    width: isUnknownDimensions ? '' : window.innerWidth - (showSide ? SIDEBAR_WIDTH : 0),
    scrollBase: isUnknownDimensions ? '' : 0,
    avoidGallerySelfMeasure: isAvoidGallerySelfMeasure,
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
      <aside className={s.sideBar} style={{width: SIDEBAR_WIDTH, marginLeft: !showSide ? -1 * SIDEBAR_WIDTH : 0, display: showSide ? 'block' : 'none'}}>
        <div className={s.heading}>
          Pro Gallery Playground <span className={s.version}>v{pJson.version}</span>
        </div>
        <SideBar />
      </aside>
      <section className={s.gallery} style={{paddingLeft: showSide ? SIDEBAR_WIDTH : 0}}>
        <ExpandableProGallery
          key={`pro-gallery-${isUnknownDimensions}-${isAvoidGallerySelfMeasure}-${getItems()[0].itemId}`}
          domId={'pro-gallery-playground'}
          scrollingElement={window}
          container={container}
          items={getItems()}
          styles={styleParams}
          eventsListener={eventListener}
          totalItemsCount={numberOfItems > 0 ? numberOfItems : Infinity}
          resizeMediaUrl={resizeMediaUrl}
        />
      </section>
    </main>
  );
}
