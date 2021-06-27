import VIDEO_PLAY from '../common/constants/videoPlay';
import _ from './lodash.custom';
const styleParamsBuilder = {};

const playOnPath = 'item.video.playOn';
styleParamsBuilder.setVideoPlayOn = function (currentStyles, playOnValue) {
  if (Object.values(VIDEO_PLAY).includes(playOnValue) === false) {
    // TODO: This will be replaced by a type complilication error when migrating to TS
    throw new Error(`invalid value for playOn: ${playOnValue}`);
  }
  _.set(currentStyles, playOnPath, playOnValue);
  return currentStyles;
};

styleParamsBuilder.getVideoPlayOn = function (currentStyles) {
  return _.get(currentStyles, playOnPath);
};

export default styleParamsBuilder;
