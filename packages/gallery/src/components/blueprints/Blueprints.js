import { addPresetStyles } from '../gallery/presets/presets';
// import dimensionsHelper from '../helpers/dimensionsHelper';
import defaultStyles from '../../common/defaultStyles';
// import utils from '../../common/utils';
// import checkNewGalleryProps from '../helpers/isNew';
// import { ItemsHelper } from '../../helpers/itemsHelper';
// import window from '../../../common/window/windowWrapper';
// import { Layouter } from 'pro-layouts';
// import { cssScrollHelper } from '../../helpers/cssScrollHelper.js';
// import { createCssLayouts } from '../../helpers/cssLayoutsHelper.js';
// import { isEditMode, isSEOMode, isPreviewMode, isSiteMode } from '../../../common/window/viewModeWrapper';


export default class Blueprints {



  static createBlueprint({finalStylesStyles, container, items, watermarkData, options, styleParams, styles, domId = 'default-dom-id'}) {
    const _styles = { ...defaultStyles, ...options, ...styles, ...styleParams };
    let finalStyles, finalContainer, finalStructure, finalItems;
    finalStyles = addPresetStyles(_styles);
    const selectedLayoutVars = [
      'galleryLayout',
      'galleryThumbnailsAlignment',
      'magicLayoutSeed',
      'cubeType',
      'isVertical',
      'scrollDirection',
      'enableInfiniteScroll',
    ];
    finalStyles.selectedLayout = selectedLayoutVars
      .map(key => String(finalStyles[key]))
      .join('|');
      finalStyles.layoutsVersion = 2;


    return this.galleryBlueprint = {items: finalItems, styles: finalStyles, container: finalContainer, galleryStructure: finalStructure}
  }
    // dimensionsHelper.updateParams({
    //   domId: domId,
    //   container: container,
    //   styles: styles
    // });



    //---------------------- Finalize Styles -----------------------------//
    
      // TODO process styles

    //--------------------- Finalize container ------------------------------//
      


    //---------------------Finalize Items -----------------------------------------//





  //   //----------------------------- Create Structure --------------------------------------//

  //     // ------------ check what actually changed ----------------- //
  //   const isNew = checkNewGalleryProps(
  //     { items, styles, container, watermarkData, itemsDimensions },
  //     {...state, items: this.items},  // TODO - state and items are used as "old" (vs "new" )- need to replace with "this".
  //   );
  //     //------------- create the new structure based on changes -----------//
  //   reCreateGalleryExpensively(
  //     { items, styles, container, watermarkData, itemsDimensions, isNew},
  //     curState,
  //     ) {


  //     const state = curState || this.state || {};
  
  //     let _styles, _container;

  //     const newState = {};
  



  //       // ------- items-stuff ------------------//

  //     if (
  //       (isNew.itemsDimensions || isNew.itemsMetadata) &&
  //       !isNew.items &&
  //       !isNew.addedItems
  //     ) {
  //       //if only the items metadata has changed - use the modified items (probably with the measured width and height)
  //       this.items = this.items.map((item,index) =>
  //       {
  //         const metaData = Object.assign(
  //           {},
  //           items[index].metaData,
  //           );
  //         return Object.assign(item, {metaData}, { ...this.itemsDimensions[item.itemId] })
  //       }
  //       );
  //       newState.items = this.items.map(item => item.itemId);
  //     } else if (isNew.items && !isNew.addedItems) {
  //       this.items = items.map(item =>
  //         Object.assign(ItemsHelper.convertDtoToLayoutItem(item), {
  //           ...this.itemsDimensions[item.itemId],
  //         }),
  //       );
  //       newState.items = this.items.map(item => item.itemId);
  //       this.gettingMoreItems = false; //probably finished getting more items
  //     } else if (isNew.addedItems) {
  //       this.items = this.items.concat(
  //         items.slice(this.items.length).map(item => {
  //           return ItemsHelper.convertDtoToLayoutItem(item);
  //         }),
  //       );
  //       newState.items = this.items.map(item => item.itemId);
  //       this.gettingMoreItems = false; //probably finished getting more items
  //     }
  


