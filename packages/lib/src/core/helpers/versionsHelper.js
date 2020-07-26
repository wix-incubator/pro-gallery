class FeatureManager {
  constructor() {
    this.features = {
      fullscreenRedesign: {
        title: 'New fullscreen design',
        releaseDate: Date.parse('2017-09-25T12:00:00.000Z'),
      },
      spacingCalculation: {
        title: 'Improve spacing calculation',
        releaseDate: Date.parse('2017-08-29T11:27:29.000Z'),
      },
      fixedColumnsInMasonry: {
        title: 'Allow fixed number of columns in Masonry layout',
        releaseDate: Date.parse('2018-05-24T18:00:00.000Z'),
      },
      mobileSettings: {
        title: 'Separate mobile and desktop setting',
        releaseDate: Date.parse('2018-12-18T12:00:50.054Z'),
      },
    };
    this.freezeDate = new Date();
    this.updateFeatures();
  }

  get freezeDate() {
    return this._dateCreated || new Date();
  }

  set freezeDate(date) {
    if (typeof date === 'object' && typeof date.getTime === 'function') {
      this._dateCreated = date;
      this.updateFeatures();
    }
  }

  updateFeatures() {
    this.supports = Object.entries(this.features).reduce(
      (obj, [feature, { releaseDate }]) => ({
        ...obj,
        [feature]: this.freezeDate >= releaseDate,
      }),
    );
  }
}

export const featureManager = new FeatureManager();
