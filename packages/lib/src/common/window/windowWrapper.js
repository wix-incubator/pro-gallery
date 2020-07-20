import WindowMock from './window.mock';

class WindowWrapper {
  constructor() {
    this.reset();
  }

  windowIsAvailable() {
    try {
      return typeof window !== 'undefined';
    } catch (e) {
      return false;
    }
  }

  reset() {
    this.isMock = !this.windowIsAvailable();
    this.window = this.isMock ? WindowMock : window;
    if (this.isMock) {
      this.window.mockInstanceId = Math.floor(Math.random() * 100000);
    }
  }
}

const windowWrapper = new WindowWrapper();
const _window = windowWrapper.window;

export default _window;
export { windowWrapper };
