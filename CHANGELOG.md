# Pro Gallery Change Log

## v1.1.4 (19/08/2019)
 
#### GALLERY
 -  Add windowWrapper to support SSR

#### PLAYGROUND
 -  remove ugly comments from sidebar

---
## v1.2.0 (20/08/2019)
 
#### PLAYGROUND
 -  improve ui and usuability
 -  better gallery benchmarks render timing

#### GALLERY
 -  dynamic import of video modules
 -  do not render poisition styles in SSR
 -  move gallery creation to constructor

#### MAIN
 -  add patch, minor and major scripts

---
## v1.2.1 (20/08/2019)
 
#### GALLERY
 -  re-add recreate gallery timer

---
## v1.2.2 (20/08/2019)
 
#### GALLERY
 -  create item url for art store
 -  upgrade file-loader to v4


---
## v1.2.3 (21/08/2019)
 
#### GALLERY
 -  remove inline position styles - use only css

#### PLAYGROUND
 -  ui improvements


---
## v1.2.4 (21/08/2019)
 
#### GALLERY
 -  add externalInfoSize to css
 -  do not recreate cssLayouts if not needed


---
## v1.2.5 (21/08/2019)
 
#### GALLERY
 -  add cssLayouts to hydrate phase


---
## v1.2.6 (26/08/2019)
 
#### GALLERY
 -  add another reCreateGallery after mount


---
## v1.2.7 (26/08/2019)
 
#### GALLERY
 -  fix video props in hydrate


---
## v1.2.8 (26/08/2019)
 
#### GALLERY
 -  always create new cssLayouts


---
## v1.2.9 (26/08/2019)
 
#### GALLERY
 -  add idx to domId


---
## v1.2.10 (26/08/2019)
 
#### OTHER
 -  init playing video setState only after compDidMount


---
## v1.2.11 (27/08/2019)
 
#### GALLERY
 -  use window outerWidth/Height for scroll calcs
 -  lineHeightFixer - use default values when css is not found
 -  fixed dynamic imports influence on the component (state vise).

---
## v1.2.12 (03/09/2019)
 
#### GALLERY
 -  merge both constants folders
 -  remove lodash dependency
 -  remove utils isStoreGallery
 -  fix download url


---
## v1.2.13 (03/09/2019)
 
#### GALLERY
 -  rename play svg
 -  bind setCurrentItemByScroll to this

---
## v1.2.14 (03/09/2019)
 
#### GALLERY
 -  remove comments from svg-fonts scss file (created errors in css dist file)

---
## v1.2.15 (04/09/2019)
 
#### GALLERY
 -  fixed A11y issue and auto slideshow play button and counter.

#### PLAYGROUND
 -  save styleParams in the url


---
## v1.2.16 (05/09/2019)
 
#### GALLERY
 -  some more A11y fixes
 -  set maximum logging depth (for verbose logging)
  -  seoLink to return a string and not a function

---
## v1.3.0 (08/09/2019)
 
#### GALLERY
 -  *add support for RTL galleries*
 -  return empty string functions as links for text items

#### PLAYGROUND
 -  add RTL and scrollSnap to settingsManager
 -  add search for style params

#### LAYOUTS
 -  add total width to scheme


---
## v1.3.1 (08/09/2019)
 
#### GALLERY
 -  add rtl class to gallery scss


---
## v1.3.2 (11/09/2019)
 
#### PLAYGROUND
 -  improve: better search list

#### GALLERY
 -  fix arrow navigation in RTL mode
 -  do not populate title with filename
 -  fix css layouts for multiple galleries

---
## v1.3.4 (12/09/2019)
 
#### GALLERY
 -  fix ssr layout css

---
## v1.3.5 (12/09/2019)
 
#### GALLERY
 -  fix: remove double # from id


---
## v1.3.6 (12/09/2019)
 
#### GALLERY
 -  improve: use debounce instead of throttle after image measurement
 -  fix: do not set imageDimensions on SSR
 -  fix: remove implicit usage of filename

---
## v1.3.7 (15/09/2019)
 
#### GALLERY
 -  fix grid fit with ssr
 -  decrease debounce time when measuring items

---
## v1.3.8 (15/09/2019)

#### PLAYGROUND
 -  fix: rename imageResize to cubeType (fix grid fit layout)
 
#### GALLERY
 - removed local love logic.
---
## v1.3.9 (15/09/2019)
 
#### PLAYGROUND
 -  fixed path to imports of constants from pro-gallery.

#### GALLERY
 -  refactor: moved constants, utils, window to 'common' folder. Added utils functions and constants for pro-fullscreen-renderer usage.

