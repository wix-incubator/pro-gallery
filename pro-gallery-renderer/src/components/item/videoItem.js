import React from 'react';
import ReactPlayer from 'react-player-fork';
import utils from '../../utils';
import _ from 'lodash';

//import ReactPlayer from '../../../../../react-player';

class VideoItem extends React.Component {

  constructor(props) {
    super(props);

    this.pause = this.pause.bind(this);
    this.play = this.play.bind(this);
    this.state = {
      playedOnce: false,
      playing: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.playing) {
      this.setState({playedOnce: true});
    }
  }

  play() {
    this.props.playVideo(this.props.idx);
  }

  pause() {
    this.props.pauseVideo();
  }

  // if we use this function again we need to see if jquery still exists in the project
  //
  // drawFrame(video, canvas) {
  //   const vWidth = video.videoWidth;
  //   const vHeight = video.videoHeight;
  //   const cWidth = $(video).width();
  //   const cHeight = $(video).height();
  //   let w = cWidth;
  //   let h = cHeight;
  //   if (vWidth > w || vHeight > h) {
  //     if (vWidth / w > vHeight / h) {
  //       h = (w / vWidth) * vHeight;
  //     }
  //     else {
  //       w = (h / vHeight) * vWidth;
  //     }
  //   }
  //
  //   $(canvas).width(cWidth);
  //   $(canvas).height(cHeight);
  //   canvas.width = cWidth;
  //   canvas.height = cHeight;
  //
  //   const context = canvas.getContext('2d');
  //   context.drawImage(video, (cWidth - w) / 2, (cHeight - h) / 2, w, h);
  //   $(canvas).css($(video).css('transform'));
  //   $(canvas).show();
  // }

  //-----------------------------------------| UTILS |--------------------------------------------//

  createPlayerElement() {
    //video dimensions are for videos in grid fill - placing the video with negative margins to crop into a square
    const isWiderThenContainer = this.props.style.ratio >= this.props.cubeRatio;

    const videoDimensionsCss = {
      width: isWiderThenContainer ? '100%' : 'auto',
      height: isWiderThenContainer ? 'auto' : '100%',
    };

    if (this.props.styleParams.cubeImages && this.props.styleParams.cubeType === 'fill') { //grid crop mode
      [videoDimensionsCss.width, videoDimensionsCss.height] = [videoDimensionsCss.height, videoDimensionsCss.width];
      videoDimensionsCss.position = 'absolute';
      videoDimensionsCss.margin = 'auto';
      videoDimensionsCss.minHeight = '100%';
      videoDimensionsCss.minWidth = '100%';
      videoDimensionsCss.left = '-100%';
      videoDimensionsCss.right = '-100%';
      videoDimensionsCss.top = '-100%';
      videoDimensionsCss.bottom = '-100%';
      // if (isWiderThenContainer) {
      //   videoDimensionsCss['marginLeft'] =  ;
      // } else {
      //   videoDimensionsCss['marginTop'] = Math.round((this.props.style.width / this.props.style.ratio - this.props.style.height) / -2);
      // }
    }
    return <ReactPlayer
      className={'gallery-item-visible video gallery-item'}
      width="100%"
      height="100%"
      onReady={this.props.actions.setItemLoaded}
      url={this.props.videoUrl ? this.props.videoUrl : this.props.resized_url.mp4}
      loop={!!this.props.styleParams.videoLoop}
      ref={player => this.video = player}
      volume={0}
      playing={this.props.playing}
      poster={this.props.resized_url.img}
      mockPlayer={!this.state.playedOnce && (this.props.isExternalVideo || utils.isMobile())}
      onEnded={() => {
        this.setState({playing: false});
        this.props.onEnd();
      }}
      onPause={() => {
        this.setState({playing: false});
      }}
      playbackRate={this.props.styleParams.videoSpeed || 1}
      onPlay={() => {
        this.setState({playing: true});
      }}
      fileConfig={
      {
        attributes: {
          preload: 'metadata',
          poster: this.props.resized_url.img,
          style: videoDimensionsCss
        }
      }
      }
      key={'video-' + this.props.id}
    />;
  }

  createImageElement() {
    return <img onLoad={this.props.actions.setItemLoaded}
                onError={this.props.actions.setItemError}
                key={'image-' + this.props.id}
                className={'gallery-item-hidden gallery-item-visible gallery-item ' + (this.props.loadingStatus.loaded ? ' loaded ' : '') + (this.props.loadingStatus.failed ? ' failed ' : '')}
                src={this.props.resized_url.img}
                style={this.props.imageDimensions}/>;
  }

  componentDidMount() {
    this.props.onMount(this);
  }

  componentWillUnmount() {
    this.props.onUnmount();
  }

  //-----------------------------------------| RENDER |--------------------------------------------//

  render() {
    let baseClassName = 'gallery-item-visible gallery-item-preloaded gallery-item-video gallery-item' + (utils.isiPhone() ? ' ios' : '') + (this.props.loaded ? 'loaded' : '');
    if (this.state.playing) {
      baseClassName += ' playing';
    }
    const videoControls = this.props.hidePlay ? false : [
      <i key="play-triangle" className={'gallery-item-video-play-triangle progallery-svg-font-icons-play-triangle '}/>,
      <i key="play-bg" className={'gallery-item-video-play-background progallery-svg-font-icons-play-background '}/>
    ];

    const videoPreloader = <div className="pro-circle-preloader" key={'video-preloader-' + this.props.idx}/>;

    const {videoPlay, itemClick} = this.props.styleParams;
    const canVideoPlayInGallery = utils.isMobile() ? itemClick !== 'expend' : !(itemClick === 'expend' && videoPlay === 'onClick');
    const video = canVideoPlayInGallery ? (
      <div
          className={baseClassName + ' animated fadeIn '}
          key={'video_container-' + this.props.id}
          style={_.merge(this.props.loaded || utils.deviceHasMemoryIssues() ? {} : {backgroundImage: `url(${this.props.resized_url.thumb})`}, this.props.imageDimensions)}
        >
          {this.createPlayerElement()}
          {videoControls}
          {videoPreloader}
        </div>
    ) : (
      <div
          className={baseClassName}
          key={'video_container-' + this.props.id}
          style={this.props.loaded || utils.deviceHasMemoryIssues() ? {} : {backgroundImage: `url(${this.props.resized_url.thumb})`}}
        >
          {this.createImageElement()}
          {videoControls}
          {videoPreloader}
        </div>
    );

    const hover = this.props.hover;

    return <div key={'video-and-hover-container' + this.props.idx}
    >{[video, hover]}</div>;
  }
}

export default VideoItem;
