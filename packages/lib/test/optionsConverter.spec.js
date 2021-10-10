import { expect } from 'chai';
// import optionsMap from '../src/core/helpers/optionsMap';
import { flattenObject, flatToNested } from '../src/core/helpers/optionsUtils';
import {
  migrateOptions,
  addMigratedOptions,
  extendNestedOptionsToIncludeOldAndNew,
} from '../src/core/helpers/optionsConverter';
import {
  reverseMigrateOptions,
  addOldOptions,
} from '../src/core/helpers/optionsBackwardConverter';
import v3DefaultOptions from '../src/common/v3DefaultOptions';
import v4DefaultOptions from '../src/common/v4DefaultOptions';

describe('Styles processing', () => {
  //one way
  it('should migrated new options to old ones', () => {
    let old = reverseMigrateOptions(flattenObject(defaultOptions_new()));
    expect(flatToNested(old)).to.eql(defaultOptions_old());
  });
  //and the other
  it('should migrate styles from old to new ', () => {
    const migrated = migrateOptions(flattenObject(defaultOptions_old()));
    expect(flatToNested(migrated)).to.eql(defaultOptions_new());
  });
  it('should have new and old styles combined coming from both old and new objects', () => {
    const migrated = addMigratedOptions(flattenObject(defaultOptions_old()));
    const reversed = addOldOptions(flattenObject(defaultOptions_new()));
    expect(migrated).to.eql(reversed);
  });

  it('should have new and old options when converted back and forth even with semi refactored objects', () => {
    const migrated = extendNestedOptionsToIncludeOldAndNew(semiRefactored());
    expect(migrated.layoutParams.info.height).to.eql(150);
    expect(migrated.slideshowInfoSize).to.eql(150);
    expect(migrated.textBoxHeight).to.eql(150);
    expect(migrated.layoutParams.structure.galleryLayout).to.eql(4);
    expect(migrated.galleryLayout).to.eql(4);
    expect(migrated.isAutoSlideshow).to.eql(false);
    expect(
      migrated.behaviourParams.gallery.horizontal.autoSlide.behaviour
    ).to.eql('OFF');
    expect(migrated.scrollSnap).to.eql(false);
    expect(migrated.behaviourParams.gallery.horizontal.enableScrollSnap).to.eql(
      false
    );
  });
  it('should not have defined properties if they were not initialy defined', () => {
    const migrated = addOldOptions(addMigratedOptions({}));
    const flat = flattenObject(migrated);
    Object.keys(flat).forEach((key) =>
      flat[key] === undefined ? delete flat[key] : {}
    );
    expect(Object.keys(flat).length).to.eql(0);
  });
});
describe('runtime should be acceptable (x10000)', function () {
  this.timeout(1000);

  it('addOldOptions', () => {
    for (let i = 0; i < 10000; i++) {
      addOldOptions({});
    }
    expect(false).to.eql(false);
  });
  it('reverseMigrateOptions', () => {
    for (let i = 0; i < 10000; i++) {
      reverseMigrateOptions({});
    }
    expect(false).to.eql(false);
  });
  it('addMigratedOptions', () => {
    for (let i = 0; i < 10000; i++) {
      addMigratedOptions({});
    }
    expect(false).to.eql(false);
  });
  it('migrateOptions', () => {
    for (let i = 0; i < 10000; i++) {
      migrateOptions({});
    }
    expect(false).to.eql(false);
  });
  it('extendNestedOptionsToIncludeOldAndNew', () => {
    for (let i = 0; i < 10000; i++) {
      extendNestedOptionsToIncludeOldAndNew({});
    }
    expect(false).to.eql(false);
  });
});
function semiRefactored() {
  return {
    layoutParams: {
      info: { height: 150 },
      structure: {
        galleryLayout: 4,
      },
    },
    behaviourParams: {
      gallery: {
        horizontal: {
          enableScrollSnap: false,
        },
      },
    },
    // scrollSnap: false,
    isAutoSlideshow: false,
  };
}
// function afterConverstionAndBack() {
//   return {
//     layoutParams: {
//       info: { height: 150 },
//       structure: {
//         galleryLayout: 4,
//       },
//     },
//     behaviourParams: {
//       gallery: {
//         horizontal: {
//           autoSlide: {
//             behaviour: 'OFF',
//           },
//         },
//       },
//     },
//     isAutoSlideshow: false,
//     galleryLayout: 4,
//     textBoxHeight: 150,
//     slideshowInfoSize: 150,
//   };
// }

function defaultOptions_old() {
  const oldDefaults = v3DefaultOptions;
  // these are merged in the migration and will not be defined going new to old.
  oldDefaults.gallerySizePx = undefined;
  oldDefaults.gallerySizeRatio = undefined;
  oldDefaults.rotatingCropRatios = undefined;
  oldDefaults.fixedColumns = undefined;
  return oldDefaults;
}

function defaultOptions_new() {
  return v4DefaultOptions;
}
