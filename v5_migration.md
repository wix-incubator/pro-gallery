# V5 Migration Guide

## Breaking API

* `options` property

### options

The `options` property name itself has not changed, but the contained properties have.
In addition to the new nested options introduced in V4, the gallery also supported the old naming of V3.

V3:
```jsx
import { ProGallery } from 'pro-gallery';

const App = () => { 
    const options = {
        galleryLayout: 5
    }

    return (
        <ProGallery
            {...restOfProps}
            options={options}
        />
    )
}
```

V4:
```jsx
import { ProGallery } from 'pro-gallery';

const App = () => { 
    const options = {
        galleryLayout: 5
    }
    // or
    const options = {
        layoutParams: {
            structure: {
                galleryLayout: 5
            }
        },
    }

    return (
        <ProGallery
            {...restOfProps}
            options={options}
        />
    )
}
```

In V5 the gallery will accept only the new flat keys:

```jsx
import { ProGallery } from 'pro-gallery';

const App = () => {
    const options = {
        layoutParams_structure_galleryLayout: 5
    }

    return (
        <ProGallery
            {...restOfProps}
            options={options}
        />
    )
}
```

### Migration Utilities

You can also use our utility functions to migrate/flatten your old `options` object for the new version

If you used only the old options from V3 in V4 then you may want to use `migrateOptions` function from `pro-gallery-lib` package to migrate the keys and the values:

```jsx
import { ProGallery } from 'pro-gallery';
import { migrateOptions } from 'pro-gallery-lib';

const App = () => {
    const oldV3Options = {
        galleryLayout: 5
    }

    const migratedOptions = migrateOptions(oldV3Options);

    return (
        <ProGallery
            {...restOfProps}
            options={migratedOptions}
        />
    )
}
```

If you used the nested options then `flattenObject` function would be enough:

```jsx
import { ProGallery } from 'pro-gallery';
import { flattenObject } from 'pro-gallery-lib';

const App = () => {
      const v4Options = {
        layoutParams: {
            structure: {
                galleryLayout: 5
            }
        },
    }

    const flattenedOptions = migrateOptions(v4Options);

    return (
        <ProGallery
            {...restOfProps}
            options={flattenedOptions}
        />
    )
}


