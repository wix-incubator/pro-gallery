import React from 'react';
import { PrintOnlyImageSource } from 'pro-gallery';

function canReplace(src: string, base: string, target: string) {
  return src.indexOf(base) > 0 && src.indexOf(target) > -1 ? true : false;
}

function replaceWebp(src: string, target: string) {
  return src.replace('webp', target);
}

function originalSource(src: string) {
  if (canReplace(src, '.webp', '.png')) {
    return <source srcSet={replaceWebp(src, 'png')} type="image/png" />;
  }
  if (canReplace(src, '.webp', '.jpg') || canReplace(src, '.webp', '.jpeg')) {
    return <source srcSet={replaceWebp(src, 'jpeg')} type="image/jpeg" />;
  }
  return null;
}

function webpSource(src: string) {
  if (src.match(/\.\w{3,4}\/v\d\/\w*\//)) {
    // only change resized urls
    return <source srcSet={src.replace(/(jpg|jpeg|png)$/, 'webp')} type="image/webp" />;
  }
  return null;
}
export class CustomImageRenderer extends React.Component<Props> {
  private myRef = React.createRef<HTMLImageElement>();

  componentDidMount() {
    if (this.myRef.current?.complete) {
      this.props.onLoad();
    }
  }
  render() {
    const props: Props = this.props;
    if (typeof props.src === 'string') {
      const src = props.src;
      const imageProps: React.DetailedHTMLProps<
        React.ImgHTMLAttributes<HTMLImageElement>,
        HTMLImageElement
      > = getImageProps(src, props);
      return (
        <picture key={`picture_${props.id}`}>
          {webpSource(props.src)}
          {originalSource(props.src)}
          <img {...imageProps} />
        </picture>
      );
    } else if (typeof props.src === 'object') {
      const src = props.src[props.src.length - 1].url;
      const imageProps: React.DetailedHTMLProps<
        React.ImgHTMLAttributes<HTMLImageElement>,
        HTMLImageElement
      > = getImageProps(src, props);
      return (
        <picture key={`multi_picture_${props.id}`}>
          {props.src.map((currentSrc) => {
            const type = `image/${currentSrc.type}`;
            const srcSet = currentSrc.dpr || currentSrc.url;
            const Source = currentSrc.forPrinting ? PrintOnlyImageSource : 'source';
            return (
              <Source
                srcSet={srcSet}
                type={type}
                key={`${props.id}-${currentSrc.forPrinting ? 'printingSrc-' : ''}${currentSrc.type}`}
              />
            );
          })}
          <img ref={this.myRef as React.RefObject<HTMLImageElement>} {...imageProps} />
        </picture>
      );
    }

    return null;
  }
}

export interface Props {
  src: imageSrc;
  alt: string;
  id: string;
  loading?: 'eager' | 'lazy' | undefined;
  style: Object;
  onLoad: Function;
  'data-hook'?: string;
  className?: string;
}

type imageSrc = string | { url: string; type: string; dpr?: string; forPrinting?: boolean }[];

function getImageProps(
  src: string,
  props: Props
): React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement> & { 'data-hook'?: string }, HTMLImageElement> {
  const imageProps: React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement> & { 'data-hook'?: string },
    HTMLImageElement
  > = {
    src,
    alt: props.alt,
    className: props.className,
    style: props.style,
    'data-hook': props['data-hook'],
    loading: props.loading,
  };
  return {
    ...imageProps,
  } as React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement> & { 'data-hook'?: string }, HTMLImageElement>;
}
