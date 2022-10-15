import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AmbientLight, PerspectiveCamera, Scene, SpotLight, sRGBEncoding, WebGLRenderer} from 'three';
import {noop, Subscription} from 'rxjs';
import {GLTF, GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader';
import {RequestAnimationFrame} from '../../../helpers';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {Light} from 'three/src/lights/Light';

@Component({
  selector: 'app-tamagotchi-page',
  templateUrl: './tamagotchi-page.component.html',
  styleUrls: ['./tamagotchi-page.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class TamagotchiPageComponent implements OnInit, OnDestroy {

  render$?: Subscription;

  scene = new Scene();
  loader = new GLTFLoader();

  renderer!: WebGLRenderer;
  camera!: PerspectiveCamera;
  controls?: OrbitControls;

  lighting: Array<Light> = [];

  @ViewChild('canvasElement', {static: true})
  canvasElement!: ElementRef<HTMLCanvasElement>;

  @HostListener('window:resize')
  onResize() {
    const {width, height} = this.elRef.nativeElement.getBoundingClientRect();
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
  }

  constructor(private elRef: ElementRef) {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderConfig({type: 'js'});
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    this.loader.setDRACOLoader(dracoLoader);
  }

  modelLoaded(gltf: GLTF) {
    gltf.scene.scale.set(0.075, 0.075, 0.075);
    gltf.scene.position.set(0, -0.75, 0);
    this.scene.add(gltf.scene);
  }

  modelError(error: any) {
  }

  enableAutorotate() {
    this.controls = new OrbitControls(
      this.camera,
      this.canvasElement.nativeElement,
    );

    this.controls.autoRotate = true;
    this.controls.enablePan = false;
    this.controls.enableZoom = false;
    this.controls.enableRotate = false;
    this.controls.autoRotateSpeed = 0.75;
  }

  initLighting() {
    const ambient = new AmbientLight('#FFF', 3);
    const front = new SpotLight('#00F', 1);
    front.position.set(0, 0, 5);

    const right = new SpotLight('#F00', 1);
    right.position.set(5, 0, 0);

    const left = new SpotLight('#0F0', 1);
    left.position.set(-5, 0, 0);

    const top = new SpotLight('#F0F', 1);
    top.position.set(0, 5, 0);

    const bottom = new SpotLight('#0FF', 1);
    bottom.position.set(0, -5, 0);

    const rear = new SpotLight('#FF0', 1);
    rear.position.set(0, -5, 0);

    this.lighting.push(ambient);
    this.lighting.push(front);
    this.lighting.push(rear);
    this.lighting.push(right);
    this.lighting.push(left);
    this.lighting.push(top);
    this.lighting.push(bottom);

    this.lighting.forEach(light => this.scene.add(light));
  }

  ngOnInit() {
    const canvas = this.canvasElement.nativeElement;
    const {width, height} = this.elRef.nativeElement.getBoundingClientRect();

    this.camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 2);

    this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas,
    });

    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = sRGBEncoding;
    this.renderer.setPixelRatio(3);

    this.enableAutorotate();
    this.initLighting();
    this.loader.load(
      '/assets/tamagotchi/scene.gltf',
      (...props) => this.modelLoaded(...props),
      noop,
      (...props) => this.modelError(...props),
    );

    this.renderer.setSize(width, height);
    this.render$ = RequestAnimationFrame()
      .subscribe(() => {
        this.controls?.update();
        this.renderer.render(this.scene, this.camera)
      });
  }

  ngOnDestroy() {
    this.render$?.unsubscribe();
  }


}
