import * as T from 'three';
// eslint-disable-next-line import/no-unresolved
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

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
    
    // 開始渲染循環
    this.render();
    
    // 添加窗口大小調整事件
    this.setResize();
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
    this.camera.position.set(0, 0, 1);
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
    // 創建平面幾何體
    this.planeGeometry = new T.PlaneGeometry(1, 1, 128, 128);
    
    // 創建著色器材質
    this.planeMaterial = new T.ShaderMaterial({
      side: T.DoubleSide,
      // T.FrontSide：只渲染正面
      // T.BackSide：只渲染內部或背面（例如球體的內部）
      // T.DoubleSide：當物體很薄（例如紙張、平面或薄片物體）並且需要渲染正反兩面時使用
      
      // wireframe: true,  // 線框模式
      
      fragmentShader: fragment,  // 像素著色器，處理顏色、光照等
      vertexShader: vertex,      // 頂點著色器，處理形狀、位置、變形等
      
      uniforms: {
        time: { type: 'f', value: 0 },  // 浮點數類型，用於控制動畫或過渡的進度
        uTexture: { value: this.textures[0] },  // 紋理1
        texture3: { type: 't', value: this.textures[2] }  // 紋理3 (type t 表示紋理)
      }
    });
    
    // 創建網格並添加到場景
    this.planeMesh = new T.Mesh(this.planeGeometry, this.planeMaterial);
    this.scene.add(this.planeMesh);
  }

  /**
   * 渲染循環
   * 每幀更新場景並渲染
   */
  render() {
    // 修正渲染邏輯 - 應該在 isPlaying 為 true 時渲染
    if (this.isPlaying) {
      const elapsedTime = this.clock.getElapsedTime();
      
      // 更新著色器中的時間值
      if (this.planeMaterial) {
        this.planeMaterial.uniforms.time.value = elapsedTime;
      }
      
      // 渲染場景
      this.renderer.render(this.scene, this.camera);
      
      // 設置背景顏色
      this.renderer.setClearColor(0xededed, 1);  // 非幾何體背景顏色設為 #ededed，1 表示完全不透明
    }
    
    // 請求下一幀 (無論是否 isPlaying 都保持渲染循環)
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
  }

  /**
   * 開始動畫
   */
  play() {
    this.isPlaying = true;
  }

  // /**
  //  * 暫停動畫
  //  */
  pause() {
    this.isPlaying = false;
  }
}