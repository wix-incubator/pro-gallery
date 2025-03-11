import { Layouter, ItemsHelper } from 'pro-layouts';
import {
  populateWithDefaultOptions,
  addPresetOptions,
  dimensionsHelper,
  processLayouts,
  GALLERY_CONSTS,
  extendNestedOptionsToIncludeOldAndNew,
} from 'pro-gallery-lib';

class Blueprints {
  createBlueprint({
    params,
    lastParams,
    existingBlueprint,
    blueprintManagerId,
    isUsingCustomInfoElements,
  }) {
    // cacheBlocker.
    // if (this.cache[params]) return this.cache[params];

    this.reasons = {
      items: '',
      itemsAdded: '',
      options: '',
      container: '',
    };

    let changedParams = {};
    try {
      const {
        container: newContainerParams,
        items: newItemsParams,
        options: newOptions,
      } = params;
      const {
        container: oldContainerParams,
        items: oldItemsParams,
        options: oldOptions,
      } = lastParams;
      // getItems,options and dimesions if not supplied in params;

      const { formattedItems, changed: itemsChanged } =
        this.formatItemsIfNeeded(newItemsParams, oldItemsParams);
      const { formattedOptions, changed: optionsChanged } =
        this.formatOptionsIfNeeded(
          newOptions,
          oldOptions,
          isUsingCustomInfoElements
        );
      const { formattedContainer, changed: containerChanged } =
        this.formatContainerIfNeeded(
          newContainerParams,
          oldContainerParams,
          oldOptions,
          formattedOptions || existingBlueprint.options,
          optionsChanged
        );

      const changed = itemsChanged || optionsChanged || containerChanged;
      changedParams = { itemsChanged, optionsChanged, containerChanged };

      if (changed || !existingBlueprint) {
        if (!existingBlueprint) {
          existingBlueprint = {};
        }

        const structure = this.createStructure(
          {
            formattedContainer:
              formattedContainer || existingBlueprint.container,
            formattedItems: formattedItems || existingBlueprint.items,
            formattedOptions: formattedOptions || existingBlueprint.options,
          },
          changed
        );

        // assign changed values w/o replacing the original object;
        if (formattedOptions) {
          existingBlueprint.options = formattedOptions;
        }
        if (formattedItems) {
          existingBlueprint.items = formattedItems;
        }
        if (formattedContainer) {
          existingBlueprint.container = formattedContainer;
        }
        existingBlueprint.structure = structure;

        // if its an infinite gallery - let the container loose
        const isInfinite =
          existingBlueprint.options.scrollDirection ===
            GALLERY_CONSTS.scrollDirection.VERTICAL &&
          existingBlueprint.options.enableInfiniteScroll;
        if (isInfinite) {
          existingBlueprint.container.height =
            existingBlueprint.container.galleryHeight = structure.height;
        }
      }
    } catch (error) {
      console.error('Could not create blueprint, error:', error);
    }

    const reasons = Object.entries(this.reasons)
      .reduce(
        (reasons, [param, reason]) => [...reasons, `${param}: ${reason}`],
        []
      )
      .join(', ');

    // return the existing or the modified existing object
    return {
      blueprint: existingBlueprint,
      changedParams,
      blueprintManagerId,
      reasons,
    };
  }

  // ------------------ Raw data to Formated data (if needed) ---------------------------- //

