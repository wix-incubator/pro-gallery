import React from 'react';
import utils from '../../../common/utils';
import window from '../../../common/window/windowWrapper';
import { GalleryComponent } from '../../galleryComponent';
import EVENTS from '../../../common/constants/events';
import { URL_TYPES, URL_SIZES } from '../../../common/constants/urlTypes';
import PlayBackground from '../../svgs/components/play_background';
import PlayTriangle from '../../svgs/components/play_triangle';

class VideoItem extends GalleryComponent {
  constructor(props) {
    super(props);

    this.pause = this.pause.bind(this);
    this.play = this.play.bind(this);
    this.state = {
      playedOnce: false,
      playing: false,
      reactPlayerLoaded: false,
      vimeoPlayerLoaded: false,
    };
  }

  componentDidMount() {
    if (!(window && window.ReactPlayer)) {
      import('react-player').then(ReactPlayer => {
        window.ReactPlayer = ReactPlayer.default;
        this.setState({ reactPlayerLoaded: true });
      });
    }
    if (
      //Vimeo player must be loaded by us, problem with requireJS
      !(window && window.Vimeo) &&
      this.props.videoUrl &&
      this.props.videoUrl.includes('vimeo.com')
    ) {
      import('@vimeo/player').then(Player => {
        window.Vimeo = { Player: Player.default };
        this.setState({ vimeoPlayerLoaded: true });
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.playing) {
      this.setState({ playedOnce: true });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentIdx !== this.props.currentIdx) {
      this.fixIFrameTabIndexIfNeeded();
    }
  }

  play() {
    this.props.playVideo(this.props.idx);
  }

  pause() {
    this.props.pauseVideo();
  }

  //-----------------------------------------| UTILS |--------------------------------------------//
  createPlayerElement() {
    //video dimensions are for videos in grid fill - placing the video with negative margins to crop into a square
    if (!(window && window.ReactPlayer)) {
      return null;
    }
    const PlayerElement = window.ReactPlayer;
    const isWiderThenContainer = this.props.style.ratio >= this.props.cubeRatio;

    const videoDimensionsCss = {
      width: isWiderThenContainer ? '100%' : 'auto',
      height: isWiderThenContainer ? 'auto' : '100%',
      opacity: this.props.loadingStatus ? '1' : '0',
    };

    if (
      this.props.styleParams.cubeImages &&
      this.props.styleParams.cubeType === 'fill'
    ) {
      //grid crop mode
      [videoDimensionsCss.width, videoDimensionsCss.height] = [
        videoDimensionsCss.height,
        videoDimensionsCss.width,
      ];
      videoDimensionsCss.position = 'absolute';
      videoDimensionsCss.margin = 'auto';
      videoDimensionsCss.minHeight = '100%';
      videoDimensionsCss.minWidth = '100%';
      videoDimensionsCss.left = '-100%';
      videoDimensionsCss.right = '-100%';
      videoDimensionsCss.top = '-100%';
      videoDimensionsCss.bottom = '-100%';
    }
    const url = this.props.videoUrl
      ? this.props.videoUrl
      : this.props.createUrl(URL_SIZES.RESIZED, URL_TYPES.VIDEO);
    return (
      <PlayerElement
        className={'gallery-item-visible video gallery-item'}
        id={`video-${this.props.id}`}
        width="100%"
        height="100%"
        url={url}
        alt={this.props.alt ? this.props.alt : 'untitled video'}
        loop={!!this.props.styleParams.videoLoop}
        ref={player => (this.video = player)}
        volume={this.props.styleParams.videoSound ? 0.8 : 0}
        playing={this.props.playing}
        onEnded={() => {
          this.setState({ playing: false });
          this.props.actions.eventsListener(EVENTS.VIDEO_ENDED, this.props);
        }}
        onPause={() => {
          this.setState({ playing: false });
        }}
        playbackRate={Number(this.props.styleParams.videoSpeed) || 1}
        onPlay={() => {
          this.setState({ playing: true });
        }}
        onReady={() => {
          this.fixIFrameTabIndexIfNeeded();
          this.props.actions.setItemLoaded();
        }}
        config={{
          file: {
            attributes: {
              muted: !this.props.styleParams.videoSound,
              preload: 'metadata',
              poster: this.props.createUrl(
                URL_SIZES.RESIZED,
                URL_TYPES.HIGH_RES,
              ),
              style: videoDimensionsCss,
              type: 'video/mp4',
            },
          },
        }}
        key={'video-' + this.props.id}
      />
    );
  }

  fixIFrameTabIndexIfNeeded() {
    if (this.props.isExternalVideo) {
      const videoGalleryItem =
        window.document &&
        window.document.getElementById(`video-${this.props.id}`);
      const videoIFrames =
        videoGalleryItem && videoGalleryItem.getElementsByTagName('iframe');
      const videoIFrame = videoIFrames && videoIFrames[0];
      if (videoIFrame) {
        if (this.props.currentIdx === this.props.idx) {
          videoIFrame.setAttribute('tabIndex', '0');
        } else {
          videoIFrame.setAttribute('tabIndex', '-1');
        }
      }
    }
  }

  createImageElement() {
    return (
      <img
        ref={img => {
          // onLoad replacement for SSR
          if (!img) {
            return;
          }
          img.onload = this.props.actions.setItemLoaded; //initializing onLoad for further calls
          if (img.complete && !this.props.loadingStatus.loaded) {
            this.props.actions.setItemLoaded(); //first call, will not be called again because if it was called once loadingStatus.loaded will be true
          }
        }}
        onError={this.props.actions.setItemError}
        key={'image-' + this.props.id}
        alt={this.props.alt ? this.props.alt : 'untitled video'}
        className={
          'gallery-item-hidden gallery-item-visible gallery-item ' +
          (this.props.loadingStatus.loaded ? ' gallery-item-loaded ' : '') +
          (this.props.loadingStatus.failed ? ' failed ' : '')
        }
        src={this.props.createUrl(URL_SIZES.RESIZED, URL_TYPES.HIGH_RES)}
      />
    );
  }

  canVideoPlayInGallery(itemClick, videoPlay) {
    if (
      utils.isMobile() &&
      itemClick !== 'expand' &&
      itemClick !== 'fullscreen'
    )
      return true;
    else if (
      !utils.isMobile() &&
      itemClick !== 'expand' &&
      itemClick !== 'fullscreen'
    )
      return true;
    else if (!utils.isMobile() && videoPlay !== 'onClick') return true;
    else return false;
  }
  shouldRenderVideo() {
    if (
      !this.state.playedOnce &&
      (this.props.isExternalVideo || utils.isMobile())
    ) {
      return false;
    }
    return true;
  }
  //-----------------------------------------| RENDER |--------------------------------------------//

  render() {
    let baseClassName =
      'gallery-item-content gallery-item-visible gallery-item-preloaded gallery-item-video gallery-item' +
      (utils.isiPhone() ? ' ios' : '') +
      (this.props.loadingStatus.loaded ? ' gallery-item-loaded ' : '');
    if (this.state.playing) {
      baseClassName += ' playing';
    }
    const videoControls = this.props.hidePlay
      ? false
      : [
          <i
            key="play-triangle"
            data-hook="play-triangle"
            className={
              'gallery-item-video-play-triangle play-triangle '
            }
          ><PlayTriangle/></i>,
          <i
            key="play-bg"
            data-hook="play-background"
            className={
              'gallery-item-video-play-background play-background '
            }
          ><PlayBackground/></i>,
        ];

    const videoPreloader = (
      <div
        className="pro-circle-preloader"
        key={'video-preloader-' + this.props.idx}
      />
    );
    const { marginLeft, marginTop, ...restOfDimensions } =
      this.props.imageDimensions || {};
    const { videoPlay, itemClick } = this.props.styleParams;
    const video =
      this.canVideoPlayInGallery(itemClick, videoPlay) &&
      this.shouldRenderVideo() ? (
        <div
          className={baseClassName + ' animated fadeIn '}
          data-hook="video_container-video-player-element"
          key={'video_container-' + this.props.id}
          style={
            utils.deviceHasMemoryIssues()
              ? {}
              : {
                  backgroundImage: `url(${this.props.createUrl(
                    URL_SIZES.RESIZED,
                    URL_TYPES.LOW_RES,
                  )})`,
                  ...restOfDimensions,
                }
          }
        >
          {this.createPlayerElement()}
          {videoControls}
          {videoPreloader}
        </div>
      ) : (
        <div
          className={baseClassName}
          data-hook="video_container-image-element"
          key={'video_container-' + this.props.id}
          style={{
            backgroundImage: `url(${this.props.createUrl(
              URL_SIZES.RESIZED,
              URL_TYPES.HIGH_RES,
            )})`,
            ...restOfDimensions,
          }}
        >
          {this.createImageElement()}
          {videoControls}
          {videoPreloader}
        </div>
      );

    const hover = this.props.hover;

    return (
      <div key={'video-and-hover-container' + this.props.idx}>
        {[video, hover]}
      </div>
    );
  }
}

export default VideoItem;
