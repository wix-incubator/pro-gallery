import { GALLERY_CONSTS, Options, Settings, utils } from 'pro-gallery-lib';
import React from 'react';
import { SceneManager, ThreeDManager } from '../helpers/3dManager';
import ImageRenderer from './imageRenderer';

interface Props {
  calculatedAlt: string;
  title: string;
  description: string;
  id: string;
  idx: number;
  activeIndex: number;
  options: Options;
  createUrl: any;
  createMagnifiedUrl: any;
  settings: Settings;
  isPrerenderMode: boolean;
  isTransparent: boolean;
  style: any;
  dimensions: any;
  actions: any;
  customComponents: any;
}

interface State {
  viewMode: 'image' | '3d';
}

export default class ThreeDItem extends React.Component<Props, State> {
  sceneManager!: SceneManager;
  containerRef!: HTMLElement;
  state: State = {
    viewMode: 'image',
  };

  handleHighResImageLoad = () => {
    try {
      this.props.actions.setItemLoaded();
    } catch (e) {
      console.error('Failed to load high res image', e);
    }
  };
  start3D = utils.singleInstance(async () => {
    this.sceneManager = await ThreeDManager.render(this.containerRef);
    this.sceneManager.addAmbientLight();
    this.sceneManager.opacity = 0;
    this.sceneManager
      .load3DModel(
        this.props.createUrl(
          GALLERY_CONSTS.urlSizes.RESIZED,
          GALLERY_CONSTS.urlTypes.THREE_D
        )
      )
      .then(() => {
        this.sceneManager.opacity = 1;
      });
    this.sceneManager.sun();
    this.sceneManager.addGround();
  });
  componentDidMount = async () => {
    await ThreeDManager.init();
  };
  componentDidUpdate = () => {
    if (this.props.activeIndex === this.props.idx) {
      this.start3D();
    }
  };
  trigger3D = () => {
    if (this.state.viewMode !== '3d') {
      this.setState({ viewMode: '3d' });
      this.start3D();
    }
  };
  render() {
    const { calculatedAlt, dimensions, isPrerenderMode, actions } = this.props;
    const { marginLeft, marginTop, ...imageSizing } = dimensions;
    const preloadStyles = isPrerenderMode
      ? {
          width: '100%',
          height: '100%',
        }
      : {};
    const blockDownloadStyles =
      utils.isMobile() && !this.props.options.allowContextMenu
        ? {
            '-webkit-user-select': 'none',
            '-webkit-touch-callout': 'none',
          }
        : {};
    const shouldRenderHighResImages = !this.props.isPrerenderMode;

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
        }}
        ref={(ref) => {
          if (ref) {
            this.containerRef = ref;
          }
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            // opacity: this.state.viewMode === 'image' ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            position: 'absolute',
            pointerEvents: this.state.viewMode === 'image' ? 'auto' : 'none',
          }}
          onMouseEnter={this.trigger3D}
        >
          <ImageRenderer
            className={`gallery-item-visible gallery-item gallery-item-preloaded`}
            data-hook="gallery-item-image-img"
            data-idx={this.props.idx}
            src={this.props.createUrl(
              GALLERY_CONSTS.urlSizes.RESIZED,
              GALLERY_CONSTS.urlTypes.HIGH_RES
            )}
            alt={
              typeof calculatedAlt === 'string'
                ? calculatedAlt
                : 'untitled image'
            }
            onLoad={this.handleHighResImageLoad}
            loading={this.props.isPrerenderMode ? 'lazy' : 'eager'}
            style={{
              ...imageSizing,
              ...blockDownloadStyles,
              ...(!shouldRenderHighResImages && preloadStyles),
            }}
            {...actions}
            customImageRenderer={
              this.props.customComponents?.customImageRenderer
            }
          />
        </div>
      </div>
    );
  }
}
