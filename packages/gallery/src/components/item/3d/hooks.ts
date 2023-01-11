import {
  GALLERY_CONSTS,
  Options,
  ThreeDimensionalScene,
  utils,
} from 'pro-gallery-lib';
import { ThreeDImplementation } from './types';
import { useSceneManager } from '../../helpers/3dManager';
import { useCallback, useEffect, useMemo, useState } from 'react';

function mapSceneToStyleParams(scene: ThreeDimensionalScene, options: Options) {
  return {
    behaviourParams_item_threeDimensionalScene_transform_rotation:
      scene.transform?.rotation ||
      options.behaviourParams_item_threeDimensionalScene_transform_rotation,
    behaviourParams_item_threeDimensionalScene_transform_scale:
      scene.transform?.scale ||
      options.behaviourParams_item_threeDimensionalScene_transform_scale,
    behaviourParams_item_threeDimensionalScene_transform_position:
      scene.transform?.position ||
      options.behaviourParams_item_threeDimensionalScene_transform_position,
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
  };
}

export function use3DItem(props: ThreeDImplementation): ThreeDItemHooks {
  const { canvasRef, sceneManager, render } = useSceneManager(
    props.itemContainer
  );
  const [isLoaded, setIsLoaded] = useState(false);

  const sceneParams = mapSceneToStyleParams(props.scene || {}, props.options);

  const start = useMemo(
    () =>
      utils.singleInstance(async () => {
        const manager = sceneManager || (await render());
        if (!manager) {
          return;
        }
        manager.opacity = 0;
        manager.model
          .load3DModel(
            props.createUrl(
              GALLERY_CONSTS.urlSizes.RESIZED,
              GALLERY_CONSTS.urlTypes.THREE_D
            )
          )
          .then(() => {
            props.actions.setItemLoaded();
            manager.opacity = 1;
            manager.model.addGround();
            manager.environment.addAmbientLight();
            manager.environment.sun();
            setIsLoaded(true);
          });
      }),
    []
  );

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
      if (!sceneManager) {
        return;
      }
      const rotation = GALLERY_CONSTS.parse3DDimensions(
        behaviourParams_item_threeDimensionalScene_transform_rotation
      );
      const scale = GALLERY_CONSTS.parse3DDimensions(
        behaviourParams_item_threeDimensionalScene_transform_scale
      );
      const position = GALLERY_CONSTS.parse3DDimensions(
        behaviourParams_item_threeDimensionalScene_transform_position
      );
      sceneManager.model.transform.setPosition(
        position.x,
        position.y,
        position.z
      );
      sceneManager.model.transform.setRotation(
        rotation.x,
        rotation.y,
        rotation.z
      );
      sceneManager.camera.enablePan =
        behaviourParams_item_threeDimensionalScene_controls_enablePan;
      sceneManager.camera.enableRotate =
        behaviourParams_item_threeDimensionalScene_controls_enableRotate;
      sceneManager.camera.enableZoom =
        behaviourParams_item_threeDimensionalScene_controls_enableZoom;
      sceneManager.camera.enableAutoRotate =
        behaviourParams_item_threeDimensionalScene_controls_enableAutoRotate;

      sceneManager.model.transform.setScale(scale.x, scale.y, scale.z);
    },
    [sceneManager]
  );

  useEffect(() => {
    if (!sceneManager && props.shouldPlay) {
      start();
      return;
    }
    if (sceneManager && props.shouldPlay === sceneManager.stop) {
      sceneManager.stop = !props.shouldPlay;
      return;
    }
  }, [props.shouldPlay]);

  postLoadUpdate(sceneParams);

  return {
    canvasRef,
    isLoaded,
  };
}

export interface ThreeDItemHooks {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isLoaded: boolean;
}
