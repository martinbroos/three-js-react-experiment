import React, { createRef, Component } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';

type Props = {};

class ThreeJsGrid extends Component<Props> {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private tattooedLetterObjects: Array<THREE.Mesh> = [];
  private canvasRef = createRef<HTMLDivElement>();
  private controls = OrbitControls;

  constructor(props: Props) {
    super(props);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.renderer = new THREE.WebGLRenderer();

    window.addEventListener('resize', this.onWindowResize);
  }

  public componentDidMount() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.canvasRef.current!.appendChild(this.renderer.domElement);

    this.createTattooedLetterElements();

    this.initCamera();
    this.createControls();

    this.renderer.setAnimationLoop(() => {
      this.update();
      this.renderScene();
    });
  }

  public componentWillUnmount() {
    this.canvasRef.current!.removeChild(this.renderer.domElement);
  }

  private onWindowResize = () => {
    const container = this.canvasRef.current!;

    // set the aspect ratio to match the new browser window aspect ratio
    this.camera.aspect = container.clientWidth / container.clientHeight;

    // update the camera's frustum
    this.camera.updateProjectionMatrix();

    // update the size of the renderer AND the canvas
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  };

  private createTattooedLetterElements() {
    const geometry = new THREE.BoxBufferGeometry(1, 1, 0.1);
    const textureLoader = new THREE.TextureLoader();
    const currentTexture = textureLoader.load('https://picsum.photos/256/256');
    const material = new THREE.MeshBasicMaterial({
      map: currentTexture
    });

    for (let i = 1; i < 100; i++) {
      const cube = new THREE.Mesh(geometry, material);

      cube.position.x = i % 2 === 0 ? -1 : 1;
      cube.position.y = 0;
      cube.position.z = i * 2;

      this.tattooedLetterObjects.push(cube);

      this.scene.add(cube);
    }
  }

  private initCamera() {
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = this.getPositionOfFirstTattooElement() + 5;
  }

  private createControls() {
    // @ts-ignore
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // @ts-ignore
    this.controls.enableZoom = true;

    // @ts-ignore
    this.controls.enableDamping = true;
    // @ts-ignore
    this.controls.dampingFactor = 0.12;

    // @ts-ignore
    this.controls.maxDistance = this.getPositionOfFirstTattooElement() + 5;
  }

  private getPositionOfFirstTattooElement() {
    return this.tattooedLetterObjects[this.tattooedLetterObjects.length - 1]
      .position.z;
  }

  private update = () => {
    // handle animations
    // @ts-ignore
    this.controls.update(); // only required when enableDamping is true
  };

  private renderScene() {
    this.renderer.render(this.scene, this.camera);
  }

  public render() {
    return (
      <div
        style={{ width: window.innerWidth, height: window.innerHeight }}
        ref={this.canvasRef}
      />
    );
  }
}

export default ThreeJsGrid;
