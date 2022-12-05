import {
  Options,
  GALLERY_CONSTS,
  Settings,
  utils,
  ThreeDimensionalScene,
} from 'pro-gallery-lib';
import React from 'react';
import { SceneManager, ThreeDManager } from '../helpers/3dManager';
import ImageItem from './imageItem';

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
  actions: any;
  customComponents: any;
  scene: ThreeDimensionalScene;
  imageDimensions: any;
}

interface State {
  viewMode: 'image' | '3d';
}

function mapSceneToStyleParams(scene: ThreeDimensionalScene, options: Options) {
  return {
    behaviourParams_item_threeDimensionalScene_transform_rotation:
      scene.transform?.rotation ||
      options.behaviourParams_item_threeDimensionalScene_transform_rotation,
    behaviourParams_item_threeDimensionalScene_transform_scale:
      scene.transform?.scale ||
      options.behaviourParams_item_threeDimensionalScene_transform_scale,
    behaviourParams_item_threeDimensionalScene_transform_translation:
      scene.transform?.translation ||
      options.behaviourParams_item_threeDimensionalScene_transform_translation,
    behaviourParams_item_threeDimensionalScene_controls_enablePan:
      scene.controls?.enablePan ||
      options.behaviourParams_item_threeDimensionalScene_controls_enablePan,
    behaviourParams_item_threeDimensionalScene_controls_enableRotate:
      scene.controls?.enableRotate ||
      options.behaviourParams_item_threeDimensionalScene_controls_enableRotate,
    behaviourParams_item_threeDimensionalScene_controls_enableZoom:
      scene.controls?.enableZoom ||
      options.behaviourParams_item_threeDimensionalScene_controls_enableZoom,
    behaviourParams_item_threeDimensionalScene_controls_enableAutoRotate:
      scene.controls?.enableAutoRotate ||
      options.behaviourParams_item_threeDimensionalScene_controls_enableAutoRotate,
    behaviourParams_item_threeDimensionalScene_keepPosterAfterObjectLoad:
      scene.keepPosterAfterObjectLoad ||
      options.behaviourParams_item_threeDimensionalScene_keepPosterAfterObjectLoad,
  };
}
export default class ThreeDItem extends ImageItem {
  sceneManager: SceneManager | null = null;
  containerRef = React.createRef<HTMLDivElement>();
  canvasRef = React.createRef<HTMLCanvasElement>();
  constructor(props: Props) {
    super(props);
    this.state.viewMode = 'image';
  }

  declare state: State & ImageItem['state'];
  declare props: Props;

  get sceneParams() {
    const { options, scene } = this.props;
    return mapSceneToStyleParams(scene || {}, options);
  }

  handleHighResImageLoad = (): void => {
    try {
      this.props.actions.setItemLoaded();
    } catch (e) {
      console.error('Failed to load high res image', e);
    }
  };

  start3D = utils.singleInstance(async () => {
    const { current: container } = this.containerRef;
    const { current: canvas } = this.canvasRef;
    if (!container || !canvas) {
      return;
    }
    const sceneManager = await ThreeDManager.render(container, canvas);
    sceneManager.opacity = 0;
    sceneManager.model
      .load3DModel(
        this.props.createUrl(
          GALLERY_CONSTS.urlSizes.RESIZED,
          GALLERY_CONSTS.urlTypes.THREE_D
        )
      )
      .then(() => {
        this.setState({ viewMode: '3d' });
        sceneManager.opacity = 1;
        this.postLoadUpdate();
        sceneManager.model.addGround();
        sceneManager.environment.addAmbientLight();
        sceneManager.environment.sun();
      });
    this.sceneManager = sceneManager;
  });

  postLoadUpdate = (): void => {
    const params = this.sceneParams;
    const sceneManager = this.sceneManager;
    if (!sceneManager) {
      return;
    }
    const rotation = GALLERY_CONSTS.parse3DDimensions(
      params.behaviourParams_item_threeDimensionalScene_transform_rotation
    );
    const scale = GALLERY_CONSTS.parse3DDimensions(
      params.behaviourParams_item_threeDimensionalScene_transform_scale
    );
    const translation = GALLERY_CONSTS.parse3DDimensions(
      params.behaviourParams_item_threeDimensionalScene_transform_translation
    );
    sceneManager.model.transform.setPosition(
      translation.x,
      translation.y,
      translation.z
    );
    sceneManager.model.transform.setRotation(
      rotation.x,
      rotation.y,
      rotation.z
    );
    sceneManager.camera.enablePan =
      params.behaviourParams_item_threeDimensionalScene_controls_enablePan;
    sceneManager.camera.enableRotate =
      params.behaviourParams_item_threeDimensionalScene_controls_enableRotate;
    sceneManager.camera.enableZoom =
      params.behaviourParams_item_threeDimensionalScene_controls_enableZoom;

    sceneManager.model.transform.setScale(scale.x, scale.y, scale.z);
  };

  componentDidMount = (): void => {
    ThreeDManager.init();
  };

  componentDidUpdate = (): void => {
    if (this.props.activeIndex === this.props.idx) {
      this.start3D();
    }
  };
  trigger3D = (): void => {
    this.start3D();
  };

  get containerStyles(): React.CSSProperties {
    return this.state.viewMode === 'image'
      ? {
          opacity: 1,
          pointerEvents: 'none',
        }
      : {
          opacity: 0,
        };
  }

  get shouldShowImage(): boolean {
    return (
      this.sceneParams
        .behaviourParams_item_threeDimensionalScene_keepPosterAfterObjectLoad ||
      this.state.viewMode === 'image'
    );
  }
  render(): JSX.Element {
    const canvas = (
      <canvas width={'100%'} height={'100%'} ref={this.canvasRef} />
    );

    const imageRenderer = this.shouldShowImage ? this.imageElement : () => null;
    const imageContainerClassNames = this.containerClassNames;
    const animationOverlay = this.animationOverlay;

    const props: React.HTMLAttributes<HTMLDivElement> &
      React.ClassAttributes<HTMLDivElement> = {
      onMouseDown: this.trigger3D,
      onTouchStart: (e) => {
        this.props.actions.handleItemMouseDown(e);
        this.trigger3D();
      },
      ref: this.containerRef,
    };
    return this.getImageContainer(
      imageRenderer,
      imageContainerClassNames,
      <>
        {animationOverlay}
        {canvas}
      </>,
      props
    );
  }
}
