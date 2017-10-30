export default class Counter {
  constructor() {
    this._count = 0;
  }

  increment(n = 1) {
    this._count += n;
  }
}
