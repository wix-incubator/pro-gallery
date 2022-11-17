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
    behaviourParams_item_threeDimensionalScene_transform_rotation_x:
      scene.transform?.rotation?.x ||
      options.behaviourParams_item_threeDimensionalScene_transform_rotation_x,
    behaviourParams_item_threeDimensionalScene_transform_rotation_y:
      scene.transform?.rotation?.y ||
      options.behaviourParams_item_threeDimensionalScene_transform_rotation_y,
    behaviourParams_item_threeDimensionalScene_transform_rotation_z:
      scene.transform?.rotation?.z ||
      options.behaviourParams_item_threeDimensionalScene_transform_rotation_z,
    behaviourParams_item_threeDimensionalScene_transform_scale_x:
      scene.transform?.scale?.x ||
      options.behaviourParams_item_threeDimensionalScene_transform_scale_x,
    behaviourParams_item_threeDimensionalScene_transform_scale_y:
      scene.transform?.scale?.y ||
      options.behaviourParams_item_threeDimensionalScene_transform_scale_y,
    behaviourParams_item_threeDimensionalScene_transform_scale_z:
      scene.transform?.scale?.z ||
      options.behaviourParams_item_threeDimensionalScene_transform_scale_z,
    behaviourParams_item_threeDimensionalScene_transform_translation_x:
      scene.transform?.translation?.x ||
      options.behaviourParams_item_threeDimensionalScene_transform_translation_x,
    behaviourParams_item_threeDimensionalScene_transform_translation_y:
      scene.transform?.translation?.y ||
      options.behaviourParams_item_threeDimensionalScene_transform_translation_y,
    behaviourParams_item_threeDimensionalScene_transform_translation_z:
      scene.transform?.translation?.z ||
      options.behaviourParams_item_threeDimensionalScene_transform_translation_z,
    behaviourParams_item_threeDimensionalScene_controls_enablePan:
      scene.controls?.enablePan ||
      options.behaviourParams_item_threeDimensionalScene_controls_enablePan,
    behaviourParams_item_threeDimensionalScene_controls_enableRotate:
      scene.controls?.enableRotate ||
      options.behaviourParams_item_threeDimensionalScene_controls_enableRotate,
    behaviourParams_item_threeDimensionalScene_controls_enableZoom:
      scene.controls?.enableZoom ||
      options.behaviourParams_item_threeDimensionalScene_controls_enableZoom,
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
    return mapSceneToStyleParams(scene, options);
  }

  handleHighResImageLoad = () => {
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
    sceneManager.addAmbientLight();
    sceneManager.opacity = 0;
    sceneManager
      .load3DModel(
        this.props.createUrl(
          GALLERY_CONSTS.urlSizes.RESIZED,
          GALLERY_CONSTS.urlTypes.THREE_D
        )
      )
      .then(() => {
        sceneManager.opacity = 1;
      });
    sceneManager.sun();
    sceneManager.addGround();
    this.sceneManager = sceneManager;
  });

  postLoadUpdate = (): void => {
    const params = this.sceneParams;
    const sceneManager = this.sceneManager;
    if (!sceneManager) {
      return;
    }
    sceneManager.setCameraPosition(
      params.behaviourParams_item_threeDimensionalScene_transform_translation_x,
      params.behaviourParams_item_threeDimensionalScene_transform_translation_y,
      params.behaviourParams_item_threeDimensionalScene_transform_translation_z
    );
    sceneManager.setRotation(
      params.behaviourParams_item_threeDimensionalScene_transform_rotation_x,
      params.behaviourParams_item_threeDimensionalScene_transform_rotation_y,
      params.behaviourParams_item_threeDimensionalScene_transform_rotation_z
    );
    sceneManager.setScale(
      params.behaviourParams_item_threeDimensionalScene_transform_scale_x,
      params.behaviourParams_item_threeDimensionalScene_transform_scale_y,
      params.behaviourParams_item_threeDimensionalScene_transform_scale_z
    );
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
    this.setState({ viewMode: '3d' });
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

  render(): JSX.Element {
    const canvas = (
      <canvas width={'100%'} height={'100%'} ref={this.canvasRef} />
    );
    const imageRenderer = this.imageElement;
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
