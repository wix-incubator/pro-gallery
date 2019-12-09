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
    const isPreload = !(this.state.itemStyle.width > 0)
    if (isPreload) {
      
    }
    const width = this.state.itemStyle.width || 250;
    const height = this.state.itemStyle.height || 250;
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
    const { gridStyle, numberOfImagesPerRow, imageMargin, gallerySizePx } = options;
    const gridTemplateColumns = gridStyle === 1 ? `repeat(${numberOfImagesPerRow}, 1fr)` : `repeat(auto-fit, minmax(${gallerySizePx}px, 1fr))`;

    return {
      display: 'grid',
      gridTemplateColumns,
      gridGap: `${imageMargin}px`
    };

  }

  measure(node) {
    const { options } = this.props;
    node && !this.state.itemStyle.width &&
      this.setState({ itemStyle: {
        width: node.clientWidth,
        height: Math.round(node.clientWidth / options.cubeRatio),
        objectFit: options.cubeType === 'fit' ? 'contain' : 'cover'
      }});
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
              ref={this.measure.bind(this)}
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