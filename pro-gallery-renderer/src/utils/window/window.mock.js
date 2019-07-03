const noop = () => ({});
const width = 2560;
const height = 1440;

const dims = {
  y: 0,
  x: 0,
  width,
  height,
  innerWidth: width,
  innerHeight: height,
  clientWidth: width,
  clientHeight: height,
};

const elem = {
  ...dims,
  getBoundingClientRect: () => dims,
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
  style: dims,
  ...dims,
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

const windowMock = {
  isMock: true,
  isSSR: true,
  orientation: 0,
  devicePixelRatio: 1,
  scrollTop: 0,
  addEventListener: noop,
  removeEventListener: noop,
  createEvent: noop,
  CustomEvent: noop,
  screen: dims,
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
  ...dims,
};

windowMock.parent = windowMock;

export default windowMock;
