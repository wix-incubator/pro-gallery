import React, {useEffect, Suspense} from 'react';
// import {SideBar} from '../SideBar';
import {useGalleryContext} from '../../hooks/useGalleryContext';
import {testItems, testImages, testVideos, testTexts, monochromeImages} from './images';
import {mixAndSlice, isTestingEnvironment} from "../../utils/utils";
import {SIDEBAR_WIDTH, ITEMS_BATCH_SIZE} from '../../constants/consts';
import { resizeMediaUrl } from '../../utils/itemResizer';
import {setStyleParamsInUrl} from '../../constants/styleParams'
import { GALLERY_CONSTS } from 'pro-gallery';
import ExpandableProGallery from './expandableGallery';
import SideBarButton from '../SideBar/SideBarButton';
import {BlueprintsManager} from 'pro-gallery'
import BlueprintsApi from './PlaygroundBlueprintsApi'

// import Loader from './loader';

import 'pro-gallery/dist/statics/main.css';
import s from './App.module.scss';

const SideBar = React.lazy(() => import('../SideBar'));

const pJson = require('../../../package.json');

const blueprintsManager = new BlueprintsManager({id: 'playground'});
const GALLERY_EVENTS = GALLERY_CONSTS.events;

const initialItems = {
  mixed: mixAndSlice(testItems, ITEMS_BATCH_SIZE),
  texts: mixAndSlice(testTexts, ITEMS_BATCH_SIZE),
  videos: mixAndSlice(testVideos, ITEMS_BATCH_SIZE),
  images: mixAndSlice(testImages, ITEMS_BATCH_SIZE)
};

const galleryReadyEvent = new Event('galleryReady');

