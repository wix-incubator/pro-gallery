# pro-gallery-lib

The pro-gallery-lib containys helpers and files that can be imported individually.

## Blueprints - v.3+
The pro-gallery-lib exports `Blueprints` and `BlueprintsManager`

### BlueprintsManager
The BlueprintsManager is a class that takes care of fetching needed params and creating a new blueprint when it might be needed.

The blueprintsManager works with an api provided by the user (see blow)


| Function Name | description       |  arguments  | return
| --------------- | ----------- | ---------- | ---------|
| async `createBlueprint` | Used when changes were made that might require a new blueprint, params can be empty - the manager will fetch by the provided api | params: {styles, items, container, totalItemsCount} | {blueprint: object, blueprintChange: boolean}
| `init`  | call to provide the formFactor and api |config: {api, formFactor, totalItemsCount} | --
| `getMoreItems`  | Call this when the gallery needs more items | currentItemsLength: number | --


## BlueprintsManager API

To use the blueprints Manager to the full extent you need to provide it with an api to be able to manage fetching needed data and updating on ready blueprints.

[An example can be found in the Playground code](https://github.com/wix/pro-gallery/blob/3b9cc15e0a17b0165be3fb05d6a94995e8f17070/packages/playground/src/components/App/PlaygroundBlueprintsApi.js)

| Function Name | description       |  arguments  | expected return
| --------------- | ----------- | ---------- | ---------|
| `fetchMoreItems` | Will be called when the BM requires more items (under the totalItemsCount) | currentItemLength: number | --
| `fetchItems`  | Will be called by the BM to get the current items| -- | items
| `fetchStyles`  | Will be called by the BM to get the current styles | -- | styles
| `fetchDimensions`  | Will be called by the BM to get the current dimensions | -- | dimensions
| `getTotalItemsCount`  | Will be called by the BM to get the totalItemsCount | -- | totalItemsCount: number
| `onBlueprintReady`  | Will be called by the BM when a requested blueprint is ready | {blueprint: object, blueprintChanged: boolean} | --
| `isUsingCustomInfoElements`  | Will be called by the BM to know if Custom Info Elements are used | -- | boolean



## basic usage
```jsx
import { BlueprintsManager, GALLERY_CONSTS } from 'pro-gallery-lib'

const blueprintsManager = new BlueprintsManager({
      id: `gallery1`,
    });
    const blueprintsApi = {
        fetchMoreItems(currentItemLength) {
            // fire your get more items method here; no return expected;
        }
        fetchItems() {
            //return the current items array;
        }
        fetchStyles() {
            //return the current styles object;
        }
        fetchDimensions() {
            //return the current dimensions object;
        }
        getTotalItemsCount() {
            //return the current totalItemsCount;
        }
        onBlueprintReady({ blueprint, blueprintChanged }) {
            // set the new blueprint as the new state, blueprintChanged can be used to do this only if there was an actual change in the blueprint object.
        }

        isUsingCustomInfoElements() {
            // return true/false to reflect the usage of Custom info elements. used to process the styles accordingly.
        }
    }
blueprintsManager.init({
    api: blueprintsApi,
    formFactor: GALLERY_CONSTS.formFactor.DESKTOP,
    // totalItemsCont, This is optional and can be passed in the params in createBlueprint(params) or via the api;
});
const triggerBlueprintCreation = () => { //call this whenever something changes (styles/ items/ dimensions...anything). If this was called and nothing relevant changed the BM will call the onBlueprintReady api with a false blueprintChanged flag.
    blueprintsManager.createBlueprint({}); //since the api is used params can be empty, the BM will use the provided api to fetch all the needed params to create a blueprint.
}

```

## Basic component code:
Here we use the `ProGalleryRenderer` instead of the `ProGallery`.

Instead of the normal styles, items, container props we will destruct the `blueprint` we got from the `blueprintsManager` into the props.
```jsx

import { ProGalleryRenderer } from 'pro-gallery'
import 'pro-gallery/dist/statics/main.css';


<ProGalleryRenderer
    domId={domId}
    {...blueprint}
    scrollingElement = { () => document.getElementById('gallery') || window }
    eventsListener = {(eName, eData) => console.log({eName, eData})}
    resizeMediaUrl  {(item, url, resizeMethod, width, height) => `https://...`}
    isPrerenderMode = {isPrerenderMode}
/>
```

