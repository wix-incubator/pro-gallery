import styleParamsBuilder from '../src/common/styleParamsBuilder';
import { expect } from 'chai';
describe('video playOn', () => {
  const setVideoPlayOn = styleParamsBuilder.setVideoPlayOn;
  it('shoud set playOn when given valid value', () => {
    const currentStyles = {};
    const playOn = 'auto';
    setVideoPlayOn(currentStyles, playOn);
    expect(currentStyles.item.video.playOn).to.equal(playOn);
  });

  it('shoud get playOn current value', () => {
    const playOn = 'auto';
    const currentStyles = {
      item: {
        video: {
          playOn,
        },
      },
    };
    expect(styleParamsBuilder.getVideoPlayOn(currentStyles)).to.equal(playOn);
  });

  it('shoud raise an error when playOn value is not valid', () => {
    const currentStyles = {};
    const playOn = 'auto2';
    expect(setVideoPlayOn.bind(null, currentStyles, playOn)).to.throw(
      `invalid value for playOn: ${playOn}`
    );
  });
});
