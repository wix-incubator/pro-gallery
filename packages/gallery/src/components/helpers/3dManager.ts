import { utils } from 'pro-gallery-lib';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
type Three = typeof import('three');
type GLTFLoader = typeof import('three/examples/jsm/loaders/GLTFLoader');
type DRACOLoader = typeof import('three/examples/jsm/loaders/DRACOLoader');
type OrbitControls = typeof import('three/examples/jsm/controls/OrbitControls');
type RGBELoader = typeof import('three/examples/jsm/loaders/RGBELoader');
type Extensions = {
  gltfLoader: GLTFLoader;
  dracoLoader: DRACOLoader;
  orbitControls: OrbitControls;
  rgbELoader: RGBELoader;
};

const utils_singleInstance = utils.singleInstance as <
  T extends (...args: any[]) => any
>(
  fn: T
) => T;

export function create3DManager() {
  let isInitialized = false;
  return {
    init: utils_singleInstance(() => {
      const THREE_PROMISE = new Promise((resolve, reject) => {
        import('three')
          .then((three) => {
            resolve(three);
          })
          .catch(reject);
      });
      const EXTENSIONS_PROMISE = new Promise<Extensions>((resolve, reject) =>
        Promise.all([
          import('three/examples/jsm/loaders/GLTFLoader'),
          import('three/examples/jsm/loaders/DRACOLoader'),
          import('three/examples/jsm/controls/OrbitControls'),
          import('three/examples/jsm/loaders/RGBELoader'),
        ])
          .then(([GLTFLoader, DRACOLoader, OrbitControls, RGBELoader]) => {
            resolve({
              gltfLoader: GLTFLoader,
              dracoLoader: DRACOLoader,
              orbitControls: OrbitControls,
              rgbELoader: RGBELoader,
            });
          })
          .catch(reject)
      );
      const awaitLoad = Promise.all([THREE_PROMISE, EXTENSIONS_PROMISE]);
      awaitLoad.then(() => {
        isInitialized = true;
      });
      return {
        THREE: THREE_PROMISE,
        EXTENSIONS: EXTENSIONS_PROMISE,
        awaitLoad,
      };
    }),
    get isInitialized() {
      return isInitialized;
    },
    async render(
      element: HTMLElement,
      canvas: HTMLCanvasElement = element.appendChild(
        document.createElement('canvas')
      )
    ) {
      const { THREE, EXTENSIONS } = this.init();
      const three = (await THREE) as Three;
      const extensions = (await EXTENSIONS) as Extensions;
      return createSceneManager(three, element, canvas, extensions);
    },
  };
}

export const ThreeDManager = create3DManager();

interface ManagerInstance {
  stop(): void;
  opacity: number;
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
  load3DModel(url: string): Promise<{
    remove(): void;
  }>;
  loadHDR(url: string): Promise<{
    remove(): void;
  }>;
  addGround(opacity?: number): {
    remove(): void;
  };
  setRotation(
    x: number | undefined,
    y: number | undefined,
    z: number | undefined
  ): void;
  setCameraPosition(
    x: number | undefined,
    y: number | undefined,
    z: number | undefined
  ): void;
  setScale(
    x: number | undefined,
    y: number | undefined,
    z: number | undefined
  ): void;
}

export function createSceneManager(
  three: typeof import('three'),
  container: HTMLElement,
  canvas: HTMLCanvasElement,
  extensions: Extensions
): ManagerInstance {
  const renderer = new three.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas,
  });
  renderer.setClearColor(0x000000, 0);
  const scene = new three.Scene();
  const dracoLoader = new extensions.dracoLoader.DRACOLoader();
  const gltfLoader = new extensions.gltfLoader.GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);
  const width = container.clientWidth;
  const height = container.clientHeight;
  const camera = new three.PerspectiveCamera(75, width / height, 0.1, 1000);
  const controls = new extensions.orbitControls.OrbitControls(
    camera,
    container
  );
  controls.target.set(0, 0, 0);
  camera.position.set(0, 0, 0.8);
  controls.enableDamping = true;
  controls.enableZoom = true;
  controls.enableRotate = true;
  controls.maxDistance = 1.6;
  controls.minDistance = 0.65;
  controls.autoRotate = true;
  renderer.setSize(width, height);
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.userSelect = 'none';
  renderer.domElement.style.transition = 'opacity 0.3s ease-in-out';
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = three.PCFSoftShadowMap;

  let stop = false;
  function animate() {
    if (stop) {
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
  let opacity = 1;

  return {
    stop() {
      stop = true;
    },
    get opacity() {
      return opacity;
    },
    set opacity(value) {
      opacity = value;
      renderer.domElement.style.opacity = opacity.toString();
    },
    loadBackground(url) {
      const backgroundTexture = new three.TextureLoader().load(url);
      scene.background = backgroundTexture;
      scene.environment = backgroundTexture;
    },
    loadTextureAsLightmap(url) {
      const lightmapTexture = new three.TextureLoader().load(url);
      scene.traverse((child) => {
        if (child instanceof three.Mesh) {
          child.material.lightmapIntensity = 1;
          child.material.lightmap = lightmapTexture;
        }
      });
    },
    addByDirectionalLights(intensity = 1, color = 0xffffff) {
      const light = new three.DirectionalLight(color, intensity);
      const lightBack = new three.DirectionalLight(color, intensity);
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
      const light = new three.DirectionalLight(color, intensity);
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
      const light = new three.AmbientLight(color, intensity);
      scene.add(light);
      return {
        remove() {
          scene.remove(light);
        },
      };
    },
    async load3DModel(url) {
      const gltf = await new Promise<GLTF>((resolve) => {
        gltfLoader.load(url, resolve);
      });
      const model = gltf.scene;
      model.scale.set(0.1, 0.1, 0.1);
      let modelMesh: THREE.Mesh | undefined;
      model.traverse((child) => {
        if (!modelMesh && child instanceof three.Mesh) {
          modelMesh = child;
        }
      });
      if (modelMesh) {
        const center = modelMesh.geometry.boundingBox?.getSize(
          new three.Vector3()
        );
        if (center) {
          model.position.y = (-center.y / 2) * model.scale.y;
        }
      }

      // shadow
      model.traverse((child) => {
        if (child instanceof three.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      model.castShadow = true;
      model.receiveShadow = true;
      scene.add(model);
      return {
        remove() {
          scene.remove(model);
        },
      };
    },
    async loadHDR(url) {
      const hdrLoader = new extensions.rgbELoader.RGBELoader();
      const hdr = await new Promise<THREE.Texture>((resolve) => {
        hdrLoader.load(url, resolve);
      });
      hdr.mapping = three.EquirectangularReflectionMapping;
      scene.background = hdr;
      scene.environment = hdr;
      return {
        remove() {
          scene.background = null;
          scene.environment = null;
        },
      };
    },
    addGround(opacity = 0.6) {
      const ground = new three.Mesh(
        new three.PlaneBufferGeometry(100, 100),
        new three.ShadowMaterial({ opacity: opacity })
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
    setRotation(x, y, z) {
      controls.target.set(x ?? 0, y ?? 0, z ?? 0);
    },
    setCameraPosition(x, y, z) {
      camera.position.set(x ?? 0, y ?? 0, z ?? 0);
    },
    setScale(x, y, z) {
      scene.scale.set(x ?? 1, y ?? 1, z ?? 1);
    },
  };
}

export type SceneManager = ReturnType<typeof createSceneManager>;
