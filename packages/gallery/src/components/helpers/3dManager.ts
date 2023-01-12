import { useCallback, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { LoadingManager } from 'three';

interface ManagerInstance {
  stop: boolean;
  opacity: number;
  environment: {
    loadBackground(url: string): void;
    loadTextureAsLightmap(url: string): void;
    addByDirectionalLights(
      intensity?: number,
      color?: number
    ): {
      remove(): void;
    };
    sun(
      intensity?: number,
      color?: number
    ): {
      remove(): void;
    };
    addAmbientLight(
      intensity?: number,
      color?: number
    ): {
      remove(): void;
    };
    loadHDR(url: string): Promise<{
      remove(): void;
    }>;
  };
  model: {
    load3DModel(url: string): Promise<{
      remove(): void;
      punctualLights: boolean;
    }>;
    addGround(opacity?: number): {
      remove(): void;
    };
    transform: {
      setRotation(
        x: number | undefined,
        y: number | undefined,
        z: number | undefined
      ): void;
      setPosition(
        x: number | undefined,
        y: number | undefined,
        z: number | undefined
      ): void;
      setScale(
        x: number | undefined,
        y: number | undefined,
        z: number | undefined
      ): void;
    };
  };
  camera: {
    enablePan: boolean;
    enableZoom: boolean;
    enableRotate: boolean;
    enableAutoRotate: boolean;
  };
  dispose(): void;
}

const GLOBAL_LOADING_MANAGER = new LoadingManager();

export function createSceneManager(
  container: HTMLElement,
  canvas: HTMLCanvasElement
): ManagerInstance {
  const scene = new THREE.Scene();
  const dracoLoader = new DRACOLoader(GLOBAL_LOADING_MANAGER);
  const gltfLoader = new GLTFLoader(GLOBAL_LOADING_MANAGER);
  gltfLoader.setDRACOLoader(dracoLoader);
  const width = container.clientWidth;
  const height = container.clientHeight;
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 12);
  scene.add(camera);
  const controls = new OrbitControls(camera, container);
  controls.target.set(0, 0, 0);
  camera.position.set(0, 0, 0.8);
  controls.maxDistance = 1.6;
  controls.minDistance = 0.65;
  const initRenderer = () => {
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      canvas,
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.LinearToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.userSelect = 'none';
    renderer.domElement.style.transition = 'opacity 0.3s ease-in-out';
    const envTexture = new THREE.PMREMGenerator(renderer).fromScene(
      new RoomEnvironment()
    ).texture;
    scene.environment = envTexture;
    return renderer;
  };
  let renderer: THREE.WebGLRenderer | undefined = initRenderer();
  let opacity = 1;
  const mixers: THREE.AnimationMixer[] = [];
  let previousRAF: number | undefined;
  function animate(stamp?: DOMHighResTimeStamp) {
    if (!renderer) {
      previousRAF = undefined;
      return;
    }
    const delta = (previousRAF && stamp ? stamp - previousRAF : 0) / 1000;
    previousRAF = stamp;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    renderer.setSize(container.clientWidth, container.clientHeight);
    requestAnimationFrame(animate);
    controls.update();
    mixers.forEach((mixer) => {
      mixer.update(delta);
    });
    renderer.render(scene, camera);
  }
  animate();

  let model: GLTF['scene'] | undefined;

  // let modelBasePosition: THREE.Vector3 | undefined;
  let manualPosition = false;
  const api: ManagerInstance = {
    get stop() {
      return !renderer;
    },
    set stop(value) {
      if (!value && !renderer) {
        // controls = new OrbitControls(camera, container);
        renderer = initRenderer();
        animate();
      }
      if (value && renderer) {
        renderer.dispose();
        // controls.dispose();
        renderer = undefined;
      }
    },
    get opacity() {
      return opacity;
    },
    set opacity(value) {
      opacity = value;
      canvas.style.opacity = opacity.toString();
    },
    environment: {
      loadBackground(url) {
        const backgroundTexture = new THREE.TextureLoader().load(url);
        scene.background = backgroundTexture;
        scene.environment = backgroundTexture;
      },
      loadTextureAsLightmap(url) {
        const lightmapTexture = new THREE.TextureLoader().load(url);
        scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material.lightmapIntensity = 1;
            child.material.lightmap = lightmapTexture;
          }
        });
      },
      addByDirectionalLights(intensity = 1, color = 0xffffff) {
        const light = new THREE.DirectionalLight(color, intensity);
        const lightBack = new THREE.DirectionalLight(color, intensity);
        light.position.set(0, 0, 2);
        lightBack.position.set(0, 0, -2);
        scene.add(light);
        scene.add(lightBack);
        return {
          remove() {
            scene.remove(light);
            scene.remove(lightBack);
          },
        };
      },
      sun(intensity = 0.2, color = 0xffffff) {
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(0.5, 0, 0.866); //from https://github.com/donmccurdy/three-gltf-viewer/blob/main/src/viewer.js#L430
        camera.add(light);
        return {
          remove() {
            camera.remove(light);
          },
        };
      },
      addAmbientLight(intensity = 0.2, color = 0xffffff) {
        const light = new THREE.AmbientLight(color, intensity);
        camera.add(light);
        return {
          remove() {
            camera.remove(light);
          },
        };
      },
      async loadHDR(url) {
        const { RGBELoader } = await import(
          /* webpackChunkName: "three-rbdl-loader" */ 'three/examples/jsm/loaders/RGBELoader'
        );
        const hdrLoader = new RGBELoader();
        const hdr = await new Promise<THREE.Texture>((resolve) => {
          hdrLoader.load(url, resolve);
        });
        hdr.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = hdr;
        scene.environment = hdr;
        return {
          remove() {
            scene.background = null;
            scene.environment = null;
          },
        };
      },
    },
    model: {
      async load3DModel(url) {
        const gltf = await new Promise<GLTF>((resolve) => {
          gltfLoader.load(url, resolve);
        });
        const gltfScene = gltf.scene || gltf.scenes[0];
        const clips = gltf.animations || [];
        const { punctualLights, mixer } = addModel(
          scene,
          gltfScene,
          clips,
          camera,
          controls,
          manualPosition
        );
        mixers.push(mixer);

        // if (model) {
        //   scene.remove(model);
        // }
        // model = gltf.scene;
        // model.scale.set(0.1, 0.1, 0.1);
        // let modelMesh: THREE.Mesh | undefined;
        // model.traverse((child) => {
        //   if (!modelMesh && child instanceof THREE.Mesh) {
        //     modelMesh = child;
        //   }
        // });
        // if (modelMesh) {
        //   const center = modelMesh.geometry.boundingBox?.getSize(
        //     new THREE.Vector3()
        //   );
        //   if (center) {
        //     model.position.y = (-center.y / 2) * model.scale.y;
        //   }
        // }

        // // shadow
        // model.traverse((child) => {
        //   if (child instanceof THREE.Mesh) {
        //     child.castShadow = true;
        //     child.receiveShadow = true;
        //     (child.geometry as THREE.BufferGeometry).computeVertexNormals();
        //   }
        // });
        // model.castShadow = true;
        // model.receiveShadow = true;
        // scene.add(model);
        // modelBasePosition = model.position.clone();
        return {
          remove() {
            if (model) {
              scene.remove(model);
            }
          },
          punctualLights,
        };
      },
      addGround(opacity = 0.6) {
        const ground = new THREE.Mesh(
          new THREE.PlaneBufferGeometry(100, 100),
          new THREE.ShadowMaterial({ opacity: opacity })
        );
        ground.position.y = -0.4;
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);
        return {
          remove() {
            scene.remove(ground);
          },
        };
      },
      transform: {
        setRotation(x, y, z) {
          if (!model) {
            return;
          }
          // deg to rad
          const radX = ((x ?? 0) * Math.PI) / 180;
          const radY = ((y ?? 0) * Math.PI) / 180;
          const radZ = ((z ?? 0) * Math.PI) / 180;
          model.rotation.set(radX, radY, radZ);
        },
        setPosition(x, y, z) {
          // if (!model || !modelBasePosition) {
          //   return;
          // }
          // x = modelBasePosition.x + (x ?? 0) / 100;
          // y = modelBasePosition.y + (y ?? 0) / 100;
          // z = modelBasePosition.z + (z ?? 0) / 100;
          // model.position.x = x;
          // model.position.y = y;
          // model.position.z = z;
          if (!x && !y && !z) {
            return;
          }
          manualPosition = true;
          camera.position.x = x ?? 0;
          camera.position.y = y ?? 0;
          camera.position.z = z ?? 0;
          camera.lookAt(new THREE.Vector3());
        },
        setScale(x, y, z) {
          scene.scale.set(x ?? 1, y ?? 1, z ?? 1);
        },
      },
    },
    camera: {
      get enableAutoRotate() {
        return controls.autoRotate;
      },
      set enableAutoRotate(value) {
        controls.autoRotate = value;
      },
      get enableZoom() {
        return controls.enableZoom;
      },
      set enableZoom(value) {
        controls.enableZoom = value;
      },
      get enablePan() {
        return controls.enablePan;
      },
      set enablePan(value) {
        controls.enablePan = value;
      },
      get enableRotate() {
        return controls.enableRotate;
      },
      set enableRotate(value) {
        controls.enableRotate = value;
      },
    },
    dispose() {
      renderer?.dispose();
      controls.dispose();
      renderer = undefined;
    },
  };
  return api;
}

