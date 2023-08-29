import WindowMock, { hydrateMockMap } from './window.mock';

class WindowWrapper {
  constructor() {
    this.shouldUseMock = true;
    this.initProxyWindow = this.initProxyWindow.bind(this);
    if (this.windowIsAvailable()) {
      // this will wrap the real window with partial mock for the dimensions
      // once the gallery is mounted we will switch from the mocked properties to the real values
      this.initProxyWindow();
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

  initProxyWindow() {
    const customWindowPropsSet = new Set();
    const handler = {
      // here the proxy target is the global window object
      get: function (target, property) {
        if (hydrateMockMap.has(property) && this.shouldUseMock) {
          return hydrateMockMap.get(property);
        }
        if (
          typeof target[property] === 'function' &&
          !customWindowPropsSet.has(property)
        ) {
          return target[property].bind(target);
        }
        return target[property];
      }.bind(this),
      // here we push to the custom props Set to know later if we want to bind the prop
      // reflect just assigns the proprty and returns boolean if the assign was successfull
      set: function (target, property, value) {
        customWindowPropsSet.add(property);
        return Reflect.set(target, property, value);
      },
    };
    // eslint-disable-next-line no-undef
    this.window = new Proxy(window, handler);
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
