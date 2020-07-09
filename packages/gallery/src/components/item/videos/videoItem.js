import React from 'react';
import utils from '../../../common/utils';
import window from '../../../common/window/windowWrapper';
import { GalleryComponent } from '../../galleryComponent';
import EVENTS from '../../../common/constants/events';
import { URL_TYPES, URL_SIZES } from '../../../common/constants/urlTypes';
import PlayBackground from '../../svgs/components/play_background';
import PlayTriangle from '../../svgs/components/play_triangle';
import VideoItemPlaceholder from './videoItemPlaceholder'


const videoControls = 
    [
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

class VideoItem extends GalleryComponent {
  constructor(props) {
    super(props);
    
    this.pause = this.pause.bind(this);
    this.play = this.play.bind(this);
    this.playVideoIfNeeded = this.playVideoIfNeeded.bind(this);
    this.canVideoPlayInGallery = this.canVideoPlayInGallery.bind(this);
    this.createVideoItemPlaceholder = this.createVideoItemPlaceholder.bind(this);

    this.state = {
      playedOnce: false,
      playing: false,
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
      import(/* webpackChunkName: "reactPlayer" */ 'react-player').then(ReactPlayer => {
        window.ReactPlayer = ReactPlayer.default;
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
      import(/* webpackChunkName: "vimeoPlayer" */ '@vimeo/player').then(Player => {
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
      import(/* webpackChunkName: "HlsPlayer" */ 'hls.js').then(Player => {
        window.Hls =  Player.default;
        this.setState({ hlsPlayerLoaded: true });
        this.playVideoIfNeeded();
      });
    }
  }
  
  isHLSVideo(){
    return  this.props.videoUrl && (this.props.videoUrl.includes('/hls') || this.props.videoUrl.includes('.m3u8'));
  }
  shouldUseHlsPlayer(){
    return  this.isHLSVideo() && !utils.isiOS()
  }

  shouldForceVideoForHLS(){
    return this.isHLSVideo() && utils.isiOS();
  }

  canVideoPlayInGallery() {
    const { videoPlay, itemClick } = this.props.styleParams;
    const { hasLink } = this.props;
    if( this.props.idx === this.props.playingVideoIdx ||
      this.props.idx === this.props.nextVideoIdx) {
      if (
        videoPlay === 'hover' || videoPlay === 'auto'
      ) { return true; } else if (
        itemClick === 'nothing'
      ) { return true; } else if (
        itemClick === 'link' && !hasLink
      ) { return true; }
    }
    return false;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.playing) {
      this.setState({ playedOnce: true });
    }

    this.playVideoIfNeeded(nextProps);

  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentIdx !== this.props.currentIdx) {
      this.fixIFrameTabIndexIfNeeded();
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
      const {playingVideoIdx} = props;
      if (playingVideoIdx === this.props.idx && !this.isPlaying) {
        this.videoElement = this.videoElement || window.document.querySelector(`#video-${this.props.id} video`);
        if (this.videoElement) {
          this.isPlaying = true;
          this.videoElement.play();
          utils.isVerbose() && console.log('[VIDEO] Playing video #' + this.props.idx, this.videoElement)
        }
      }
    } catch (e) {
      console.error('[VIDEO] Could not play video #' + this.props.idx, this.videoElement, e);
    }
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
          this.playVideoIfNeeded();
          this.fixIFrameTabIndexIfNeeded();
          this.props.actions.setItemLoaded();
          this.setState({ ready: true });
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
              forceHLS: this.shouldUseHlsPlayer(),
              forceVideo: this.shouldForceVideoForHLS(),
          },
        }}
        key={'video-' + this.props.id}
      />
    );
  }

  createVideoItemPlaceholder(showVideoControls) {
    const props = utils.pick(this.props, [
      'alt',
      'title',
      'description',
      'id',
      'idx',
      'styleParams',
      'createUrl',
      'settings',
      'lazyLoad',
      'actions'
    ]);

    return <VideoItemPlaceholder
        {...props}
        key="videoPlaceholder"
        imageDimensions={this.props.imageDimensions}
        isThumbnail={!!this.props.thumbnailHighlightId}
        id={this.props.idx}
        videoControls={showVideoControls && videoControls}
      />
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

  //-----------------------------------------| RENDER |--------------------------------------------//

  render() {
    
    const hover = this.props.hover;
    const showVideoControls = !this.props.hidePlay && this.props.styleParams.showVideoPlayButton;

    if((this.props.type ==='video' && !this.canVideoPlayInGallery()) || this.props.isVideoPlaceholder) {
      const videoPlaceholder = this.createVideoItemPlaceholder(showVideoControls)
      return [videoPlaceholder, hover]
    }  
    
    let baseClassName =
      'gallery-item-content gallery-item-visible gallery-item-preloaded gallery-item-video gallery-item video-item' +
      (utils.isiPhone() ? ' ios' : '');
    if (this.state.playing) {
      baseClassName += ' playing';
    }
    const videoPreloader = (
      <div
      className="pro-circle-preloader"
        key={'video-preloader-' + this.props.idx}
      />
    );
    const { marginLeft, marginTop, ...restOfDimensions } =
      this.props.imageDimensions || {};
    const video =
      (
        <div
          className={baseClassName + ' animated fadeIn '}
          data-hook="video_container-video-player-element"
          key={'video_container-' + this.props.id}
          style={
            utils.deviceHasMemoryIssues() || this.state.ready
              ? {backgroundColor: 'black'}
              : {
                  backgroundImage: `url(${this.props.createUrl(
                    URL_SIZES.RESIZED,
                    URL_TYPES.HIGH_RES,
                  )})`,
                  ...restOfDimensions,
                }
          }
        >
          {this.createPlayerElement()}
          {showVideoControls && videoControls}
          {videoPreloader}
        </div>
      );

    

    return (
      <div key={'video-and-hover-container' + this.props.idx}>
        {[video, hover]}
      </div>
    )
  }
}

export default VideoItem;