  //       // ------- styles and container -stuff ------------------//




  //     if (isNew.styles || isNew.container) {
  //       styles = styles || state.styles;
  //       container = container || state.container;
  
  //       _styles = addLayoutStyles(styles);//process styles - should move up + remove the need for container
  //         dimensionsHelper.updateParams({
  //           _styles,
  //           container,
  //           domId: this.props.domId,
  //         });
  //       _container = Object.assign(
  //         {},
  //         container,
  //         dimensionsHelper.getGalleryDimensions(),
  //       );
  //       dimensionsHelper.updateParams({ container: _container }); //check wtf is this double update
  //       finalStyles = _styles;
  //       finalContainer = _container;
  //     } else {
  //       _styles = state.styles;
  //       _container = state.container;
  //     }







  //       // ------- creating a new structure ------------------//






  //     if (!this.galleryStructure || isNew.any) {

  //       const layoutParams = {
  //         items: this.items,
  //         container: _container,
  //         styleParams: _styles,
  //         gotScrollEvent: true,
  //         options: {
  //           showAllItems: true,
  //           skipVisibilitiesCalc: true,
  //           useLayoutStore: false,
  //         },
  //       };
  
  //       if (this.layouter && isNew.addedItems) {
  //         layoutParams.options.useExistingLayout = true;
  //       } else {
  //         layoutParams.options.createLayoutOnInit = false;
  //         this.layouter = new Layouter(layoutParams);
  //       }
  
  //       this.layout = this.layouter.createLayout(layoutParams);
  //       const itemConfig = {
  //         watermark: watermarkData,
  //         sharpParams: _styles.sharpParams,
  //         thumbnailSize: styles.thumbnailSize,
  //         resizeMediaUrl: this.props.resizeMediaUrl,
  //         lastVisibleItemIdx: this.lastVisibleItemIdx,
  //       };
  //       const existingLayout = this.galleryStructure || this.layout;
  //       if (isNew.addedItems) {
  //         this.galleryStructure = ItemsHelper.convertExistingStructureToGalleryItems(
  //           existingLayout,
  //           this.layout,
  //           itemConfig,
  //         );
  //       } else {
  //         this.galleryStructure = ItemsHelper.convertToGalleryItems(
  //           this.layout,
  //           itemConfig,
  //           existingLayout.galleryItems,
  //         );
  //       }

  //       if (isNew.items) {
  //         this.loadItemsDimensionsIfNeeded();
  //       }
  
  //       const isApproximateWidth = dimensionsHelper.isUnknownWidth() && !_styles.oneRow; //FAKE SSR
  //       this.createCssLayoutsIfNeeded(layoutParams, isApproximateWidth, isNew);
  
  //       const allowPreloading =
  //         isEditMode() ||
  //         state.gotFirstScrollEvent ||
  //         state.showMoreClickedAtLeastOnce;
  
  //       this.scrollCss = this.getScrollCssIfNeeded({
  //         domId: this.props.domId,
  //         items: this.galleryStructure.galleryItems,
  //         styleParams: _styles,
  //         allowPreloading,
  //       });
  //     }

  
  //     if (isNew.any) {
  //       this.galleryBlueprint = {items: finalItems, styleParams: finalStyles, container: finalContainer, galleryStructure: finalStructure}

  //     }
  //   }
  
  
  // createCssLayoutsIfNeeded(layoutParams, isApproximateWidth = false) {
  //   this.layoutCss = createCssLayouts({
  //     layoutParams,
  //     isApproximateWidth,
  //     isMobile: utils.isMobile(),
  //     domId: this.props.domId,
  //     galleryItems: isApproximateWidth? null : this.galleryStructure.galleryItems,
  //   });
  // }


  // getGalleryBlueprint() {
  //   return this.galleryBlueprint;
  // }




}
