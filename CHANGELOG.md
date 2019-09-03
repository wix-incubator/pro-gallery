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
## v1.2.13 (03/09/2019)
 
#### GALLERY
 -  remove comments from svg-fonts scss file (created errors in css dist file)
 -  rename again that play button
 -  rename play button again
 -  fix references to play.js
 -  rename play svg
 -  rename play svg
 -  bind setCurrentItemByScroll to this

