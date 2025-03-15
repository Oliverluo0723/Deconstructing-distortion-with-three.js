import * as T from 'three';
// eslint-disable-next-line import/no-unresolved
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { CustomPass } from './CustomPass';

// 引入 dat.GUI 庫用於調試界面
import * as dat from 'dat.gui';

import { RGBShiftShader } from 'three/addons/shaders/RGBShiftShader.js';
import { DotScreenShader } from 'three/addons/shaders/DotScreenShader.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

import fragment from '../shaders/fragment.glsl';
import vertex from '../shaders/vertex.glsl';

import img1 from "../assets/視覺1.jpg";
import img2 from "../assets/視覺2.jpg";
import img3 from "../assets/視覺3.jpg";

/**
 * 設備信息
 * 存儲窗口尺寸和像素比例
 */
const device = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: window.devicePixelRatio
};

export default class Three {
  constructor(canvas, options = {}) {
    // 初始化基本屬性
    this.canvas = canvas;
    
    // 確保 container 存在，如果未提供則使用 document.body
    this.container = options.dom || document.body;
    this.width = this.container.offsetWidth || window.innerWidth;
    this.height = this.container.offsetHeight || window.innerHeight;
    
    // 初始化時鐘和狀態
    this.clock = new T.Clock();
    this.isPlaying = true;
    this.time = 0; // 初始化時間變量

    // 設置場景
    this.initScene();
    
    // 設置相機
    this.initCamera();
    
    // 設置渲染器
    this.initRenderer();
    
    // 設置軌道控制
    this.initControls();
    
    // 加載紋理
    this.loadTextures();
    
    // 設置光源
    this.setLights();
    
    // 設置幾何體
    this.setGeometry();

    // 初始化後期處理
    this.initPost();
    
    // 初始化GUI設置
    this.setting();
    
    // 開始渲染循環
    this.render();
    
    // 添加窗口大小調整事件
    this.setResize();
  }

