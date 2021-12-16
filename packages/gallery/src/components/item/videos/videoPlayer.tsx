import React, { useEffect } from 'react';
import type { ReactPlayerProps } from 'react-player';

type PlayerProps = ReactPlayerProps;

const ReactPlayer = React.lazy(() => import('react-player'));

function VideoPlayer(props: PlayerProps) {
  return (
    <React.Suspense fallback={null}>
      <ReactPlayer {...props} />
    </React.Suspense>
  );
}

const isHls = (url: string): boolean =>
  url.includes('/hls') || url.includes('.m3u8');

const isVimeo = (url: string): boolean => url.includes('vimeo.com');

const isHlsOrVimeo = (url: string): boolean => isHls(url) || isVimeo(url);

function VimeoOrHlsVideoPlayer(props: PlayerProps) {
  const [vimeoIsLoaded, setVimeoIsLoaded] = React.useState(false);

  useEffect(() => {
    if (typeof props.url === 'string') {
      if (isVimeo(props.url)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (window.Vimeo) {
          setVimeoIsLoaded(true);
        } else {
          import('@vimeo/player').then(({ default: Player }) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            window.Vimeo = { Player };
            setVimeoIsLoaded(true);
          });
        }
      }
      if (isHls(props.url)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (window.HLS) {
          setVimeoIsLoaded(true);
        } else {
          import('hls.js').then(({ default: Hls }) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            window.Hls = Hls;
            setVimeoIsLoaded(true);
          });
        }
      }
    }
  }, []);

  return vimeoIsLoaded ? <VideoPlayer {...props} /> : null;
}

function VideoPlyaerWithYouTubeAndVimeoSupport(
  props: PlayerProps
): JSX.Element {
  if (typeof props.url === 'string') {
    if (isHlsOrVimeo(props.url)) {
      return <VimeoOrHlsVideoPlayer {...props} />;
    }
  }
  return <VideoPlayer {...props} />;
}

export default VideoPlyaerWithYouTubeAndVimeoSupport;
