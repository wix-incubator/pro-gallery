import React from 'react';
import utils from '../../utils/index.js';
import window from '../../utils/window/windowWrapper';
import { GalleryComponent } from '../galleryComponent';

class GalleryDebugMessage extends GalleryComponent {
  render() {
    if (utils.getTopUrlParam('pgdebug') !== 'true') {
      return false;
    }

    const version = (
      <div className="version-header ">
        Pro Gallery Version #{window.staticsVersion}
      </div>
    );

    let parentSize = '';
    try {
      parentSize =
        ' psw' +
        window.top.screen.width +
        ' piw' +
        window.top.innerWidth +
        ' pbw' +
        window.top.document.body.clientWidth;
    } catch (e) {
      //not on the domain
    }

    const debugMsg = (
      <div className="version-header ">
        {utils.isLandscape() ? 'land' : 'port'} sw{window.screen.width}
        sh{window.screen.height} iw{window.innerWidth} bw
        {window.document.body.clientWidth} sr{utils.getViewportScaleRatio()}
        rc{this.props.resizeCount} oc{this.props.orientationCount} nh
        {this.props.newHeight} lh{this.props.lastHeight}
        {parentSize}
        www{this.props.maxGalleryWidth}
      </div>
    );

    return (
      <div>
        {version}
        {debugMsg}
      </div>
    );
  }
}

export default GalleryDebugMessage;