  formatItemsIfNeeded(items, lastItems) {
    const itemsWereAdded = (newItemsParams, oldItemsParams) => {
      if (newItemsParams === oldItemsParams) {
        this.reasons.itemsAdded = 'items are the same object.';
        return false; // it is the exact same object
      }
      if (!newItemsParams) {
        this.reasons.itemsAdded = 'new items do not exist.';
        return false; // new items do not exist (use old items)
      }
      if (!oldItemsParams || (oldItemsParams && oldItemsParams.length === 0)) {
        this.reasons.itemsAdded = 'old items do not exist.';
        return false; // old items do not exist (it is not items addition)
      }
      if (oldItemsParams.length >= newItemsParams.length) {
        this.reasons.itemsAdded = 'more old items than new items.';
        return false; // more old items than new items
      }
      const idsNotChanged = oldItemsParams.reduce((is, _item, idx) => {
        // check that all the existing items exist in the new array
        return is && _item.id === newItemsParams[idx].itemId;
      }, true);

      if (!idsNotChanged) {
        this.reasons.itemsAdded = 'items ids were changed. ';
      }
      return idsNotChanged;
    };

    const itemsHaveChanged = (newItemsParams, oldItemsParams) => {
      if (newItemsParams === oldItemsParams) {
        this.reasons.items = 'items are the same object.';
        return false; // it is the exact same object
      }
      if (!newItemsParams) {
        this.reasons.items = 'new items do not exist.';
        return false; // new items do not exist (use old items)
      }
      if (!oldItemsParams || (oldItemsParams && oldItemsParams.length === 0)) {
        this.reasons.items = 'old items do not exist.';
        return true; // old items do not exist
      }
      if (oldItemsParams.length !== newItemsParams.length) {
        this.reasons.items = 'more new items than old items (or vice versa).';
        return true; // more new items than old items (or vice versa)
      }
      return newItemsParams.some((newItem, idx) => {
        // check that all the items are identical
        const existingItem = oldItemsParams[idx];
        try {
          const itemsChanged =
            !newItem ||
            !existingItem ||
            newItem.itemId !== existingItem.itemId ||
            newItem.mediaUrl !== existingItem.mediaUrl ||
            newItem.measured !== existingItem.measured ||
            (newItem.metaData &&
              existingItem.metaData &&
              (newItem.metaData.type !== existingItem.metaData.type ||
                newItem.metaData.title !== existingItem.metaData.title ||
                newItem.metaData.description !==
                  existingItem.metaData.description ||
                newItem.metaData.width !== existingItem.metaData.width ||
                newItem.metaData.height !== existingItem.metaData.height)) ||
            (newItem.metaData &&
              newItem.metaData.type === 'text' &&
              existingItem.metaData &&
              existingItem.metaData.type === 'text' &&
              (newItem.metaData.html !== existingItem.metaData.html ||
                newItem.metaData.textStyle !==
                  existingItem.metaData.textStyle ||
                newItem.metaData.editorHtml !==
                  existingItem.metaData.editorHtml));
          if (itemsChanged) {
            this.reasons.items = `items #${idx} id was changed.`;
          }
          return itemsChanged;
        } catch (e) {
          this.reasons.items = 'an error occured';
          return true;
        }
      }, false);
    };

    const oldItemsParams = lastItems;
    let changed = false;
    let formattedItems;
    if (itemsWereAdded(items, oldItemsParams)) {
      formattedItems = oldItemsParams.concat(
        items.slice(oldItemsParams.length).map((item) => {
          return ItemsHelper.convertDtoToLayoutItem(item);
        })
      );
      this.gettingMoreItems = false; // probably finished getting more items       //TODO - what is this and how we keep it alive if needed?
      changed = true;
    } else if (itemsHaveChanged(items, oldItemsParams)) {
      formattedItems = items.map((item) =>
        Object.assign(ItemsHelper.convertDtoToLayoutItem(item))
      );
      this.gettingMoreItems = false; // probably finished getting more items
      changed = true;
    }
    return { formattedItems, changed };
  }

