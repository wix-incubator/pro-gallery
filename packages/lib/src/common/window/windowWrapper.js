import WindowMock, { hydrateMockMap } from './window.mock';

class WindowWrapper {
  constructor() {
    this.shouldUseMock = true;
    this.initPartialWindoMock = this.initPartialWindoMock.bind(this);
    if (this.windowIsAvailable()) {
      // this will wrap the real window with partial mock for the dimensions
      // once the gallery is mounted we will switch from the mocked properties to the real values
      this.initPartialWindoMock();
    } else {
      this.initMockWindow();
    }
  }

  windowIsAvailable() {
    try {
      return typeof window !== 'undefined';
    } catch (e) {
      return false;
    }
  }

  initPartialWindoMock() {
    hydrateMockMap.forEach((value, key) => {
      const windowPropValue = window[key];
      Object.defineProperty(window, key, {
        get: () => {
          if (this.shouldUseMock) {
            return hydrateMockMap.get(key);
          }
          return windowPropValue;
        },
      });
    });
    this.window = window;
  }
  initMockWindow() {
    this.window = WindowMock;
    this.window.mockInstanceId = Math.floor(Math.random() * 100000);
  }
  stopUsingMock() {
    this.shouldUseMock = false;
  }
  get shouldUseMock() {
    return this._shouldUseMock;
  }
  set shouldUseMock(shouldUseMock) {
    this._shouldUseMock = shouldUseMock;
  }
}

const windowWrapper = new WindowWrapper();
const _window = windowWrapper.window;

export default _window;
export { windowWrapper };