  initPost(){
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));

    this.effect1 = new ShaderPass(CustomPass);
    this.composer.addPass(this.effect1);

    // 其他效果（已注釋）
    // const effect2 = new ShaderPass(RGBShiftShader);
    // effect2.uniforms['amount'].value = 0.0015;
    // this.composer.addPass(effect2);

    // const effect3 = new OutputPass();
    // this.composer.addPass(effect3);
  }

  setting(){
    // 初始化設置對象
    this.setting = {
      progress: 0,
    };
    
    // 使用正確的 GUI 庫
    this.gui = new dat.GUI();
    this.gui.add(this.setting, "progress", 0, 1, 0.01);
  }

  /**
   * 初始化場景
   */
  initScene() {
    this.scene = new T.Scene();
  }

  /**
   * 初始化相機
   */
  initCamera() {
    this.camera = new T.PerspectiveCamera(
      75,
      this.width / this.height,
      0.1,
      100
    );
    this.camera.position.set(0, 0, 2);
    this.scene.add(this.camera);
  }

  /**
   * 初始化渲染器
   */
  initRenderer() {
    this.renderer = new T.WebGLRenderer({
      canvas: this.canvas,       // 將渲染結果渲染到指定的 canvas 元素
      alpha: true,               // 允許透明背景
      antialias: true,           // 啟用抗鋸齒（平滑邊緣）
      preserveDrawingBuffer: true // 保留繪圖緩衝區（用於抓取畫面快照）
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(device.pixelRatio, 2));
  }

  /**
   * 初始化軌道控制
   */
  initControls() {
    this.controls = new OrbitControls(this.camera, this.canvas);

    this.controls.enableDamping = true; // 啟用阻尼效果，使控制更加平滑
    this.controls.dampingFactor = 0.05; // 阻尼系數
    this.controls.enableZoom = true;    // 允許縮放
    this.controls.enablePan = true;     // 允許平移
    this.controls.rotateSpeed = 2;      // 旋轉速度
  }

  /**
   * 加載紋理
   * 將圖片加載為 Three.js 紋理
   */
  loadTextures() {
    this.urls = [img1, img2, img3];
    // 初始化紋理數組
    this.textures = [];
    
    // 創建加載器實例
    const textureLoader = new T.TextureLoader();
    
    // 加載每個紋理並添加到數組
    this.urls.forEach((url) => {
      const texture = textureLoader.load(url);
      this.textures.push(texture);
    });
    
    console.log("紋理加載中:", this.textures);
  }

  /**
   * 設置光源
   * 添加環境光以確保場景被照亮
   */
  setLights() {
    this.ambientLight = new T.AmbientLight(new T.Color(1, 1, 1, 1));
    this.scene.add(this.ambientLight);
  }

  /**
   * 設置幾何體
   * 創建平面網格並應用著色器材質
   */
  setGeometry() {
    // 圖 672*384 長寬比 = 1.75
    this.planeGeometry = new T.PlaneGeometry(1.75/2, 1/2, 64, 64);
    
    // 首先創建基本著色器材質
    this.material = new T.ShaderMaterial({
      side: T.DoubleSide,
      // T.FrontSide：只渲染正面
      // T.BackSide：只渲染內部或背面（例如球體的內部）
      // T.DoubleSide：當物體很薄（例如紙張、平面或薄片物體)
      
      // wireframe: true, 
      
      fragmentShader: fragment,  // 像素著色器，處理顏色、光照等
      vertexShader: vertex,      // 頂點著色器，處理形狀、位置、變形等
      
      uniforms: {
        time: { type: 'f', value: 0 },          // 浮點數類型，用於控制動畫或過渡的進度
        uTexture: { value: this.textures[0] },  // 紋理1
        texture3: { type: 't', value: this.textures[2] }  // 紋理3 (type t 表示紋理)
      }
    });
    
    // 保存一個引用作為 planeMaterial 以便在渲染循環中使用
    this.planeMaterial = this.material;
    
    // 創建多個網格，每個網格使用不同的紋理
    this.meshes = [];

    this.textures.forEach((t, i) => {
      // 克隆材質以便於每個網格使用不同的紋理
      let m = this.material.clone();
      m.uniforms.uTexture.value = t;
      
      // 創建網格並添加到場景
      let mesh = new T.Mesh(this.planeGeometry, m);
      this.scene.add(mesh);
      this.meshes.push(mesh);
      mesh.position.x = i - 1;  // 水平排列網格
    });
  }

  /**
   * 渲染循環
   * 每幀更新場景並渲染
   */
  render() {
    // 只有在 isPlaying 為 true 時才更新和渲染
    if (this.isPlaying) {
      const elapsedTime = this.clock.getElapsedTime();
      
      // 更新所有材質中的時間值
      if (this.meshes && this.meshes.length > 0) {
        this.meshes.forEach(mesh => {
          if (mesh.material && mesh.material.uniforms && mesh.material.uniforms.time) {
            mesh.material.uniforms.time.value = elapsedTime;
          }
        });
      }

      this.time += 0.05;
      
      // 更新著色器中的 uniforms
      this.effect1.uniforms['time'].value = this.time;
      
      // 檢查 setting 對象是否存在
      if (this.setting) {
        this.effect1.uniforms['progress'].value = this.setting.progress;
      }
      
      // 設置背景顏色（應該在 composer.render 之前）
      this.renderer.setClearColor(0xededed, 1);  // 非幾何體背景顏色設為 #ededed，1 表示完全不透明
      
      // 使用 composer 進行渲染
      this.composer.render();
    }
    
    requestAnimationFrame(this.render.bind(this));
  }

  /**
   * 設置窗口大小調整事件
   */
  setResize() {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  /**
   * 窗口大小調整處理函數
   * 更新相機和渲染器以適應新的窗口大小
   */
  onResize() {
    // 更新設備信息
    device.width = window.innerWidth;
    device.height = window.innerHeight;
    
    // 更新容器尺寸
    this.width = this.container.offsetWidth || window.innerWidth;
    this.height = this.container.offsetHeight || window.innerHeight;
    
    // 更新相機
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    
    // 更新渲染器
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(device.pixelRatio, 2));
    
    // 更新 composer 尺寸
    this.composer.setSize(this.width, this.height);
  }

  /**
   * 開始動畫
   */
  play() {
    this.isPlaying = true;
  }

  /**
   * 暫停動畫
   */
  pause() {
    this.isPlaying = false;
  }
}