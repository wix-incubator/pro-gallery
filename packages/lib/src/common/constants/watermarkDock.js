export default {
  // Not sure this will work
  LEFT_TOP: {
    top: 0,
    left: 0,
    transform: 'translate3d(0,0,0)',
  },
  MIDDLE_TOP: {
    top: 0,
    left: '50%',
    transform: 'translate3d(-50%,0,0)',
  },
  RIGHT_TOP: {
    top: 0,
    left: 'auto',
    right: 0,
    transform: 'translate3d(0,0,0)',
  },
  LEFT_MIDDLE: {
    top: '50%',
    left: 0,
    transform: 'translate3d(0,-50%,0)',
    margin: 0,
  },
  MIDDLE: {
    top: '50%',
    left: '50%',
    transform: 'translate3d(-50%, -50%, 0)',
    margin: 0,
  },
  RIGHT_MIDDLE: {
    top: '50%',
    left: 'auto',
    right: 0,
    transform: 'translate3d(0,-50%,0)',
    margin: 0,
  },
  LEFT_DOWN: {
    top: 'auto',
    bottom: 0,
    left: 0,
    transform: 'translate3d(0,0,0)',
  },
  MIDDLE_DOWN: {
    top: 'auto',
    left: '50%',
    bottom: 0,
    transform: 'translate3d(-50%,0,0)',
  },
  RIGHT_DOWN: {
    top: 'auto',
    left: 'auto',
    right: 0,
    bottom: 0,
    transform: 'translate3d(0,0,0)',
  },
};
