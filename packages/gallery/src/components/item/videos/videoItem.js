import React from 'react';
import { GALLERY_CONSTS, window, utils, optionsMap } from 'pro-gallery-lib';
import { shouldCreateVideoPlaceholder } from '../itemHelper.js';
import { getStyle } from './getStyle.js';

class VideoItem extends React.Component {
  constructor(props) {
    super(props);

    this.pause = this.pause.bind(this);
    this.play = this.play.bind(this);
    this.playVideoIfNeeded = this.playVideoIfNeeded.bind(this);

    this.state = {
      playedOnce: false,
      loadVideo: props.loadVideo || props.shouldPlay,
      isPlaying: false,
      shouldPlay: props.shouldPlay,
      reactPlayerLoaded: false,
      vimeoPlayerLoaded: false,
      hlsPlayerLoaded: false,
    };
  }

  componentDidMount() {
    this.dynamiclyImportVideoPlayers();
  }

  dynamiclyImportVideoPlayers() {
    if (!(window && window.ReactPlayer)) {
      import(/* webpackChunkName: "proGallery_reactPlayer" */ 'react-player').then((ReactPlayer) => {
        // cjs/esm interop hack
        if (ReactPlayer.default.default) {
          window.ReactPlayer = ReactPlayer.default.default;
        } else {
          window.ReactPlayer = ReactPlayer.default;
        }
        this.setState({ reactPlayerLoaded: true });
        this.playVideoIfNeeded();
      });
    }
    if (
      //Vimeo player must be loaded by us, problem with requireJS
      !(window && window.Vimeo) &&
      this.props.videoUrl &&
      this.props.videoUrl.includes('vimeo.com')
    ) {
      import(/* webpackChunkName: "proGallery_vimeoPlayer" */ '@vimeo/player').then((Player) => {
        window.Vimeo = { Player: Player.default };
        this.setState({ vimeoPlayerLoaded: true });
        this.playVideoIfNeeded();
      });
    }
    if (
      //Hls player must be loaded by us, problem with requireJS
      !(window && window.Hls) &&
      this.isHLSVideo()
    ) {
      import(/* webpackChunkName: "proGallery_HlsPlayer" */ 'hls.js').then((Player) => {
        window.Hls = Player.default;
        this.setState({ hlsPlayerLoaded: true });
        this.playVideoIfNeeded();
      });
    }
  }

  isHLSVideo() {
    return this.props.videoUrl && (this.props.videoUrl.includes('/hls') || this.props.videoUrl.includes('.m3u8'));
  }

  shouldUseHlsPlayer() {
    return this.isHLSVideo() && !utils.isiOS();
  }

  shouldForceVideoForHLS() {
    return this.isHLSVideo() && utils.isiOS();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.shouldPlay || nextProps.firstUserInteractionExecuted) {
      this.setState({ loadVideo: true });
    }

    if (nextProps.shouldPlay) {
      this.setState({ shouldPlay: true });
    }

