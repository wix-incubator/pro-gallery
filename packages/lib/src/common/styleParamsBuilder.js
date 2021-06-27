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

export default styleParamsBuilder;