  formatOptionsIfNeeded(options, lastOptions, isUsingCustomInfoElements) {
    const optionsHaveChanged = (newOptions, oldOptions) => {
      if (!newOptions) {
        this.reasons.options = 'no new options.';
        return false; // no new options - use old options
      }
      if (!oldOptions) {
        this.reasons.options = 'no old options.';
        return true; // no old options
      }
      try {
        const oldOptionsSorted = {};
        Object.keys(oldOptions)
          .sort() // sort by keys alphabetically
          .forEach((key) => (oldOptionsSorted[key] = oldOptions[key]));
        const newOptionsSorted = {};
        Object.keys(newOptions)
          .sort() // sort by keys alphabetically
          .forEach((key) => (newOptionsSorted[key] = newOptions[key]));
        const wasChanged =
          JSON.stringify(newOptionsSorted) !== JSON.stringify(oldOptionsSorted);
        if (wasChanged) {
          this.reasons.options = 'options were changed.';
        }
        return wasChanged;
      } catch (e) {
        console.error('Could not compare options', e);
        return false;
      }
    };

    const oldOptions = lastOptions;
    let changed = false;
    let formattedOptions;
    if (optionsHaveChanged(options, oldOptions)) {
      const mergedOldAndNewStyles =
        extendNestedOptionsToIncludeOldAndNew(options); //add both old and new options
      const fullOptionsOverDefualts = populateWithDefaultOptions(
        mergedOldAndNewStyles
      ); //add default for any undefined option
      formattedOptions = extendNestedOptionsToIncludeOldAndNew(
        processLayouts(
          addPresetOptions(fullOptionsOverDefualts),
          isUsingCustomInfoElements
        )
      ); // TODO make sure the processLayouts is up to date. delete addLayoutStyles from layoutsHelper when done with it...
      changed = true;
    }

    return { formattedOptions, changed };
  }

  formatContainerIfNeeded(
    container,
    lastContainer,
    lastOptions,
    formattedOptions,
    optionsChanged
  ) {
    const containerHasChanged = ({
      newContainerParams,
      oldContainerParams,
      oldOptions,
    }) => {
      if (!oldOptions || !oldContainerParams) {
        this.reasons.container = 'no old container or options. ';
        return true; // no old container or options (style may change container)
      }
      if (!newContainerParams) {
        this.reasons.container = 'no new container.';
        return false; // no new continainer
      }
      const containerHasChanged = {
        height:
          formattedOptions.scrollDirection ===
            GALLERY_CONSTS.scrollDirection.VERTICAL &&
          formattedOptions.enableInfiniteScroll // height doesnt matter if the new gallery is going to be vertical
            ? false
            : !!newContainerParams.height &&
              newContainerParams.height !== oldContainerParams.height,
        width:
          !oldContainerParams ||
          (!!newContainerParams.width &&
            newContainerParams.width !== oldContainerParams.width),
        scrollBase:
          newContainerParams.scrollBase !== oldContainerParams.scrollBase,
      };
      return Object.keys(containerHasChanged).reduce((is, key) => {
        if (containerHasChanged[key]) {
          this.reasons.container += `container.${key} has changed. `;
        }
        return is || containerHasChanged[key];
      }, false);
    };

    const oldContainerParams = lastContainer;
    let changed = false;
    const oldOptions = lastOptions;
    let formattedContainer;
    if (
      optionsChanged || // If options changed they could affect the container and a new container must be created (slideshow,thumbs,shadow,borders...etc)
      containerHasChanged({
        newContainerParams: container,
        oldContainerParams,
        oldOptions,
      })
    ) {
      dimensionsHelper.updateParams({
        options: formattedOptions,
        container,
      });
      changed = true;
      formattedContainer = Object.assign(
        {},
        container,
        dimensionsHelper.getGalleryDimensions()
      );
    }
    return { formattedContainer, changed };
  }

  createStructure({ formattedContainer, formattedOptions, formattedItems }) {
    const layoutParams = {
      items: formattedItems,
      container: formattedContainer,
      styleParams: formattedOptions,
      options: {
        showAllItems: true,
        skipVisibilitiesCalc: true,
        useLayoutStore: false,
      },
    };

    // if (this.layouter && addingItems) {
    //   layoutParams.options.useExistingLayout = true;
    // } else {
    layoutParams.options.createLayoutOnInit = false; // TODO - what does this do?
    this.layouter = new Layouter(layoutParams); // TODO - no need for "this."
    // }

    return this.layouter.createLayout(layoutParams);
  }
}
const blueprints = new Blueprints();
export default blueprints;