export type SceneManager = ReturnType<typeof createSceneManager>;

export function useSceneManager() {
  const [sceneManager, setSceneManager] = useState<SceneManager | null>(null);

  const render = useCallback(
    (container: HTMLElement, canvas: HTMLCanvasElement) => {
      if (!sceneManager) {
        const sceneManager = createSceneManager(container, canvas);
        setSceneManager(sceneManager);
        return sceneManager;
      }
      return sceneManager;
    },
    []
  );

  return { sceneManager, render };
}

/**
 * from - https://github.com/donmccurdy/three-gltf-viewer/blob/main/src/viewer.js - MIT
 */
function addModel(
  scene: THREE.Scene,
  object: THREE.Object3D,
  animations: THREE.AnimationClip[],
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  manualPosition: boolean
) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3()).length();
  const center = box.getCenter(new THREE.Vector3());
  object.position.x += object.position.x - center.x;
  object.position.y += object.position.y - center.y;
  object.position.z += object.position.z - center.z;
  controls.reset();
  controls.maxDistance = size * 10;
  camera.near = size / 100;
  camera.far = size * 100;
  camera.updateProjectionMatrix();

  if (!manualPosition) {
    camera.position.copy(center);
    camera.position.x += size / 2.0;
    camera.position.y += size / 5.0;
    camera.position.z += size / 2.0;
    camera.lookAt(center);
  }

  controls.saveState();

  scene.add(object);

  let punctualLights = true;

  object.traverse((node) => {
    if (node instanceof THREE.Light) {
      punctualLights = false;
      return;
    }
    if (node instanceof THREE.Mesh) {
      // TODO(https://github.com/mrdoob/three.js/pull/18235): Clean up.
      node.material.depthWrite = !node.material.transparent;
      if (node.material.emissiveMap) {
        node.material.emissiveMap.encoding = THREE.sRGBEncoding;
      }
      if (node.material.map) {
        node.material.map.encoding = THREE.sRGBEncoding;
      }
      node.material.needsUpdate = true;
      return;
    }
  });

  const mixer = new THREE.AnimationMixer(object);

  playAllAnimations(mixer, animations);

  return {
    object,
    animations,
    mixer,
    punctualLights,
  };
}

function playAllAnimations(
  mixer: THREE.AnimationMixer,
  animations: THREE.AnimationClip[]
) {
  if (animations.length === 0) {
    return;
  }
  // Play all animations after each other
  mixer.addEventListener('finished', (e) => {
    const action = e.action;
    action.stop();
    mixer.uncacheRoot(action._clip);
    mixer.clipAction(animations[(action._clip.name || 0) + 1]).play();
  });
  mixer.clipAction(animations[0]).play();
}
