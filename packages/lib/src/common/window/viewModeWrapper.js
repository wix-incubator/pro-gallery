import VIEW_MODE from '../constants/viewMode';
import DEVICE_TYPE from '../constants/deviceType';

class ViewModeWrapper {
  constructor() {
    this.setViewMode = this.setViewMode.bind(this);
    this.isSiteMode = this.isSiteMode.bind(this);
    this.isEditMode = this.isEditMode.bind(this);
    this.isPreviewMode = this.isPreviewMode.bind(this);
    this.isSEOMode = this.isSEOMode.bind(this);
    this.setDeviceType = this.setDeviceType.bind(this);
    this.isDeviceTypeDesktop = this.isDeviceTypeDesktop.bind(this);
    this.isDeviceTypeMobile = this.isDeviceTypeMobile.bind(this);
    this.isDeviceTypeTablet = this.isDeviceTypeTablet.bind(this);
    this.isDeviceTypeTouch = this.isDeviceTypeTouch.bind(this);
    this._viewMode = VIEW_MODE.SITE;
    this._deviceType = DEVICE_TYPE.DESKTOP;
  }

  setViewMode(viewMode) {
    this._viewMode = viewMode;
  }
  setDeviceType(forceVal) {
    this._deviceType = forceVal;
  }

  isDeviceTypeMobile() {
    return this._deviceType === DEVICE_TYPE.MOBILE;
  }
  isDeviceTypeTablet() {
    return this._deviceType === DEVICE_TYPE.TABLET;
  }
  isDeviceTypeDesktop() {
    return this._deviceType === DEVICE_TYPE.DESKTOP;
  }
  isDeviceTypeTouch() {
    return this.isDeviceTypeMobile() || this.isDeviceTypeTablet();
  }

  isSiteMode() {
    return this._viewMode === VIEW_MODE.SITE;
  }

  isEditMode() {
    return this._viewMode === VIEW_MODE.EDIT;
  }

  isPreviewMode() {
    return this._viewMode === VIEW_MODE.PREVIEW;
  }

  isSEOMode() {
    return this._viewMode === VIEW_MODE.SEO;
  }
}

const viewModeWrapper = new ViewModeWrapper();
const isSiteMode = viewModeWrapper.isSiteMode;
const isEditMode = viewModeWrapper.isEditMode;
const isPreviewMode = viewModeWrapper.isPreviewMode;
const isSEOMode = viewModeWrapper.isSEOMode;
const isDeviceTypeMobile = viewModeWrapper.isDeviceTypeMobile;
const isDeviceTypeTablet = viewModeWrapper.isDeviceTypeTablet;
const isDeviceTypeDesktop = viewModeWrapper.isDeviceTypeDesktop;
const isDeviceTypeTouch = viewModeWrapper.isDeviceTypeTouch;

export { viewModeWrapper };
export { isSiteMode };
export { isEditMode };
export { isPreviewMode };
export { isSEOMode };
export { isDeviceTypeMobile };
export { isDeviceTypeTablet };
export { isDeviceTypeDesktop };
export { isDeviceTypeTouch };
