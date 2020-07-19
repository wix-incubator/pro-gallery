## [v2.0.24](https://pro-gallery-2-0-24.surge.sh) (19/07/2020)
 
#### GALLERY
 -  export blueprints in the lib

#### OTHER
 - This reverts commit b6793154ae8079e0e1e9388340ed014d6296dd52.

---
## [v2.0.23](https://pro-gallery-2-0-23.surge.sh) (16/07/2020)
 
#### GALLERY
 -  SSR improve: item dimension

---
## [v2.0.22](https://pro-gallery-2-0-22.surge.sh) (16/07/2020)
 
#### GALLERY
 -  export blueprints in the lib
 
---
## [v2.0.21](https://pro-gallery-2-0-21.surge.sh) (16/07/2020)
 
 -  blueprint manager is no longer a singleton
 - reverted "changed pro-gallery/lib to be only ESM."

---
## [v2.0.20](https://pro-gallery-2-0-20.surge.sh) (15/07/2020)
 
#### GALLERY
 -  changed pro-gallery/lib to be only ESM.

---
## [v2.0.19](https://pro-gallery-2-0-19.surge.sh) (15/07/2020)
 
#### GALLERY
 -  render videoItemPlaceholder in videoItem
 -  LeanGallery supported in Ssr

---
## [v2.0.18](https://pro-gallery-2-0-18.surge.sh) (15/07/2020)

#### GALLERY
 -  SSR refactor

---
## [v2.0.17](https://pro-gallery-2-0-17.surge.sh) (14/07/2020)
 
#### GALLERY
 -  fix: gallery is not visible when only first item is in view

---
## [v2.0.16](https://pro-gallery-2-0-16.surge.sh) (13/07/2020)
 
#### GALLERY
 -  fix (itemView): avoid inline styles in non-blueprints flow

---
## [v2.0.15](https://pro-gallery-2-0-15.surge.sh) (13/07/2020)
 
#### GALLERY
 -  fix (galleryContainerNew): use layoutCss in non-blueprints flow

---
## [v2.0.14](https://pro-gallery-2-0-14.surge.sh) (13/07/2020)
 
#### GALLERY
 -  remove inline styles tags

---
## [v2.0.13](https://pro-gallery-2-0-13.surge.sh) (13/07/2020)
 
#### GALLERY
 -  fix (slideshowView): fix isLastItem and isScrollEnd for infiniteScroll galleries

#### PLAYGROUND
 -  connect blueprints

---
## [v2.0.12](https://pro-gallery-2-0-12.surge.sh) (12/07/2020)
 
#### GALLERY
 -  fix leanGallery broken styleParams
 -  fix leanGallery isEligible reasons
 -  update getVisibleItems in containerExtraNew

#### PLAYGROUND
 -  improve: add viewMode settings to the simulators tab

---
## [v2.0.11](https://pro-gallery-2-0-11.surge.sh) (05/07/2020)
 
#### GALLERY
 -  fix: (containerNew) getVisibleItems - dont render less then 2 items

---ונת
## [v2.0.10](https://pro-gallery-2-0-10.surge.sh) (05/07/2020)
 
#### GALLERY
 -  set gotFirstScrollEvent on horizontal scroll in oneRow gallery

---
## [v2.0.9](https://pro-gallery-2-0-9.surge.sh) (02/07/2020)
 
#### GALLERY
 -  bug fix (ContainerNew) getMoreItems on didMount
 -  REVERT: changed pro-gallery/lib to be only ESM.

---
## [v2.0.8](https://pro-gallery-2-0-8.surge.sh) (01/07/2020)
 
#### GALLERY
 -  changed pro-gallery/lib to be only ESM.

---
## [v2.0.7](https://pro-gallery-2-0-7.surge.sh) (01/07/2020)
 
#### GALLERY
 -  **** Removed all info from the gallery ****

---
## [v2.0.6](https://pro-gallery-2-0-6.surge.sh) (01/07/2020)
 
#### GALLERY
 -  fix: getVisibleItems only in viewMode site

---
## [v2.0.5](https://pro-gallery-2-0-5.surge.sh) (30/06/2020)
 
#### GALLERY
 -  ItemView: Add setState with setTimeout for text line fixer
 -  improve: removed unused cod

---
## [v2.0.4](https://pro-gallery-2-0-4.surge.sh) (30/06/2020)
 
#### GALLERY
 -  Fix (galleryContainer): fix visibleItems calc for galleries with infinite scroll
 -  ItemView: removed onMouseOver onMouseOut attrs from externalInfo (they are already on the whole item-container).
 -  Performence: Remove loaded and displayed states from ItemView
 -  Improve (galleryContainerNew): getVisibleItems

#### OTHER
 - * Upgrade pro-gallery
 - * Fix import from pro-gallery
 - * Fix missing style loaders on external sources

---
## [v2.0.2](https://pro-gallery-2-0-2.surge.sh) (25/06/2020)
 
#### PLAYGROUND
 -  Move antd css import from main entry point to side bar component

#### GALLERY
 -  reactDriver add getVisibleItems
 -  (performance) render only visibleItems on first render
 -  Removed some unused code 
 -  (isNew.js) use Object.entries
 -  galleryContainer remove reCreateGalleryExpensively on didMount

---
## [v2.0.1](https://pro-gallery-2-0-1.surge.sh) (23/06/2020)
 
#### PLAYGROUND
 - * improve: Lazy load side bar

#### GALLERY
 -  (isNew.js) fix stylesHaveChanged

