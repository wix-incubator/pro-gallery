import React from 'react';

export default class LeanGallery extends React.Component {

  constructor() {
    super();
    this.state = {
      itemStyle: {
      }
    };
  }

  resizeUrl({ item }) {

    const { options, resizeMediaUrl } = this.props;

    const { url } = item;
    const method = options.cubeType;
    const width = this.state.itemStyle.width;
    const height = this.state.itemStyle.height;
    const focalPoint = false;

    if (typeof resizeMediaUrl === 'function') {
      try {
        return resizeMediaUrl({
          maxWidth: (item.metadata || item.metaData).width,
          maxHeight: (item.metadata || item.metaData).height,
        }, url, method, width, height, false, false, focalPoint) || '';
      } catch (e) {
        return String(url);
      }
    } else {
      return String(url);
    }
  };

  createCssGrid() {
    const { options } = this.props;
    const { imageMargin, gallerySizePx } = options;
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fit, minmax(${gallerySizePx}px, 1fr))`,
      gridGap: `${imageMargin}px`
    };

  }

  getSize() {
    const { items, options, resizeMediaUrl } = this.props;

  }

  render() {

    const { items, options } = this.props;

    return (
      <div style={this.createCssGrid()}>
        {items.map(item => {
          const src = this.resizeUrl({ item })
          return (
            <div
              style={{
                overflow: 'hidden',
                height: this.state.itemStyle.height
              }}
              ref={node => {
                node && !this.state.itemStyle.width &&
                  this.setState({ itemStyle: {
                    width: node.clientWidth,
                    height: Math.round(node.clientWidth / options.cubeRatio),
                    objectFit: options.cubeType === 'fit' ? 'contain' : 'over'
                  }});
              }}
            >
              <img src={src} style={this.state.itemStyle} alt={item.title} />
            </div>
          )
        })
        }
      </div >
    )
  }
}

//http://localhost:3000/?cubeRatio=1.2&imageMargin=50&galleryLayout=13&gallerySizePx=55