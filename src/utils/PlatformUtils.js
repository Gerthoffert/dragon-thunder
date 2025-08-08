// Utility functions for cross-platform game optimization
export class PlatformUtils {
  static detectPlatform() {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;

    return {
      isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
      isTablet: /iPad|Android(?!.*Mobile)/i.test(userAgent),
      isIOS: /iPad|iPhone|iPod/.test(userAgent),
      isAndroid: /Android/i.test(userAgent),
      isTouchDevice: 'ontouchstart' in window,
      isRetina: window.devicePixelRatio > 1,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
    };
  }

  static getOptimalConfig() {
    const platform = this.detectPlatform();

    // Performance settings based on device
    const config = {
      maxParticles: platform.isMobile ? 20 : 50,
      maxAudioChannels: platform.isMobile ? 2 : 8,
      textureQuality: platform.isMobile ? 0.8 : 1.0,
      enableShadows: !platform.isMobile,
      antialiasing: !platform.isMobile,
      maxStars: platform.isMobile ? 30 : 50,
      animationFrameRate: platform.isMobile ? 30 : 60,
    };

    return { platform, config };
  }

  static optimizeForDevice(scene) {
    const { platform, config } = this.getOptimalConfig();

    // Set physics world bounds efficiently
    if (scene.physics && scene.physics.world) {
      scene.physics.world.setBounds(0, 0, scene.gameWidth, scene.gameHeight);
    }

    // Optimize textures for mobile
    if (platform.isMobile && scene.textures) {
      scene.textures.list.forEach((texture) => {
        if (texture.source && texture.source[0]) {
          texture.source[0].scaleMode = 1; // LINEAR scaling for better performance
        }
      });
    }

    return config;
  }

  static addTouchControls(scene) {
    const platform = this.detectPlatform();

    if (platform.isTouchDevice) {
      // Prevent default touch behaviors that might interfere with game
      document.addEventListener(
        'touchstart',
        (e) => {
          if (e.target.closest('#game-container')) {
            e.preventDefault();
          }
        },
        { passive: false }
      );

      document.addEventListener(
        'touchmove',
        (e) => {
          if (e.target.closest('#game-container')) {
            e.preventDefault();
          }
        },
        { passive: false }
      );

      // Add haptic feedback for supported devices
      if ('vibrate' in navigator) {
        scene.input.on('pointerdown', () => {
          navigator.vibrate(50); // Short vibration on touch
        });
      }
    }
  }

  static setupResponsiveText(scene, textObject, baseFontSize) {
    const platform = this.detectPlatform();

    // Dynamic font sizing based on screen size
    const scaleFactor = Math.min(scene.gameWidth / 1024, scene.gameHeight / 768);

    const fontSize = Math.max(
      baseFontSize * scaleFactor * (platform.isMobile ? 0.8 : 1),
      baseFontSize * 0.5 // Minimum size
    );

    textObject.setFontSize(fontSize);

    // Adjust line spacing for mobile readability
    if (platform.isMobile && textObject.style) {
      textObject.setLineSpacing(fontSize * 0.2);
    }

    return textObject;
  }

  static preloadOptimization(scene) {
    const { platform, config } = this.getOptimalConfig();

    // Set loading preferences
    scene.load.maxParallelDownloads = platform.isMobile ? 2 : 4;

    // Add loading progress for better UX
    scene.load.on('progress', (progress) => {
      console.log(`Loading: ${Math.round(progress * 100)}%`);
    });

    // Optimize image loading for mobile
    if (platform.isMobile) {
      scene.load.setBaseURL(''); // Ensure relative paths work
    }
  }
}

// Battery and performance monitoring
export class PerformanceMonitor {
  constructor(scene) {
    this.scene = scene;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fps = 60;
    this.lowFpsCount = 0;
  }

  update() {
    this.frameCount++;
    const currentTime = performance.now();

    if (currentTime - this.lastTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
      this.frameCount = 0;
      this.lastTime = currentTime;

      // Auto-adjust quality based on performance
      if (this.fps < 30) {
        this.lowFpsCount++;
        if (this.lowFpsCount > 3) {
          this.reduceQuality();
          this.lowFpsCount = 0;
        }
      } else {
        this.lowFpsCount = 0;
      }
    }
  }

  reduceQuality() {
    console.log('Performance: Reducing quality settings');

    // Reduce particle effects
    if (this.scene.particles) {
      this.scene.children.list.forEach((child) => {
        if (child.type === 'ParticleEmitterManager') {
          child.emitters.list.forEach((emitter) => {
            emitter.setQuantity(emitter.quantity.propertyValue * 0.7);
          });
        }
      });
    }

    // Reduce animation frame rates
    this.scene.anims.globalTimeScale = 0.8;
  }

  getBatteryInfo() {
    if ('getBattery' in navigator) {
      return navigator.getBattery().then((battery) => ({
        level: battery.level,
        charging: battery.charging,
        shouldOptimize: battery.level < 0.2 && !battery.charging,
      }));
    }
    return Promise.resolve({ shouldOptimize: false });
  }
}