---
## [v2.0.0](https://pro-gallery-2-0-0.surge.sh) (22/06/2020)
 
#### GALLERY
 improve (calcVisibilities): remove deprecated calcVisibilities

#### PLAYGROUND
 -  improve (sidebar): lazy load the sidebar code

---
## [v1.10.23](https://pro-gallery-1-10-23.surge.sh) (22/06/2020)
 
#### GALLERY
 -  changed leanGallery css from cssModule to global static.
 
## [v1.10.22](https://pro-gallery-1-10-22.surge.sh) (14/06/2020)
 
#### GALLERY
 -  fixed slideshow info structure (with/out customSlideshowInfoRenderer)
 
---
## [v1.10.21](https://pro-gallery-1-10-21.surge.sh) (08/06/2020)
 
#### GALLERY
 -  dummy commit

--
## [v1.10.20](https://pro-gallery-1-10-20.surge.sh) (08/06/2020)
 
#### GALLERY
 -  fixed item-wrapper div container styles.

---
## [v1.10.19](https://pro-gallery-1-10-19.surge.sh) (03/06/2020)

---
## [v1.10.18](https://pro-gallery-1-10-18.surge.sh) (03/06/2020)
 
#### LAYOUTS
 -  Fix: fix support for min / max cubeType

---
## [v1.10.17](https://pro-gallery-1-10-17.surge.sh) (28/05/2020)
 
#### LAYOUTS
 -  Improve (cubeType): add min/max cubeTypes to limit images height

#### GALLERY
 -  fix (imageItem.js): added data-hook for img tags

#### MAIN
 -  improve (playground): add meta tags

---
## [v1.10.16](https://pro-gallery-1-10-16.surge.sh) (25/05/2020)
 
#### GALLERY
 -  fix: hover padding in slider.
 -  improve: use native lazyLoad when supported

#### MAIN
 -  improve (package.json): release exact dependencies version

---
## [v1.10.14](https://pro-gallery-1-10-14.surge.sh) (18/05/2020)
 
#### MAIN
 -  improve: add a repository field in package.json

---
## [v1.10.13](https://pro-gallery-1-10-13.surge.sh) (18/05/2020)
 
#### LAYOUTS
 -  Revert bad commit: improve (calcVisibilities): remove deprecated calcVisibilities

---
## [v1.10.12](https://pro-gallery-1-10-12.surge.sh) (14/05/2020)
 
#### GALLERY
 -  Fix (rtl): explicitly set ltr direction when not rtl
 -  Fix (social): stoppropagation off text download keypress not to trigger item navigation
 -  Improve (itemView): render Hover element only when needed
 -  Fix (social): stoppropagation off text download clicks not to trigger item navigation
 -  Fix (galleryContainerNew): Scrollbase use in getMoreItems
 -  Improve (itemView): render Hover element only when needed
 -  Fix (itemView): fix unrendered hover when hoveringBehaviour is not APPEARS
 -  Fix (itemView): fix unrendered hover when hoveringBehaviour is not APPEARS
 -  Improve (itemView): render Hover element only when needed
 -  Improve (leanGallery): use customInfoRenderer

#### LAYOUTS
 -  fix (calcVisibilities): remove test
 -  fix (useExistingLayout): fix stripIdx initial number (used for random seed of group type)
 -  improve (calcVisibilities): remove deprecated calcVisibilities

#### PLAYGROUND
 -  removed unused var

#### OTHER
 - This reverts commit 23d01b48d8da98745418d4044f0992b85e9b16f3.
 - This reverts commit 0fa7be33c870cbd7d66c9d5a0c1046fb81dfd28f.
 - Merge branch 'master' of github.com:wix/pro-gallery

#### MAIN
 -  fix (travis): publish when branch name is tagged

---
## [v1.10.11](https://pro-gallery-1-10-11.surge.sh) (11/05/2020)
 
#### GALLERY
 - Small fix for square items (isVertical)
 - Hover css prep for info-elements -> if an element inside the external info will have 'info-member' className, hover effects will affect it as well.

---
## [v1.10.10](https://pro-gallery-1-10-10.surge.sh) (07/05/2020)
 
#### GALLERY
 -  Fix (leanGallery): use props eventsListener
 -  Improve (index): export leanGallery and isEligible
 -  Feat (videoItem): loaded videos will no longer have a poster background. background was visible when video AR was different from the item's

#### OTHER
 - Merge branch 'master' of github.com:wix/pro-gallery

---
## [v1.10.9](https://pro-gallery-1-10-9.surge.sh) (03/05/2020)

#### GALLERY
 - Fixed: protect conversion to GalleryItems in cases there is no last group

---
## [v1.10.8](https://pro-gallery-1-10-8.surge.sh) (03/05/2020)
 
#### GALLERY
 - Refactor: onItemClick not sends the event in the eventsListener
 - Refactor: small refactor to customRenderers + providing isMobile to customRenderers.

---
## [v1.10.7](https://pro-gallery-1-10-7.surge.sh) (30/04/2020)
 
#### GALLERY
 - Feature: NEED_MORE_ITEMS padding only after initial scroll
 - Feature: added support of customSlideshowInfoRenderer if provided, passing itemContainer to custom renderers
 - Fix: fixed gallery-item-hover-inner height (css)
 - Fix: fixed slideshow slide counter counted over the total with loop
 - Fix: Lean Gallery: fix broken inner style function + minor fixes

