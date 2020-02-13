import utils from '../utils';
import VIEW_MODE from '../constants/viewMode';
import FORM_FACTOR from '../constants/formFactor';

class ViewModeWrapper {
  constructor() {
    this.setViewMode = this.setViewMode.bind(this);
    this.isSiteMode = this.isSiteMode.bind(this);
    this.isEditMode = this.isEditMode.bind(this);
    this.isPreviewMode = this.isPreviewMode.bind(this);
    this.isSEOMode = this.isSEOMode.bind(this);
    this.setFormFactor = this.setFormFactor.bind(this);
    this.isFormFactorDesktop = this.isFormFactorDesktop.bind(this);
    this.isFormFactorMobile = this.isFormFactorMobile.bind(this);
    this.isFormFactorTablet = this.isFormFactorTablet.bind(this);
    this.isFormFactorTouch = this.isFormFactorTouch.bind(this);
    this._viewMode = VIEW_MODE.SITE;
    this._formFactor = FORM_FACTOR.DESKTOP;
  }

  setViewMode(viewMode) {
    utils.dumpCache();
    this._viewMode = viewMode;
  }
  setFormFactor(forceVal) {
    utils.dumpCache();
    this._formFactor = forceVal;
  }

  isFormFactorMobile() {
    return this._formFactor === FORM_FACTOR.MOBILE;
  }
  isFormFactorTablet() {
    return this._formFactor === FORM_FACTOR.TABLET;
  }
  isFormFactorDesktop() {
    return this._formFactor === FORM_FACTOR.DESKTOP;
  }
  isFormFactorTouch() {
    return this.isMobile() || this.isTablet();
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
const isFormFactorMobile = viewModeWrapper.isFormFactorMobile;
const isFormFactorTablet = viewModeWrapper.isFormFactorTablet;
const isFormFactorDesktop = viewModeWrapper.isFormFactorDesktop;
const isFormFactorTouch = viewModeWrapper.isFormFactorTouch;

export { viewModeWrapper, isSiteMode, isEditMode, isPreviewMode, isSEOMode, isFormFactorMobile, isFormFactorTablet, isFormFactorDesktop, isFormFactorTouch };
