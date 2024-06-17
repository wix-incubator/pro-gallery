const noop = () => ({});
const width = 2560;
const height = 1440;

export const dimsMock = {
  y: 0,
  x: 0,
  width,
  height,
  innerWidth: width,
  innerHeight: height,
  outerWidth: width,
  outerHeight: height,
  clientWidth: width,
  clientHeight: height,
};

const elem = {
  ...dimsMock,
  getBoundingClientRect: () => dimsMock,
};

const documentMock = {
  addEventListener: noop,
  removeEventListener: noop,
  createEvent: noop,
  getElementById: () => elem,
  getElementsByClassName: () => [elem],
  getElementsByTagName: () => [elem],
  querySelector: () => [elem],
  documentElement: elem,
  activeElement: elem,
  style: dimsMock,
  ...dimsMock,
};

documentMock.body = documentMock;

const locationMock = {
  href: 'http://mock.wix.com/',
  protocol: 'http:',
  host: 'mock.wix.com',
  hostname: 'mock.wix.com',
  port: '',
  pathname: '/',
  search: '',
  hash: '',
};
export const scrollMock = {
  scrollTop: 0,
  scrollY: 0,
};
const windowHydrateMock = {
  ...dimsMock,
  ...scrollMock,
};
const windowMock = {
  isMock: true,
  isSSR: true,
  orientation: 0,
  devicePixelRatio: 1,
  addEventListener: noop,
  removeEventListener: noop,
  createEvent: noop,
  CustomEvent: noop,
  screen: dimsMock,
  open: noop,
  petri: {},
  search: {},
  location: locationMock,
  postMessage: noop,
  requestAnimationFrame: noop,
  dispatchEvent: noop,
  document: documentMock,
  getComputedStyle: noop,
  localStorage: {},
  frames: [],
  ...windowHydrateMock,
};

export const hydrateMockMap = new Map(Object.keys(windowHydrateMock).map((key) => [key, windowHydrateMock[key]]));
windowMock.parent = windowMock;

export default windowMock;