---
## [v1.10.6](https://pro-gallery-1-10-6.surge.sh) (23/04/2020)
 
#### GALLERY
 -  fix (scrollHelper):scroll after reaplying snap - safari
---
## [v1.10.5](https://pro-gallery-1-10-5.surge.sh) (22/04/2020)
 
#### GALLERY
 -  Fix - Revmoved scroll-snap for the scroll animation duration. (chrome 81 changes to scroll-snap)

---
## [v1.10.4](https://pro-gallery-1-10-4.surge.sh) (21/04/2020)
 
#### GALLERY
 - Added addLayoutStyles to pro-gallery exports.
 - GALLERY_CONSTS: placements helper functions will be exported as well in GALLERY_CONSTS

---
## [v1.10.3](https://pro-gallery-1-10-3.surge.sh) (19/04/2020)מ
 
#### GALLERY
 -  Remove console log

---
## [v1.10.2](https://pro-gallery-1-10-2.surge.sh) (19/04/2020)
 
#### GALLERY
 -  Fix: use custom posters in videoPlaceholders

---
## [v1.10.1](https://pro-gallery-1-10-1.surge.sh) (19/04/2020)
 
#### GALLERY
 - Fix: package.json: updated published files.

---
## [v1.10.0](https://pro-gallery-1-10-0.surge.sh) (19/04/2020)
 
#### GALLERY
 - Refactor: changed pro-gallery exports.

---
## [v1.9.4](https://pro-gallery-1-9-4.surge.sh) (16/04/2020)
 
#### GALLERY
 -  Fix: add protection for hls in iOS

---
## [v1.9.3](https://pro-gallery-1-9-3.surge.sh) (13/04/2020)
 
#### GALLERY
 -  New feature - items have changed if one of the item types have changed

---
## [v1.9.2](https://pro-gallery-1-9-2.surge.sh) (13/04/2020)
 
#### GALLERY
 -  Added video placeholder item option - metaData.isVideoPlaceholder

---
## [v1.9.1](https://pro-gallery-1-9-1.surge.sh) (13/04/2020)
 
#### PLAYGROUND
 -  Fix: missing rotatingCropRatios isRelevant

---
## [v1.9.0](https://pro-gallery-1-9-0.surge.sh) (07/04/2020)
 
#### GALLERY
 -  Feature: enable multiple title placements

---
## [v1.8.13](https://pro-gallery-1-8-13.surge.sh) (06/04/2020)
 
#### GALLERY
 -  Fix: missing items in horizontal layouts (Grid and Masonry)

---
## [v1.8.12](https://pro-gallery-1-8-12.surge.sh) (06/04/2020)
 
#### GALLERY
 -  Allow all videos to have _placeholder and register in the video list.

---
## [v1.8.11](https://pro-gallery-1-8-11.surge.sh) (05/04/2020)
 
#### GALLERY
 -  Add support for HLS redirect url (or plain .m3u8) videoUrl for video items 

---
## [v1.8.10](https://pro-gallery-1-8-10.surge.sh) (29/03/2020)
 
#### GALLERY
 -  Feat: add data-cancel-link on fake navigation expand mode share links

---
## [v1.8.9](https://pro-gallery-1-8-9.surge.sh) (25/03/2020)
 
#### GALLERY
 -  Fix: fix pro-gallery-margin-container width to accomodate for imageMargin

---
## [v1.8.8](https://pro-gallery-1-8-8.surge.sh) (24/03/2020)
 
#### GALLERY
 -  Fix: use galleryWidth in video visibility calc

---
## [v1.8.7](https://pro-gallery-1-8-7.surge.sh) (24/03/2020)
 
#### GALLERY
 -  Fix: no arrows in horizontal Magic layout

---
## [v1.8.6](https://pro-gallery-1-8-6.surge.sh) (24/03/2020)
 
#### GALLERY
 -  Feat: remove legacy js visible prop(layouts groups) from item rendering logic

---
## [v1.8.5](https://pro-gallery-1-8-5.surge.sh) (23/03/2020)
 
#### GALLERY
 -  Improve: use single source videoPlaceholder.

---
## [v1.8.4](https://pro-gallery-1-8-4.surge.sh) (22/03/2020)
 
#### MAIN
 -  update changelog.md

#### GALLERY
 -  Gallery region label can now be passed via 'proGalleryRegionLabel' prop to PG.
 -  Feat: domId is now the only Id (no galleryId no galleryDomId)
 -  itemView: pass additional prop to ItemHover
 -  itemView: removed unused functions: openItemShopInFullScreen, toggleFullscreenIfNeeded -> Social is not using 'openItemShopInFullScreen' action.
 -  itemView: pass additional prop to ItemHover
 -  Fix: fix for gridFit and rtl
 -  social: 'text-external-item' will be set also for titlePlacement===SHOW_ON_THE_RIGHT or titlePlacement===SHOW_ON_THE_LEFT


#### PLAYGROUND
 -  improve (sidebar): add localhost links

#### LAYOUTS
 -  fix (layouter): fix left for sidebyside layouts


---
## [v1.8.3](https://pro-gallery-1-8-3.surge.sh) (15/03/2020)
 
#### GALLERY
 -  SEO url -> we will replace webp with the original file type and not with jpg.

#### PLAYGROUND
 -  fix: fix issue with broken gallerySize

---
## [v1.8.2](https://pro-gallery-1-8-2.surge.sh) (09/03/2020)
 
#### GALLERY
 -  Fixed creation of customEvent for IE.

