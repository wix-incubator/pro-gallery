class LayoutsStore {
  set layout(_layout) {
    this._layout = {..._layout};
  }

  get layout() {
    return this._layout;
  }
}

export default new LayoutsStore();