export function App() {
  const {setDimensions, styleParams, setItems, items, gallerySettings, setBlueprint, blueprint, dimensions, setShowSide} = useGalleryContext(blueprintsManager);
  
  const {showSide} = gallerySettings;

  // const [fullscreenIdx, setFullscreenIdx] = useState(-1);
  const {numberOfItems = 0, mediaType = 'mixed'} = gallerySettings || {};
  const isTestingEnv = isTestingEnvironment(window.location.search);

  const switchState = () => {
    setShowSide(!showSide);
  };

  const setGalleryReady = () => {
    window.dispatchEvent(galleryReadyEvent);
  }
  const eventListener = (eventName, eventData) => {
    switch (eventName) {
      case GALLERY_EVENTS.APP_LOADED:
        setGalleryReady();
        break;
      case GALLERY_EVENTS.GALLERY_CHANGE: //TODO split to an event named "PARTIALY_GROW_GALLERY_PRETTY_PLEASE"
        if(gallerySettings.useBlueprints && eventData.updatedHeight){
          setDimensions({height: eventData.updatedHeight});
        }
        break;
      case GALLERY_EVENTS.NEED_MORE_ITEMS:
        if(gallerySettings.useBlueprints){
          blueprintsManager.needMoreItems(eventData);
        } else {
          addItems();
        }
        break;
      case GALLERY_EVENTS.ITEM_ACTION_TRIGGERED:
        // setFullscreenIdx(eventData.idx);
        break;
      case GALLERY_EVENTS.LOAD_MORE_CLICKED:
        break;
      default:
        // console.log({eventName, eventData});
        break;
    }
  }

  const addItems = () => {
    const currentItems = getItems();
    if (!window.benchmarking && (!numberOfItems || currentItems.length < numberOfItems)) { //zero items means infinite
      const newItems = currentItems.concat(createItems());
      setItems(newItems);
      return newItems;
    }
  }

  const createItems = () => {
    return mixAndSlice((mediaType === 'images' ? testImages : mediaType === 'videos' ? testVideos : mediaType === 'texts' ? testTexts : testItems), numberOfItems || ITEMS_BATCH_SIZE);
  }

  const getItems = () => {

    // return initialItems.mixed.slice(0, 3);
    if (isTestingEnvironment(window.location.search)) {
      return monochromeImages.slice(0,20);
    }

    const theItems = items || initialItems[mediaType];
    if (numberOfItems > 0) {
      return theItems.slice(0, numberOfItems);
    } else {
      return theItems;
    }
  }
  
  const getTotalItemsCount = () => {
    return numberOfItems > 0 ? numberOfItems : Infinity
  }

  const getOrInitBlueprint = () => {
    if (blueprint) {
      return blueprint;
    } else {
      const playgroundBlueprintsApi = new BlueprintsApi({addItems, getItems, getContainer, getStyles, onBlueprintReady: setBlueprint, getTotalItemsCount});
      blueprintsManager.init({api: playgroundBlueprintsApi})
      blueprintsManager.createBlueprint({items: getItems(), styles: getStyles(), dimensions: getContainer(), totalItemsCount: getTotalItemsCount()}, true);
    }
  }

  const renderInfoElement = (type, pgItemProps) => {

    const infoElement = (<div className={'playground-info'}>
      <div className={'playground-info-title'}>
        <span>{pgItemProps.title}</span>
      </div>
      <div className={'playground-info-description'}>
        <span>{pgItemProps.description}</span>
      </div>
    </div>);

    const { titlePlacement } = pgItemProps.styleParams;

    switch (type) {
      case 'HOVER':
        if (GALLERY_CONSTS.hasHoverPlacement(titlePlacement)) {
          return infoElement;
        }
        break;
      case 'EXTERNAL':
        if (GALLERY_CONSTS.hasVerticalPlacement(titlePlacement) || GALLERY_CONSTS.hasHorizontalPlacement(titlePlacement)) {
          return infoElement;
        }
        break;
      case 'SLIDESHOW':
        return infoElement;
      default:
        return null;
    }
  };

  const hoverInfoElement = (pgItemProps) => {
    return renderInfoElement('HOVER', pgItemProps);
  };

  const externalInfoElement = (pgItemProps) => {
    return renderInfoElement('EXTERNAL', pgItemProps);
  };

  const slideshowInfoElement = (pgItemProps) => {
    return renderInfoElement('SLIDESHOW', pgItemProps);
  };

  const getExternalInfoRenderers = () => {
    return {
      customHoverRenderer: hoverInfoElement,
      customInfoRenderer: externalInfoElement,
      customSlideshowInfoRenderer: slideshowInfoElement,
    };
  }
  
  const getContainer = () => {
    return {scrollBase: 0, ...dimensions};
  }

  const getStyles = () => {
    return styleParams;
  }

  const canRender = ()=> {
    if (!gallerySettings.useBlueprints || blueprint) {
      return true;
    } else {
      return false;
    }
  }


  useEffect(() => {
    window.addEventListener('resize', setDimensions);
    return () => {
      window.removeEventListener('resize', setDimensions);
    };
  }, [setDimensions]);

  if (!isTestingEnv) { // isTestingEnvironment is not a valid style param and would be removed from the url if we use setStyleParamsInUrl. this removed this protection for testing environment as well
    setStyleParamsInUrl(styleParams);
  }

  const blueprintProps = gallerySettings.useBlueprints ? getOrInitBlueprint() : 
  { 
    items: getItems(),
    options: styleParams,
    container: getContainer() 
  };

  // console.log('Rendering App: ', {styleParams, items, dimensions, showSide, blueprint, blueprintProps})

  return (
    <main className={s.main}>
      {/* <Loader/> */}
      <SideBarButton className={s.toggleButton} onClick={switchState} isOpen={showSide} />
      <aside className={s.sideBar} style={{width: SIDEBAR_WIDTH, marginLeft: !showSide ? -1 * SIDEBAR_WIDTH : 0, display: showSide ? 'block' : 'none'}}>
        <div className={s.heading}>
          Pro Gallery Playground <a className={s.version} href="https://github.com/wix/pro-gallery/blob/master/CHANGELOG.md" target="blank" title="View Changelog on Github">v{pJson.version}</a>
        </div>
        {showSide && <Suspense fallback={<div>Loading...</div>}>
          <SideBar
            blueprintsManager = {blueprintsManager}
            items={getItems()}
          />
        </Suspense>}
      </aside>
      <section className={s.gallery} style={{paddingLeft: showSide ? SIDEBAR_WIDTH : 0}}>
        {!canRender() ? <div>Waiting for blueprint...</div> : <ExpandableProGallery
          key={`pro-gallery-${JSON.stringify(gallerySettings)}-${getItems()[0].itemId}`}
          domId={'pro-gallery-playground'}
          scrollingElement={window}
          viewMode={gallerySettings.viewMode}
          eventsListener={eventListener}
          totalItemsCount={getTotalItemsCount()}
          resizeMediaUrl={resizeMediaUrl}
          useBlueprints={gallerySettings.useBlueprints} //Todo - use it react way
          {...getExternalInfoRenderers()}
          {...blueprintProps}
        />}
      </section>
    </main>
  );
}