---
## [v1.8.1](https://pro-gallery-1-8-1.surge.sh) (09/03/2020)
 
#### GALLERY
 -  Removed 'on_mouse_over' customEvent as not in use. Fixed 'current_hover_change' customEvent to be created with new customEvent logic.

---
## [v1.8.0](https://pro-gallery-1-8-0.surge.sh) (08/03/2020)
 
#### GALLERY
 -  feature: add support for textBoxWidthPercent:
      calculateTextBoxWidthMode SP: PERCENT / MANUAL
      textBoxWidth SP: when MANUAL
      textBoxWidthPercent SP: when PERCENT

#### LAYOUTS
 - fixed columns width calculation (when columns don’t devide equally)
 - fix groups left calc for dynamic columns

---
## [v1.7.25](https://pro-gallery-1-7-25.surge.sh) (04/03/2020)
 
#### GALLERY
 - Add clickTarget to EVENTS.ITEM_CLICKED eventData (options: 'item-media', 'item-info', 'item-container')

---
## [v1.7.24](https://pro-gallery-1-7-24.surge.sh) (03/03/2020)
 
#### GALLERY
 -  Fixed classNames in horizontal galleries.
 -  Changed console.warn to console.log when local

---
## [v1.7.23](https://pro-gallery-1-7-23.surge.sh) (25/02/2020)
 
#### GALLERY
 -  Fixed hoveringBehaviour logic
 -  Let videos with no link lay on click when the gallery is a link opens

---
## [v1.7.22](https://pro-gallery-1-7-22.surge.sh) (25/02/2020)
 
#### GALLERY
 -  Fixed support of no media url when titlePlacement === 'SHOW_ON_HOVER'
 -  Items with link wont play videos on click 

---
## [v1.7.21](https://pro-gallery-1-7-21.surge.sh) (23/02/2020)

#### GALLERY
 -  Fixed lineHeightFixer for title placement SHOW_ON_THE_RIGHT and SHOW_ON_THE_LEFT
 -  Feat: allow deepLinks on items for expand mode

---
## [v1.7.20](https://pro-gallery-1-7-20.surge.sh) (21/02/2020)
 
#### GALLERY
 - If there is no media url the infoElement (ifExists, not on hover) will grow to the whole item size.

---
## [v1.7.19](https://pro-gallery-1-7-19.surge.sh) (20/02/2020)
 
#### GALLERY
 -  Implemented titlePlacement SHOW_ON_THE_RIGHT, SHOW_ON_THE_LEFT
 -  Improve: settings for titlePlacement and textBoxHeight


#### PLAYGROUND
 -  improve: addPresetStyles to all styles

#### MAIN
 -  fix: remove wix-incubator references

---
## [v1.7.18](https://pro-gallery-1-7-18.surge.sh) (18/02/2020)
 
#### GALLERY
 -  Deeplinks removed from items.

---
## [v1.7.17](https://pro-gallery-1-7-17.surge.sh) (18/02/2020)
 
#### GALLERY
 -  Deeplinks on items -  only in SEO

---
## [v1.7.16](https://pro-gallery-1-7-16.surge.sh) (16/02/2020)
 
#### GALLERY
 -  Add sharing links on items
 -  Removed iOS download block
 -  Improve: add option for native image lazy load

---
## [v1.7.15](https://pro-gallery-1-7-15.surge.sh) (13/02/2020)
 
#### GALLERY
 -  Added dumpCache for utils when view mode or formFactor is set.
 -  Fixed loadMoreAmount condition.

#### PLAYGROUND
 -  improve (codePanel): add css to generated code

#### OTHER
 -  removed isLocal from isDev. allow local testing with no dev log.

---
## [v1.7.14](https://pro-gallery-1-7-14.surge.sh) (04/02/2020)
 
#### GALLERY
 -  Fix: fix mixup between columns and fullsize presets

---
## [v1.7.13](https://pro-gallery-1-7-13.surge.sh) (03/02/2020)
 
#### GALLERY
 -  Fix: fixed wrong gallerySize in masonry layout

---
## [v1.7.12](https://pro-gallery-1-7-12.surge.sh) (03/02/2020)
 
#### GALLERY
 -  do not use dom height when avoidSelfMeasure

---
## [v1.7.11](https://pro-gallery-1-7-11.surge.sh) (03/02/2020)
 
#### GALLERY
 -  improve (presets): create exported addPresetStyles method

---
## [v1.7.10](https://pro-gallery-1-7-10.surge.sh) (02/02/2020)
 
#### GALLERY
 -  Fix: use inherit instead of visible (allows setting visibility from parent)
 -  Fix: use constant default domId to prevent change between renders (might effect on several galleries in the same page)
 -  Improve: make domId required in propTypes
 -  Force scroll direction on all solid direction layouts

---
## [v1.7.9](https://pro-gallery-1-7-9.surge.sh) (30/01/2020)
 
#### GALLERY
 -  fix masonry to always vertical scrollDirection

---
## [v1.7.8](https://pro-gallery-1-7-8.surge.sh) (29/01/2020)
 
#### GALLERY
 -  Fix (dimensionHelper): set scrollBase to container in calcScrollBase
 -  Change height calc for titles in SSR

---
## [v1.7.7](https://pro-gallery-1-7-7.surge.sh) (28/01/2020)
 
#### GALLERY
 -  Fixed images alignment bug in grid layout.
 -  Fix (leanGallery): fix liveHeightFixer in leanGallery
 -  Improve (leanGallery): fix isEligible for no title and no description

