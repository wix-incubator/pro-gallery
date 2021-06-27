import VIDEO_PLAY from '../common/constants/videoPlay';
const styleParamsBuilder = {};

styleParamsBuilder.setVideoPlayOn = function (currentStyles, playOnValue) {
  if (Object.values(VIDEO_PLAY).includes(playOnValue) === false) {
    // TODO: This will be replaced by a type complilication error when migrating to TS
    throw new Error(`invalid value for playOn: ${playOnValue}`);
  }
  currentStyles.item = {
    video: {
      playOn: playOnValue,
    },
  };
  return currentStyles;
};

styleParamsBuilder.getVideoPlayOn = function (currentStyles) {
  return currentStyles.item.video.playOn;
};

export default styleParamsBuilder;
