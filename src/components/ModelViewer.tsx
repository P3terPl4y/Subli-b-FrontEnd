import { useEffect, useRef } from 'react';
import { GLView, ExpoWebGLRenderingContext } from 'expo-gl';
import * as THREE from 'three';
import { Renderer } from 'expo-three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

type Props = {
  modelModule: number | null;
  textureUri: string | null;
};

export default function ModelViewer({ modelModule, textureUri }: Props) {
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const objectRef = useRef<THREE.Object3D | null>(null);
  const pendingTextureRef = useRef<string | null>(null);

  const loadGlb = async (scene: THREE.Scene, module: number) => {
    const asset = Asset.fromModule(module);
    await asset.downloadAsync();

    const base64 = await FileSystem.readAsStringAsync(asset.localUri!, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const binary = atob(base64);
    const buffer = new ArrayBuffer(binary.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < binary.length; i++) view[i] = binary.charCodeAt(i);

    const loader = new GLTFLoader();
    loader.parse(
      buffer,
      '',
      (gltf) => {
        objectRef.current = gltf.scene;
        scene.add(gltf.scene);
        if (pendingTextureRef.current) {
          applyTextureToObject(pendingTextureRef.current);
        }
      },
      (err) => console.error('Error al cargar GLB:', err)
    );
  };

  const loadPlaceholder = (scene: THREE.Scene) => {
    const geo = new THREE.BoxGeometry(1.6, 1.6, 1.6);
    const mat = new THREE.MeshStandardMaterial({ color: 0xffd500 });
    const cube = new THREE.Mesh(geo, mat);
    scene.add(cube);
    objectRef.current = cube;
    if (pendingTextureRef.current) {
      applyTextureToObject(pendingTextureRef.current);
    }
  };

  const applyTextureToObject = (uri: string) => {
    new THREE.TextureLoader().load(
      uri,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        objectRef.current?.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const mat = mesh.material as THREE.MeshStandardMaterial;
            if (mat && 'map' in mat) {
              mat.map = texture;
              mat.needsUpdate = true;
            }
          }
        });
      },
      undefined,
      (err) => console.error('Error al cargar textura:', err)
    );
  };

  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

    // Renderer de expo-three: crea el canvas correcto en web y en nativo
    // Workaround para expo-gl 58.0.4: three.js r163+ rechaza el contexto
    // de WebGL2 de expo-gl porque hereda de WebGLRenderingContext. Hacemos
    // que WebGLRenderingContext sea undefined solo durante la creación
    // del renderer, para que three.js omita la comprobación de WebGL 1.
    const g = globalThis as any;
    const savedWebGL1 = g.WebGLRenderingContext;
    g.__webgl1Hidden = true;
    g.WebGLRenderingContext = undefined;
    let renderer!: THREE.WebGLRenderer;
    try {
      renderer = new Renderer({ gl }) as unknown as THREE.WebGLRenderer;
      renderer.setSize(width, height);
      renderer.setClearColor(0x0b0b0c, 1);
      rendererRef.current = renderer;
    } finally {
      g.WebGLRenderingContext = savedWebGL1;
      g.__webgl1Hidden = false;
    }

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const dir = new THREE.DirectionalLight(0xffffff, 1.1);
    dir.position.set(2, 5, 2);
    scene.add(dir);

    if (modelModule) {
      await loadGlb(scene, modelModule);
    } else {
      loadPlaceholder(scene);
    }

    const render = () => {
      requestAnimationFrame(render);
      if (objectRef.current) objectRef.current.rotation.y += 0.006;
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    render();
  };

  useEffect(() => {
    if (!textureUri) return;
    if (objectRef.current) {
      applyTextureToObject(textureUri);
    } else {
      pendingTextureRef.current = textureUri;
    }
  }, [textureUri]);

  return <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />;
}