---
## [v1.7.6](https://pro-gallery-1-7-6.surge.sh) (27/01/2020)
 
#### GALLERY
 -  In slideshow, only the itemInner will be wrapped with <a>, and not the whole item-container.
 -  Group navigation for collage horizontal and improvements to arrows.

---
## [v1.7.5](https://pro-gallery-1-7-5.surge.sh) (27/01/2020)
 
#### GALLERY
 -  change download elements to div

---
## [v1.7.4](https://pro-gallery-1-7-4.surge.sh) (26/01/2020)
 
#### GALLERY
 -  Fixes totitlePlacement/hoveringBehaviour.

---
## [v1.7.3](https://pro-gallery-1-7-3.surge.sh) (22/01/2020)
 
#### GALLERY
 -  Accessibility fix loveButton label, role, and checked/unchecked
 -  Added formFactor prop ("mobile"/"desktop"/"tablet"). Will be used as one of the ways to know if the gallery is displayed on mobile.

#### MAIN
 -  fix (deployToSurge): fix version specifc deploy

---
## [v1.7.2](https://pro-gallery-1-7-2.surge.sh) (22/01/2020)
 
#### GALLERY
 -  fix padding issue: fixed padding bottom in texts when not needed (thumbnails, slider and slideshow layouts)
 -  fix Accessibility issue for vertical galleries: keyboard arrows navigation: if load more button is on, cannot navigate to items that are hidden below it

---
## [v1.7.1](https://pro-gallery-1-7-1.surge.sh) (21/01/2020)
 
#### GALLERY
 -  improve (leanGallery): expand leanGallery coverage

---
## [v1.7.0](https://pro-gallery-1-7-0.surge.sh) (21/01/2020)
 
#### GALLERY
 -  titlePlacement/hoveringBehaviour options: separated info/hover behaviours:
      * titlePlacement no longer supports 'SHOW_NOT_ON_HOVER': use option - hoveringBehaviour = 'DISAPPEAR'
      * titlePlacement no longer supports 'SHOW_ALWAYS': use option - hoveringBehaviour = 'NO_CHANGE'
      * titlePlacement no longer supports 'DONT_SHOW': use option - hoveringBehaviour = 'NEVER_SHOW'

---
## [v1.6.12](https://pro-gallery-1-6-12.surge.sh) (19/01/2020)
 
#### GALLERY
 -  remove arrows from first and last items

---
## [v1.6.11](https://pro-gallery-1-6-11.surge.sh) (19/01/2020)
 
#### GALLERY
 -  fix: items will be clickable when itemClick is link and there is a dynamic link on those items.

---
## [v1.6.10](https://pro-gallery-1-6-10.surge.sh) (16/01/2020)
 
#### GALLERY
 -  fixed EVENTS.NEED_MORE_ITEMS not beeing dispatched for some galleries.

---
## [v1.6.9](https://pro-gallery-1-6-9.surge.sh) (14/01/2020)

#### GALLERY
 -  fixed mix/alternate layouts mixup
 -  a click on a video item will be processed only if itemClick === 'nothing'.

---
## [v1.6.8](https://pro-gallery-1-6-8.surge.sh) (12/01/2020)
 
#### GALLERY
 - send scroll events only on relevant scroll

---
## [v1.6.7](https://pro-gallery-1-6-7.surge.sh) (12/01/2020)
 
#### GALLERY
 -  fixed an issue where alternate and mix presets mixed up and alternated

---
## [v1.6.6](https://pro-gallery-1-6-6.surge.sh) (08/01/2020)
 
#### GALLERY
 -  improve: moved layoutHelper.js layout styles to presets
 -  fix (itemView): clearTimeout on unmount to prevent state update
 -  fix (videoScrollHelper): protect access to item.metaData.videoUrl
 -  improve (cssScroll): use react dangerouslySetHTML for styles
 -  improve (isEligible): allow undefined values in leanGallery params

---
## [v1.6.5](https://pro-gallery-1-6-5.surge.sh) (30/12/2019)
 
#### GALLERY
 -  slideshowView className will always contain 'pro-gallery-parent-container' and more if needed 
 -  remove unnecessary import

---
## [v1.6.4](https://pro-gallery-1-6-4.surge.sh) (25/12/2019)
 
#### GALLERY
 -  fix (defaultStyles): add one place for default styles and pass it to the gallery
 -  fix (slideshowView): remove event listeners on unmount

---
## [v1.6.3](https://pro-gallery-1-6-3.surge.sh) (24/12/2019)
 
#### GALLERY
 -  New merged settings endpoint with the old settings
 -  Use different componenets for different presets
 -  Added leanGallery for eligable galleries
 -  AutoSlideshow always play in preview mode, never in editor mode
 -  Do not create Hover element unless needed

---
## [v1.6.2](https://pro-gallery-1-6-2.surge.sh) (19/12/2019)
 
#### GALLERY
 -  fix (leanGallery): fix isEligible and responsive

---
## [v1.6.1](https://pro-gallery-1-6-1.surge.sh) (18/12/2019)
 
#### GALLERY
 -  added showVideoPlayButton styleParam

---
## [v1.6.0](https://pro-gallery-1-6-0.surge.sh) (17/12/2019)
 
#### GALLERY
 -  improve (hidePlay): fetch hidePlay prop from styleParams
 -  feature (leanGallery): render a css grid lean gallery when possible

---
## [v1.5.50](https://pro-gallery-1-5-50.surge.sh) (17/12/2019)

