import blueprints from './Blueprints'
import EVENTS from '../../common/constants/events';

class BlueprintsManager {

  constructor() {
    // this.eventsCB = config && config.eventsCB;
    this.lastParams = {};
    this.existingBlueprint = {};
    this.cache = {};
    this.totalItemsCount = Infinity;
    this.rerenderWithNewBlueprintCB = (() => {});
  }

  updateConfig(config) {
    this.lastParams = config && config.lastParams || this.lastParams;
    this.existingBlueprint = config && config.existingBlueprint || this.existingBlueprint;
    this.rerenderWithNewBlueprintCB = config && config.rerenderWithNewBlueprintCB || this.rerenderWithNewBlueprintCB;
    this.api = config && config.api || this.api || {};
    this.totalItemsCount = config && config.totalItemsCount || this.totalItemsCount;
  }

  getOrCreateBlueprint(params) {
        // cacheBlocker
        // if (this.cache[params]) return this.cache[params];
    const eventsListener = (...args) => this.eventsListenerWrapper(params.eventsListener, args);
    this.totalItemsCount = params.totalItemsCount;
    params =  {...params,...this.completeParams(params)}
    const lastparams = this.lastParams;
    const existingBlueprint = this.existingBlueprint;

    return this.cache[params] = this.existingBlueprint = {eventsListener, ...blueprints.createBlueprint(params, lastparams, existingBlueprint)};
  }



  getMoreItems(currentItemLength) {
    // let eventHandledInternaly = false;
    // let items;
    if (currentItemLength < this.totalItemsCount) {
      // this.gettingMoreItems = true;
      const {eventHandledInternaly, items} = this.api.getMoreItems(currentItemLength);
      
      if (items) {
        //work with the new items...
      }
      return eventHandledInternaly;
    } else if (this.existingBlueprint.styles.slideshowLoop) {
      this.duplicateGalleryItems();
      const eventHandledInternaly = true;
      return eventHandledInternaly;
    }

  }

  duplicateGalleryItems() {
      //TODO  -- TBD...(playgrounds doesnt use this anyways)
      // this.items = this.items.concat(
      //   ...this.items.slice(0, this.props.totalItemsCount),
      // )
  }




    // ------------------ Get all the needed raw data ---------------------------- //
    completeParams(params) {
      
    let {dimensions, container, items, styles, styleParams, options, domId} = params || {};

    styles = {...options, ...styles, ...styleParams };
    dimensions = {...dimensions, ...container}
    dimensions =  this.fetchDimensionsIfNeeded(dimensions);
    items =  this.fetchItemsIfNeeded(items);
    styles =  this.fetchStylesIfNeeded(styles); //can be async... TODO

    return {dimensions, items, styles, domId} 
  }
  
  
  fetchDimensionsIfNeeded(dimensions) {

    const shouldFetchDimensions = (dimensions) => {
      let should = true;
      if(dimensions) {
        should = false
      } 
      
      return should;
    }
    
    if (shouldFetchDimensions(dimensions)) {
      //dimensions = {yonatanFakeDimensions: true, width: "", height: ""} // TODO - is there something here???
    }
    
    return dimensions;
  }
  
  fetchItemsIfNeeded(items) {
    
    const shouldFetchItems = (items) => {
      let should = true;
      if(items) {
        should = false
      }
      
      return should;
    }

    if (shouldFetchItems(items)) {
      //items = ['yonatan - fake items'] // getGalleryDataFromServer(); - worker code to be used here.
    }

    // TODO - this.loadItemsDimensionsIfNeeded();

    return items;
  }

  fetchStylesIfNeeded(styles) {

    const shouldFetchStyles = (styles) => {
      let should = true;
      if(styles) { //TODO - should check if they are ready styles and use ClientLib if not?
        should = false
      }

      return should;
    }

    if (shouldFetchStyles(styles)) {
      //styles = ['yonatan - fake styles'] // get styles - from SA ; - worker code to be used here.
    }

    return styles;
  }


  updateLastParamsIfNeeded(params) {
    if(this.thingsChanged){
      this.lastParams = params;
    }
  }

  eventsListenerWrapper(eventsListenerFunc, originalArgs) {
    const eventHandledInternaly = this.internalEventHandler(...originalArgs)
    !eventHandledInternaly && eventsListenerFunc(...originalArgs);
  }


  internalEventHandler(eventName, eventData, event) {
    let eventHandledInternaly = false;
    switch (eventName) {
      // case EVENTS.LOAD_MORE_CLICKED:
      //   this.galleryWrapper.loadMoreClicked = true;
      //   break;
      // case EVENTS.GALLERY_CHANGE:
      //   this.onGalleryChangeEvent();
      //   this.galleryWrapper.siteHelper.handleNewGalleryStructure(eventData);
      //   break;
      case EVENTS.NEED_MORE_ITEMS:
        const currentItemLength = eventData;
        eventHandledInternaly = this.getMoreItems(currentItemLength);
        break;
      default:
    }
    return eventHandledInternaly;
  }
}

const blueprintsManager = new BlueprintsManager();
export default blueprintsManager;