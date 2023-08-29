import WindowMock, { dimsMock, scrollMock } from './window.mock';

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
    const customWindowProps = [];
    const handler = {
      get: function (target, property) {
        let targetObj = target[property];
        const dimsAndScrollMock = {
          ...dimsMock,
          ...scrollMock,
        };
        if (
          Object.keys(dimsAndScrollMock).includes(property) &&
          this.shouldUseMock
        ) {
          return dimsAndScrollMock[property];
        } else if (
          typeof targetObj == 'function' &&
          !customWindowProps.includes(property)
        ) {
          return target[property].bind(target);
        } else {
          return targetObj;
        }
      }.bind(this),
      set: function (target, property, value) {
        // we don't want to bind properties we set to the window
        customWindowProps.push(property);
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
