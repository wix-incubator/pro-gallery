import VIEW_MODE from '../constants/viewMode';

class ViewModeWrapper {
  constructor() {
    this.setViewMode = this.setViewMode.bind(this);
    this.isSiteMode = this.isSiteMode.bind(this);
    this.isEditMode = this.isEditMode.bind(this);
    this.isPreviewMode = this.isPreviewMode.bind(this);
    this.isSEOMode = this.isSEOMode.bind(this);
    this._viewMode = VIEW_MODE.SITE;
  }

  setViewMode(viewMode) {
    this._viewMode = viewMode;
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

export { viewModeWrapper, isSiteMode, isEditMode, isPreviewMode, isSEOMode };
