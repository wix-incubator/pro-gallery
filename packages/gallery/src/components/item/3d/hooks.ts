import { GALLERY_CONSTS, Options, ThreeDimensionalScene } from 'pro-gallery-lib';
import { ThreeDImplementation } from './types';
import { useSceneManager } from '../../helpers/3dManager';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

function mapSceneToStyleParams(scene: ThreeDimensionalScene, options: Options) {
  return {
    behaviourParams_item_threeDimensionalScene_transform_rotation:
      scene.transform?.rotation || options.behaviourParams_item_threeDimensionalScene_transform_rotation,
    behaviourParams_item_threeDimensionalScene_transform_scale:
      scene.transform?.scale || options.behaviourParams_item_threeDimensionalScene_transform_scale,
    behaviourParams_item_threeDimensionalScene_transform_position:
      scene.transform?.position || options.behaviourParams_item_threeDimensionalScene_transform_position,
    behaviourParams_item_threeDimensionalScene_controls_enablePan:
      scene.controls?.enablePan || options.behaviourParams_item_threeDimensionalScene_controls_enablePan,
    behaviourParams_item_threeDimensionalScene_controls_enableRotate:
      scene.controls?.enableRotate || options.behaviourParams_item_threeDimensionalScene_controls_enableRotate,
    behaviourParams_item_threeDimensionalScene_controls_enableZoom:
      scene.controls?.enableZoom || options.behaviourParams_item_threeDimensionalScene_controls_enableZoom,
    behaviourParams_item_threeDimensionalScene_controls_enableAutoRotate:
      scene.controls?.enableAutoRotate || options.behaviourParams_item_threeDimensionalScene_controls_enableAutoRotate,
  };
}

export function use3DItem(props: ThreeDImplementation): ThreeDItemHooks {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { sceneManager, render } = useSceneManager();
  const [isLoaded, setIsLoaded] = useState(false);

  const sceneParams = mapSceneToStyleParams(props.scene || {}, props.options);

  const loadedManager = useMemo(() => {
    if (!props.shouldPlay) {
      return sceneManager;
    }
    if (sceneManager) {
      return sceneManager;
    }
    if (!props.itemContainer.current || !canvasRef.current) {
      return sceneManager;
    }
    const manager = render(props.itemContainer.current, canvasRef.current);
    if (!manager) {
      throw new Error('Could not create scene manager post play');
    }
    manager.opacity = 0;
    manager.model
      .load3DModel(props.createUrl(GALLERY_CONSTS.urlSizes.RESIZED, GALLERY_CONSTS.urlTypes.THREE_D))
      .then(({ punctualLights }) => {
        props.actions.setItemLoaded();
        manager.opacity = 1;
        manager.model.addGround();
        if (punctualLights) {
          manager.environment.addAmbientLight();
          manager.environment.sun();
        }
        requestAnimationFrame(() => {
          setIsLoaded(true);
        });
      });
    return manager;
  }, [render, sceneManager, props.shouldPlay, props.itemContainer.current, canvasRef.current]);

  const postLoadUpdate = useCallback(
    ({
      behaviourParams_item_threeDimensionalScene_transform_rotation,
      behaviourParams_item_threeDimensionalScene_transform_scale,
      behaviourParams_item_threeDimensionalScene_transform_position,
      behaviourParams_item_threeDimensionalScene_controls_enablePan,
      behaviourParams_item_threeDimensionalScene_controls_enableRotate,
      behaviourParams_item_threeDimensionalScene_controls_enableZoom,
      behaviourParams_item_threeDimensionalScene_controls_enableAutoRotate,
    }: typeof sceneParams) => {
      if (!loadedManager) {
        return;
      }
      const rotation = GALLERY_CONSTS.parse3DDimensions(behaviourParams_item_threeDimensionalScene_transform_rotation);
      const scale = GALLERY_CONSTS.parse3DDimensions(behaviourParams_item_threeDimensionalScene_transform_scale);
      const position = GALLERY_CONSTS.parse3DDimensions(behaviourParams_item_threeDimensionalScene_transform_position);
      loadedManager.model.transform.setPosition(position.x, position.y, position.z);
      loadedManager.model.transform.setRotation(rotation.x, rotation.y, rotation.z);
      loadedManager.camera.enablePan = behaviourParams_item_threeDimensionalScene_controls_enablePan;
      loadedManager.camera.enableRotate = behaviourParams_item_threeDimensionalScene_controls_enableRotate;
      loadedManager.camera.enableZoom = behaviourParams_item_threeDimensionalScene_controls_enableZoom;
      loadedManager.camera.enableAutoRotate = behaviourParams_item_threeDimensionalScene_controls_enableAutoRotate;

      loadedManager.model.transform.setScale(scale.x, scale.y, scale.z);
    },
    [loadedManager]
  );

  useEffect(() => {
    if (isLoaded && loadedManager && props.shouldPlay === loadedManager.stop) {
      loadedManager.stop = !props.shouldPlay;
      return;
    }
  }, [props.shouldPlay, loadedManager, isLoaded]);

  postLoadUpdate(sceneParams);

  useEffect(() => {
    return () => {
      if (loadedManager) {
        loadedManager.dispose();
      }
    };
  }, [loadedManager]);

  return {
    canvasRef,
    isLoaded,
  };
}

export interface ThreeDItemHooks {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isLoaded: boolean;
}
