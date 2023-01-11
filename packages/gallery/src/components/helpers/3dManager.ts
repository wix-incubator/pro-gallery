import { useCallback, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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

export function createSceneManager(
  container: HTMLElement,
  canvas: HTMLCanvasElement
): ManagerInstance {
  const scene = new THREE.Scene();
  const dracoLoader = new DRACOLoader();
  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);
  const width = container.clientWidth;
  const height = container.clientHeight;
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
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
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.userSelect = 'none';
    renderer.domElement.style.transition = 'opacity 0.3s ease-in-out';
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    return renderer;
  };
  let renderer: THREE.WebGLRenderer | undefined = initRenderer();
  let opacity = 1;
  function animate() {
    if (!renderer) {
      return;
    }
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    renderer.setSize(container.clientWidth, container.clientHeight);
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  let model: GLTF['scene'] | undefined;

  let modelBasePosition: THREE.Vector3 | undefined;
  return {
    get stop() {
      return !renderer;
    },
    set stop(value) {
      if (!value && !renderer) {
        renderer = initRenderer();
        animate();
      }
      if (value && renderer) {
        renderer.dispose();
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
      sun(intensity = 1, color = 0xffffff) {
        const light = new THREE.DirectionalLight(color, intensity);
        light.castShadow = true;
        light.position.set(0, 3, 2);
        light.target.position.set(0, 0, 0);
        scene.add(light);
        return {
          remove() {
            scene.remove(light);
          },
        };
      },
      addAmbientLight(intensity = 0.95, color = 0xffffff) {
        const light = new THREE.AmbientLight(color, intensity);
        scene.add(light);
        return {
          remove() {
            scene.remove(light);
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
        if (model) {
          scene.remove(model);
        }
        model = gltf.scene;
        model.scale.set(0.1, 0.1, 0.1);
        let modelMesh: THREE.Mesh | undefined;
        model.traverse((child) => {
          if (!modelMesh && child instanceof THREE.Mesh) {
            modelMesh = child;
          }
        });
        if (modelMesh) {
          const center = modelMesh.geometry.boundingBox?.getSize(
            new THREE.Vector3()
          );
          if (center) {
            model.position.y = (-center.y / 2) * model.scale.y;
          }
        }

        // shadow
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            (child.geometry as THREE.BufferGeometry).computeVertexNormals();
          }
        });
        model.castShadow = true;
        model.receiveShadow = true;
        scene.add(model);
        modelBasePosition = model.position.clone();

        return {
          remove() {
            if (model) {
              scene.remove(model);
            }
          },
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
          if (!model || !modelBasePosition) {
            return;
          }
          x = modelBasePosition.x + (x ?? 0) / 100;
          y = modelBasePosition.y + (y ?? 0) / 100;
          z = modelBasePosition.z + (z ?? 0) / 100;
          model.position.x = x;
          model.position.y = y;
          model.position.z = z;
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
}

export type SceneManager = ReturnType<typeof createSceneManager>;

export function useSceneManager() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sceneManager, setSceneManager] = useState<SceneManager | null>(null);

  const render = useCallback((container: HTMLElement) => {
    if (!canvasRef.current) {
      throw new Error('canvas element is not found.');
    }
    if (!sceneManager) {
      const sceneManager = createSceneManager(container, canvasRef.current);
      setSceneManager(sceneManager);
      return sceneManager;
    }
    return sceneManager;
  }, []);

  return { canvasRef, sceneManager, render };
}