    this.playVideoIfNeeded(nextProps);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.activeIndex !== this.props.activeIndex) {
      this.fixIFrameTabIndexIfNeeded();
    }

    if (prevProps.type === 'image' && this.props.type === 'video') {
      this.dynamiclyImportVideoPlayers();
    }

    this.playVideoIfNeeded();
  }

  play() {
    this.props.playVideo(this.props.idx);
  }

  pause() {
    this.props.pauseVideo();
  }

  playVideoIfNeeded(props = this.props) {
    try {
      const { shouldPlay } = props;
      if (shouldPlay && !this.isPlaying) {
        this.videoElement =
          this.videoElement || window.document.querySelector(`#video-${this.props.id}-${this.props.galleryId} video`);
        if (this.videoElement) {
          this.isPlaying = true;
          this.videoElement.play();
          utils.isVerbose() && console.log('[VIDEO] Playing video #' + this.props.idx, this.videoElement);
        }
      }
    } catch (e) {
      console.error('[VIDEO] Could not play video #' + this.props.idx, this.videoElement, e);
    }
  }
  //-----------------------------------------| UTILS |--------------------------------------------//
  createPlayerElement() {
    //video dimensions are for videos in grid fill - placing the video with negative margins to crop into a square
    if (!(window && window.ReactPlayer && (this.state.loadVideo || this.props.playing))) {
      return null;
    }
    const PlayerElement = window.ReactPlayer;
    const isWiderThenContainer = this.props.style.ratio >= this.props.cropRatio;

    // adding 1 pixel to compensate for the difference we have sometimes from layouter in grid fill
    const isCrop =
      this.props.options[optionsMap.layoutParams.crop.enable] &&
      this.props.options[optionsMap.layoutParams.crop.method] ===
        GALLERY_CONSTS[optionsMap.layoutParams.crop.method].FILL;

    const url = this.props.videoUrl
      ? this.props.videoUrl
      : this.props.createUrl(GALLERY_CONSTS.urlSizes.RESIZED, GALLERY_CONSTS.urlTypes.VIDEO);

    const attributes = {
      controlsList: 'nodownload',
      disablePictureInPicture: true,
      muted: !this.props.options[optionsMap.behaviourParams.item.video.volume],
      preload: 'metadata',
      style: getStyle(isCrop, isWiderThenContainer),
      type: 'video/mp4',
    };

    if (shouldCreateVideoPlaceholder(this.props.options)) {
      attributes.poster = this.props.createUrl(GALLERY_CONSTS.urlSizes.SCALED, GALLERY_CONSTS.urlTypes.HIGH_RES);
    }

    return (
      <PlayerElement
        playsinline
        className={'gallery-item-visible video gallery-item'}
        id={`video-${this.props.id}-${this.props.galleryId}`}
        width="100%"
        height="100%"
        url={url}
        alt={typeof this.props.alt === 'string' ? this.props.alt : 'untitled video'}
        loop={!!this.props.options[optionsMap.behaviourParams.item.video.loop]}
        ref={(player) => (this.video = player)}
        volume={this.props.options[optionsMap.behaviourParams.item.video.volume] ? 0.8 : 0}
        playing={this.state.shouldPlay}
        onEnded={() => {
          this.setState({ isPlaying: false });
          this.props.actions.eventsListener(GALLERY_CONSTS.events.VIDEO_ENDED, this.props);
        }}
        onPause={() => {
          this.setState({ isPlaying: false });
        }}
        onError={(e) => {
          this.props.actions.eventsListener(GALLERY_CONSTS.events.VIDEO_ERROR, {
            ...this.props,
            videoError: e,
          });
        }}
        playbackRate={Number(this.props.options[optionsMap.behaviourParams.item.video.speed]) || 1}
        onStart={() => {
          if (!this.state.playedOnce) {
            this.setState({ playedOnce: true });
          }
        }}
        onPlay={() => {
          this.props.actions.eventsListener(GALLERY_CONSTS.events.VIDEO_PLAYED, this.props);
          this.setState({ isPlaying: true });
        }}
        onReady={() => {
          this.playVideoIfNeeded();
          this.fixIFrameTabIndexIfNeeded();
          this.props.actions.setItemLoaded();
          this.setState({ ready: true });
        }}
        onProgress={() => {
          if (!this.props.shouldPlay) {
            this.setState({ shouldPlay: false });
          }
        }}
        controls={this.props.options[optionsMap.behaviourParams.item.video.enableControls]}
        config={{
          file: {
            attributes,
            forceHLS: this.shouldUseHlsPlayer(),
            forceVideo: this.shouldForceVideoForHLS(),
          },
        }}
        key={'video-' + this.props.id}
      />
    );
  }

  fixIFrameTabIndexIfNeeded() {
    if (this.props.isExternalVideo) {
      const videoGalleryItem =
        window.document && window.document.getElementById(`video-${this.props.id}-${this.props.galleryId}`);
      const videoIFrames = videoGalleryItem && videoGalleryItem.getElementsByTagName('iframe');
      const videoIFrame = videoIFrames && videoIFrames[0];
      if (videoIFrame) {
        if (this.props.activeIndex === this.props.idx) {
          videoIFrame.setAttribute('tabIndex', '0');
        } else {
          videoIFrame.setAttribute('tabIndex', '-1');
        }
      }
    }
  }

  getVideoContainerStyles() {
    const videoContainerStyle = {
      ...this.props.imageDimensions,
    };
    if (utils.deviceHasMemoryIssues() || this.state.ready || !shouldCreateVideoPlaceholder(this.props.options)) {
      // videoContainerStyle.backgroundColor = 'black';
    } else {
      videoContainerStyle.backgroundImage = `url(${this.props.createUrl(
        GALLERY_CONSTS.urlSizes.RESIZED,
        GALLERY_CONSTS.urlTypes.HIGH_RES
      )})`;
    }
    return videoContainerStyle;
  }

  //-----------------------------------------| RENDER |--------------------------------------------//

  render() {
    const { thumbnail, hover } = this.props;
    let baseClassName = [
      'gallery-item-content',
      'gallery-item-visible',
      'gallery-item-preloaded',
      'gallery-item-video',
      'gallery-item',
      'video-item',
    ];
    if (utils.isiPhone()) {
      baseClassName.push('ios');
    }
    if (this.state.isPlaying) {
      baseClassName.push('playing');
    }
    if (this.state.playedOnce && this.state.ready) {
      baseClassName.push('playedOnce');
    }
    if (this.props.isCurrentHover) {
      baseClassName.push('item-content-hover');
    } else {
      baseClassName.push('item-content-regular');
    }
    // eslint-disable-next-line no-unused-vars
    const video = (
      <div
        className={baseClassName.join(' ')}
        data-hook="video_container-video-player-element"
        key={'video_container-' + this.props.id}
        style={this.getVideoContainerStyles()}
      >
        {this.createPlayerElement()}
        {this.state.isPlaying ? null : this.props.videoPlayButton}
      </div>
    );

    return (
      <div key={'video-and-hover-container' + this.props.idx}>
        {video}
        {shouldCreateVideoPlaceholder(this.props.options) && thumbnail}
        {hover}
      </div>
    );
  }
}

export default VideoItem;
