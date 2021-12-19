import React from 'react';
import type { ReactPlayerProps } from 'react-player';
import { reactLazy } from '../../../common/utils/react';

type PlayerProps = ReactPlayerProps;

const ReactPlayer = reactLazy(() => import('react-player'));

class VideoPlayer extends React.Component<PlayerProps> {
  render = () => (
    <React.Suspense fallback={null}>
      <ReactPlayer {...this.props} />
    </React.Suspense>
  );
}

const isHls = (url: string): boolean =>
  url.includes('/hls') || url.includes('.m3u8');

const isVimeo = (url: string): boolean => url.includes('vimeo.com');

const isHlsOrVimeo = (url: string): boolean => isHls(url) || isVimeo(url);

class VimeoOrHlsVideoPlayer extends React.Component<
  PlayerProps,
  { isPlayerLoaded: boolean }
> {
  state = {
    isPlayerLoaded: false,
  };

  componentDidMount = () => {
    if (typeof this.props.url === 'string') {
      if (isVimeo(this.props.url)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (window.Vimeo) {
          this.setState({ isPlayerLoaded: true });
        } else {
          import('@vimeo/player').then(({ default: Player }) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            window.Vimeo = { Player };
            this.setState({ isPlayerLoaded: true });
          });
        }
      }
      if (isHls(this.props.url)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (window.HLS) {
          this.setState({ isPlayerLoaded: true });
        } else {
          import('hls.js').then(({ default: Hls }) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            window.Hls = Hls;
            this.setState({ isPlayerLoaded: true });
          });
        }
      }
    }
  };

  render = () =>
    this.state.isPlayerLoaded ? <VideoPlayer {...this.props} /> : null;
}

class VideoPlyaerWithYouTubeAndVimeoSupport extends React.Component<PlayerProps> {
  render = () => {
    if (typeof this.props.url === 'string') {
      if (isHlsOrVimeo(this.props.url)) {
        return <VimeoOrHlsVideoPlayer {...this.props} />;
      }
    }
    return <VideoPlayer {...this.props} />;
  };
}

export default VideoPlyaerWithYouTubeAndVimeoSupport;