#### MAIN
 -  fix (tests): use image compare with larger threshold

---
## [v1.5.49](https://pro-gallery-1-5-49.surge.sh) (17/12/2019)
 
#### GALLERY
Added MAIN_COLOR to imageLoading options (SP imageLoadingMode and imageLoaindWithColorMode)

---
## [v1.5.48](https://pro-gallery-1-5-48.surge.sh) (05/12/2019)
 
#### GALLERY
 -  fix (galleryContainer): always emit events

---
## [v1.5.47](https://pro-gallery-1-5-47.surge.sh) (04/12/2019)
 `
#### OTHER
 - dummy commit.

---
## [v1.5.46](https://pro-gallery-1-5-46.surge.sh) (04/12/2019)
 
#### GALLERY
 -  fixed clicking on item behaviour when itemClick is LINK.

---
## [v1.5.44](https://pro-gallery-1-5-44.surge.sh) (03/12/2019)
 
#### GALLERY
 -  added try-catch with console.error to scrollToItem.
 -  fixed gallery-items keyboard navigation when onItemClick===link, fixed enter press on gallery-item with direct link.
 -  fix groupView for dummyItems

---
## [v1.5.43](https://pro-gallery-1-5-43.surge.sh) (01/12/2019)
 
#### GALLERY
 -  improve: add customLoadMoreRenderer

---
## [v1.5.42](https://pro-gallery-1-5-42.surge.sh) (28/11/2019)

#### GALLERY
 -  improve: remove comments from events constants
 -  fix (videos): allow for autoplay in mobile

---
## [v1.5.41](https://pro-gallery-1-5-41.surge.sh) (26/11/2019)
 
#### GALLERY
 -  fixed animations when itemBorderRadius is not 0: itemBorderRadius will be passed to item component (image/video/text) and to hover component
 -  fixed gallery consts export
 -  remove 'current_hover_change' eventListener on unmount.
 -  manually play videos when needed (required for safari)

---
## [v1.5.40](https://pro-gallery-1-5-40.surge.sh) (24/11/2019)
 
#### GALLERY
 -  fixed overlay animations on hover (issue when border-radius is not 0px)

---
## [v1.5.39](https://pro-gallery-1-5-39.surge.sh) (24/11/2019)
 
#### GALLERY
 -  fix (withFullscreen): fix imports paths
 -  improve: export ExpandableProGallery from index
 -  improve: move settings to gallery/src
 -  improve: allow openning fullscreen with currentIdx
 -  use real thumbnailSize for thumbnails
 -  enable collage horizontal navigation - fix for last version regression
 
---
## [v1.5.38](https://pro-gallery-1-5-38.surge.sh) (17/11/2019)
 
 no changes.
 
---
## [v1.5.37](https://pro-gallery-1-5-37.surge.sh) (17/11/2019)
 
#### GALLERY
 - improve (dimensions->scrollBase): pro-gallery will self calculate scrollBase if was not provided from a wrapper and NOT 'avoidGallerySelfMeasure'. 'externalScrollBase' can be provided to pro-gallery.

---
## [v1.5.36](https://pro-gallery-1-5-36.surge.sh) (17/11/2019)
 
#### MAIN
 -  fix: error messages on scripts

---
## [v1.5.33](https://pro-gallery-1-5-33.surge.sh) (15/11/2019)
 
#### GALLERY
 -  improve (tests): reorganize tests folders
 -  improve: scroll to currentIdx on gallery load if defined
 -  fix: add polyfill for Object.values
 -  improve: add ExpandableProGallery component
 -  fix (slideshowView): add restriction to nextItem > 0
 -  fix (slideshowView): fix cluncky navigation and RTL scrollToItem
 
---
## [v1.5.32](https://pro-gallery-1-5-32.surge.sh) (13/11/2019)
 
#### GALLERY
 -  improve: remove all animations from items

---
## [v1.5.31](https://pro-gallery-1-5-31.surge.sh) (13/11/2019)
 
#### GALLERY
 -  fix: add Object.entries polyfill
 -  fix (scrollCss): use domId for the general class

---
## [v1.5.30](https://pro-gallery-1-5-30.surge.sh) (11/11/2019)
 
#### GALLERY
 -  improve (scrollCss): seperate scrollCss into style tags

---
## [v1.5.29](https://pro-gallery-1-5-29.surge.sh) (11/11/2019)
 
#### MAIN
 -  improve: add a version debug log script

#### GALLERY
 - improve (dimensions->height): pro-gallery will self calculate height if was not provided from a wrapper.
 -  fix: remove annoying console.warn

---
## [v1.5.28](https://pro-gallery-1-5-28.surge.sh) (07/11/2019)
 
#### GALLERY
 -  improve (dimensions->width): pro-gallery will self calculate width if was not provided from a wrapper.
 -  improve (utils): playground is always verbose
 -  fix (galleryContainer): warn about new state only if verbose
 -  improve (readme): add readme to gallery package

---
## [v1.5.27](https://pro-gallery-1-5-27.surge.sh) (05/11/2019)
 
#### GALLERY
 -  fix (share.js): Fixed share icons mismatch (Pinteres<->Twitter).

---
## [v1.5.26](https://pro-gallery-1-5-26.surge.sh) (03/11/2019)
 
#### GALLERY
 -  fixed mobile hover bug for galleries under the view.

---
## [v1.5.25](https://pro-gallery-1-5-25.surge.sh) (03/11/2019)
 
#### GALLERY
 -  fix: removed calls to fixViewport and to getViewportScaleRatio as it's always 1.

---
## [v1.5.24](https://pro-gallery-1-5-24.surge.sh) (30/10/2019)
 
#### GALLERY
 -  fix hover share icons after svg changes

#### PLAYGROUND
 -  improve: add text items

---
## [v1.5.23](https://pro-gallery-1-5-23.surge.sh) (28/10/2019)

#### OTHER
 - Reverted v1.5.21 and v1.5.22 

#### GALLERY
 -  fix: fixed a bug when hover effects all galleries

---
## [v1.5.22](https://pro-gallery-1-5-22.surge.sh) (27/10/2019)
 
#### GALLERY
 -  fix: recalc gallery width until it is > 0

---
## [v1.5.21](https://pro-gallery-1-5-21.surge.sh) (27/10/2019)
 
#### GALLERY
 -  fix: fixed a bug when hover effects all galleries
 -  fix: fix galleryWidth calculation
 -  improve: measure galleryDimensions and scrollBase if not supplied

---
## [v1.5.20](https://pro-gallery-1-5-20.surge.sh) (24/10/2019)
 
#### GALLERY
 -  fix: fixed a bug when hover did not disappear on mouse out
 -  improve: remove position animations from items

---
## [v1.5.18](https://pro-gallery-1-5-18.surge.sh) (23/10/2019)
 
#### GALLERY
 -  fix: remove dynamic loading of ViewComponent (SSR did not render)

---
## [v1.5.18](https://pro-gallery-1-5-18.surge.sh) (23/10/2019)
 
#### GALLERY
 -  fix: do not render without a loaded viewComponent

---
## [v1.5.17](https://pro-gallery-1-5-17.surge.sh) (23/10/2019)
 
#### GALLERY
 -  fix: trigger dynamic imports on SSR

---
## [v1.5.16](https://pro-gallery-1-5-16.surge.sh) (23/10/2019)
 
#### GALLERY
 -  fix (dimensionHelper): fix isFullWidth condition

---
## [v1.5.15](https://pro-gallery-1-5-15.surge.sh) (22/10/2019)
 
#### GALLERY
 -  fix (dimensionsHelper): improve fullWidth check

---
## [v1.5.14](https://pro-gallery-1-5-14.surge.sh) (22/10/2019)
 
#### GALLERY
 -  improve (dimensionsHelper): calc scrollBase if needed

---
## [v1.5.13](https://pro-gallery-1-5-13.surge.sh) (18/10/2019)
 
#### LAYOUTS
 -  fix: fine tune infiniteScroll one horizontal layout

---
## [v1.5.12](https://pro-gallery-1-5-12.surge.sh) (17/10/2019)
 
#### LAYOUTS
 -  fix: set the strip width when adding new items

---
## [v1.5.11](https://pro-gallery-1-5-11.surge.sh) (17/10/2019)
 
#### LAYOUTS
 -  fix: reset layoutHeight when adding new items

---
## [v1.5.10](https://pro-gallery-1-5-10.surge.sh) (17/10/2019)
 
#### GALLERY
 -  fix (slideshowLoop): place dummy items for duplicated items

---
## [v1.5.9](https://pro-gallery-1-5-9.surge.sh) (17/10/2019)

#### LAYOUTS
 -  fix (layouter): fix horizontal infiniteScroll reset

---
## [v1.5.8](https://pro-gallery-1-5-8.surge.sh) (17/10/2019)
 
#### GALLERY
 -  improve (animations): add blur and main color animations

#### LAYOUTS
 -  fix (layouter): fix infiniteScroll for horizontal grid galleries

---
## [v1.5.7](https://pro-gallery-1-5-7.surge.sh) (17/10/2019)
 
#### GALLERY
 - disable slideshowLoop for vertical layouts

---
## [v1.5.6](https://pro-gallery-1-5-6.surge.sh) (17/10/2019)
 
#### GALLERY
 -  fix className of videoItemPlaceholder
 -  fix images loop for very few items
 -  add fade loading transition

---
## [v1.5.5](https://pro-gallery-1-5-5.surge.sh) (15/10/2019)
 
#### GALLERY
 - use real styles and items as event data

---
## [v1.5.4](https://pro-gallery-1-5-4.surge.sh) (15/10/2019)
 
#### GALLERY
 - re-add css from main index.js

---
## [v1.5.3](https://pro-gallery-1-5-3.surge.sh) (15/10/2019)
 
#### GALLERY
 -  remove unsed dependencies

---
## [v1.5.2](https://pro-gallery-1-5-2.surge.sh) (15/10/2019)
 
#### GALLERY
 -  remove css from main index.js

---
## v1.5.1(https://pro-gallery-1-5-1.surge.sh) (15/10/2019)
 
#### GALLERY
 -  remove sideEffects from package.json (caused css to disappear)
 -  set default view component is null function

---
## v1.5.0 (09/10/2019)
 
#### GALLERY
 -  dynamic load of ViewComponent

---
## v1.4.4 (07/10/2019)
 
#### GALLERY
 -  set default scrollBase to 0

---
## v1.4.3 (07/10/2019)
 
#### GALLERY
 -  fix: remove react context

---
## v1.4.2 (07/10/2019)
 
#### GALLERY
 -  fix: do not cache isFullWidth

---
## v1.4.1 (07/10/2019)
 
#### GALLERY
 -  add video preview image to css scroll (like regular images)

---
## v1.4.0 (07/10/2019)
 
#### GALLERY
 -  better handling of unknown width in SSR 
    width can be either empty string or a number - the gallery will not measure itself

---
## v1.3.21 (03/10/2019)
 
#### GALLERY
 -  fix minor position diff in share icon

---
## v1.3.20 (03/10/2019)
 
#### GALLERY
 -  remove leftovers font icons

---
## v1.3.19 (03/10/2019)
 
#### GALLERY
 -  fix broken slideshowLoop

---
## v1.3.18 (03/10/2019)
 
#### GALLERY
 -  remove svg-font-icons and add native SVG support
 -  better handling of arrows and horizontal swipe navigation

---
## v1.3.17 (25/09/2019)
 
#### GALLERY
 -  handle rage clicks on gallery arrows
 -  fix videos in Safari

---
## v1.3.16 (25/09/2019)
 
#### GALLERY
 -  fix arrows position in RTL galleries
 
---
## v1.3.15 (22/09/2019)
 
#### GALLERY
 -  fix (react-svg): save svgs to components
 -  improve (package.json): create a module instead of bundle

---
## v1.3.14 (20/09/2019)
 
#### GALLERY
 -  fix - change metaData on items when it changes

---
## v1.3.13 (19/09/2019)
 
#### GALLERY
 -  remove unnecessary dependencies

---
## v1.3.12 (18/09/2019)
 
#### GALLERY
 -  fix (lineHeightFixer): fixed customButton display css attribute when textPlacement is above or below.

---
## v1.3.11 (18/09/2019)
 
#### GALLERY
 -  fix first-tap on mobile.

---
## v1.3.10 (18/09/2019)
 
#### GALLERY
 -  move Videos dynamic loading to componentDidMount
 -  fix slideshow arrows appearance in rtl

---
## v1.3.9 (15/09/2019)
 
#### GALLERY
 -  refactor: moved constants, utils, window to 'common' folder. Added utils functions and constants for pro-fullscreen-renderer usage.

---
## v1.3.8 (15/09/2019)
 
#### GALLERY
 - removed local love logic.
---
## v1.3.7 (15/09/2019)
 
#### GALLERY
 -  fix grid fit with ssr
 -  decrease debounce time when measuring items

---
## v1.3.6 (12/09/2019)
 
#### GALLERY
 -  improve: use debounce instead of throttle after image measurement
 -  fix: do not set imageDimensions on SSR
 -  fix: remove implicit usage of filename

---
## v1.3.5 (12/09/2019)
 
#### GALLERY
 -  fix: remove double # from id

---
## v1.3.4 (12/09/2019)
 
#### GALLERY
 -  fix ssr layout css

---
## v1.3.2 (11/09/2019)
 
#### GALLERY
 -  fix arrow navigation in RTL mode
 -  do not populate title with filename
 -  fix css layouts for multiple galleries

---
## v1.3.1 (08/09/2019)
 
#### GALLERY
 -  add rtl class to gallery scss

---
## v1.3.0 (08/09/2019)
 
#### GALLERY
 -  *add support for RTL galleries*
 -  return empty string functions as links for text items

#### LAYOUTS
 -  add total width to scheme

---
## v1.2.16 (05/09/2019)
 
#### GALLERY
 -  some more A11y fixes
 -  set maximum logging depth (for verbose logging)
  -  seoLink to return a string and not a function

---
## v1.2.15 (04/09/2019)
 
#### GALLERY
 -  fixed A11y issue and auto slideshow play button and counter.

---
## v1.2.14 (03/09/2019)
 
#### GALLERY
 -  remove comments from svg-fonts scss file (created errors in css dist file)

---
## v1.2.13 (03/09/2019)
 
#### GALLERY
 -  rename play svg
 -  bind setCurrentItemByScroll to this

---
## v1.2.11 (27/08/2019)
 
#### GALLERY
 -  use window outerWidth/Height for scroll calcs
 -  lineHeightFixer - use default values when css is not found
 -  fixed dynamic imports influence on the component (state vise).

---
## v1.2.10 (26/08/2019)
 
#### GALLERY
 -  init playing video setState only after compDidMount

---
## v1.2.9 (26/08/2019)
 
#### GALLERY
 -  add idx to domId

---
## v1.2.8 (26/08/2019)
 
#### GALLERY
 -  always create new cssLayouts

---
## v1.2.7 (26/08/2019)
 
#### GALLERY
 -  fix video props in hydrate

---
## v1.2.6 (26/08/2019)
 
#### GALLERY
 -  add another reCreateGallery after mount

---
## v1.2.5 (21/08/2019)
 
#### GALLERY
 -  add cssLayouts to hydrate phase

---
## v1.2.4 (21/08/2019)
 
#### GALLERY
 -  add externalInfoSize to css
 -  do not recreate cssLayouts if not needed

---
## v1.2.3 (21/08/2019)
 
#### GALLERY
 -  remove inline position styles - use only css

---
## v1.2.2 (20/08/2019)
 
#### GALLERY
 -  create item url for art store
 -  upgrade file-loader to v4

---
## v1.2.1 (20/08/2019)

#### GALLERY
 -  re-add recreate gallery timer

---
## v1.2.0 (20/08/2019)
 
#### GALLERY
 -  dynamic import of video modules
 -  do not render poisition styles in SSR
 -  move gallery creation to constructor

---
## v1.1.4 (19/08/2019)
 
#### GALLERY
 -  Add windowWrapper to support SSR

---
