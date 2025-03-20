import React from 'react';
import { GALLERY_CONSTS, window, utils } from 'pro-gallery-lib';
import { shouldCreateVideoPlaceholder } from '../itemHelper';
import { getStyle } from './getStyle';

class VideoItem extends React.Component {
  constructor(props) {
    super(props);

    this.pause = this.pause.bind(this);
    this.play = this.play.bind(this);
    this.playVideoIfNeeded = this.playVideoIfNeeded.bind(this);
    this.isCompMounted = false;

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
    this.isCompMounted = true;
    this.dynamiclyImportVideoPlayers();
  }
  componentWillUnmount() {
    this.isCompMounted = false;
  }

  UNSAFE_componentWillMount() {
    if (this.props.options.videoPlay === 'auto') {
      this.dynamiclyImportVideoPlayers();
    }
  }

  dynamiclyImportVideoPlayers() {
    if (!(window && window.ReactPlayer)) {
      import(
        /* webpackChunkName: "proGallery_reactPlayer" */ 'react-player'
      ).then((ReactPlayer) => {
        window.ReactPlayer = ReactPlayer.default;
        if (this.isCompMounted) {
          this.setState({ reactPlayerLoaded: true });
          this.playVideoIfNeeded();
        }
      });
    }
    if (
      //Vimeo player must be loaded by us, problem with requireJS
      !(window && window.Vimeo) &&
      this.props.videoUrl &&
      this.props.videoUrl.includes('vimeo.com')
    ) {
      import(
        /* webpackChunkName: "proGallery_vimeoPlayer" */ '@vimeo/player'
      ).then((Player) => {
        window.Vimeo = { Player: Player.default };
        if (this.isCompMounted) {
          this.setState({ vimeoPlayerLoaded: true });
          this.playVideoIfNeeded();
        }
      });
    }
    if (
      //Hls player must be loaded by us, problem with requireJS
      !(window && window.Hls) &&
      this.isHLSVideo()
    ) {
      {
        import(/* webpackChunkName: "proGallery_HlsPlayer" */ 'hls.js').then(
          (Player) => {
            window.Hls = Player.default;
            if (this.isCompMounted) {
              this.setState({ hlsPlayerLoaded: true });
              this.playVideoIfNeeded();
            }
          }
        );
      }
    }
  }

  isHLSVideo() {
    return (
      this.props.videoUrl &&
      (this.props.videoUrl.includes('/hls') ||
        this.props.videoUrl.includes('.m3u8'))
    );
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

  isPrefersReducedMotion() {
    return (
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  playVideoIfNeeded(props = this.props) {
    try {
      const { playingVideoIdx } = props;
      if (
        playingVideoIdx === this.props.idx &&
        !this.isPlaying &&
        !this.isPrefersReducedMotion()
      ) {
        this.videoElement =
          this.videoElement ||
          window.document.querySelector(`#video-${this.props.id} video`);
        if (this.videoElement) {
          this.isPlaying = true;
          this.videoElement.play();
          utils.isVerbose() &&
            console.log(
              '[VIDEO] Playing video #' + this.props.idx,
              this.videoElement
            );
        }
      }
    } catch (e) {
      console.error(
        '[VIDEO] Could not play video #' + this.props.idx,
        this.videoElement,
        e
      );
    }
  }
  //-----------------------------------------| UTILS |--------------------------------------------//
  createPlayerElement() {
    //video dimensions are for videos in grid fill - placing the video with negative margins to crop into a square
    if (
      !(
        window &&
        window.ReactPlayer &&
        (this.state.loadVideo || this.props.playing)
      )
    ) {
      return null;
    }
    const PlayerElement = window.ReactPlayer;
    const isWiderThenContainer = this.props.style.ratio >= this.props.cropRatio;

    // adding 1 pixel to compensate for the difference we have sometimes from layouter in grid fill
    const isCrop =
      this.props.options.cubeImages && this.props.options.cubeType === 'fill';

    const url = this.props.videoUrl
      ? this.props.videoUrl
      : this.props.createUrl(
          GALLERY_CONSTS.urlSizes.RESIZED,
          GALLERY_CONSTS.urlTypes.VIDEO
        );

    const attributes = {
      controlsList: 'nodownload',
      disablePictureInPicture: true,
      muted: !this.props.options.videoSound,
      preload: 'metadata',
      style: getStyle(isCrop, isWiderThenContainer),
      type: 'video/mp4',
    };

    if (shouldCreateVideoPlaceholder(this.props.options)) {
      attributes.poster = this.props.createUrl(
        GALLERY_CONSTS.urlSizes.SCALED,
        GALLERY_CONSTS.urlTypes.HIGH_RES
      );
    }

    return (
      <PlayerElement
        playsinline
        className={'gallery-item-visible video gallery-item'}
        id={`video-${this.props.id}`}
        width="100%"
        height="100%"
        url={url}
        alt={
          typeof this.props.alt === 'string' ? this.props.alt : 'untitled video'
        }
        loop={!!this.props.options.videoLoop}
        ref={(player) => (this.video = player)}
        volume={this.props.options.videoSound ? 0.8 : 0}
        playing={this.state.shouldPlay && !this.isPrefersReducedMotion()}
        onEnded={() => {
          this.setState({ isPlaying: false });
          this.props.actions.eventsListener(
            GALLERY_CONSTS.events.VIDEO_ENDED,
            this.props
          );
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
        playbackRate={Number(this.props.options.videoSpeed) || 1}
        onStart={() => {
          if (!this.state.playedOnce) {
            this.setState({ playedOnce: true });
          }
        }}
        onPlay={() => {
          this.props.actions.eventsListener(
            GALLERY_CONSTS.events.VIDEO_PLAYED,
            this.props
          );
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
        controls={this.props.options.showVideoControls}
        config={{
          file: {
            attributes,
            forceHLS: this.shouldUseHlsPlayer(),
            forceVideo: this.shouldForceVideoForHLS(),
            hlsOptions: {
              startLevel: 2,
              testBandwidth: false,
              abrEwmaDefaultEstimate: 7000000,
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
    if (
      utils.deviceHasMemoryIssues() ||
      this.state.ready ||
      !shouldCreateVideoPlaceholder(this.props.options)
    ) {
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
    const { videoPlaceholder, hover } = this.props;
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
        {this.state.isPlaying
          ? this.props.videoPauseButton
          : this.props.videoPlayButton}
      </div>
    );

    return (
      <div key={'video-and-hover-container' + this.props.idx}>
        {video}
        {shouldCreateVideoPlaceholder(this.props.options) && videoPlaceholder}
        {hover}
      </div>
    );
  }
}

export default VideoItem;
