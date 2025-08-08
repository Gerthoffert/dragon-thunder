export default class IntroScene extends Phaser.Scene {
  constructor() {
    super({ key: 'IntroScene' });
    this.orientationManager = null;
  }

  preload() {
    console.log('IntroScene: Starting preload...');
  }

  create() {
    // Get current game dimensions
    this.gameWidth = this.sys.game.config.width;
    this.gameHeight = this.sys.game.config.height;

    // Determine device type for better scaling
    this.deviceType = this.getDeviceType();

    // Get orientation manager instance
    this.orientationManager = window.orientationManager;

    // Get layout positions optimized for orientation
    const layout = this.orientationManager
      ? this.orientationManager.getLandscapeLayout()
      : this.getDefaultLayout();

    // Create modern background with gradient overlay
    this.createModernBackground();

    // Create enhanced particle system
    this.createParticleSystem();

    const centerX = this.gameWidth / 2;

    // Create title with modern effects
    this.createModernTitle(centerX, layout);

    // Create subtitle with animation
    this.createSubtitle(centerX, layout);

    // Create story section with modern card design
    this.createStorySection(centerX, layout);

    // Create character selection
    this.createCharacterSelection(centerX, layout);

    // Listen for resize events
    this.scale.on('resize', this.resize, this);
  }

  createModernBackground() {
    // Simple gradient background with modern colors
    const bg1 = this.add.rectangle(0, 0, this.gameWidth, this.gameHeight, 0x0f0f23, 1);
    bg1.setOrigin(0, 0);

    const bg2 = this.add.rectangle(0, 0, this.gameWidth, this.gameHeight, 0x1a1a2e, 0.7);
    bg2.setOrigin(0, 0);

    // Static overlay for depth
    const overlay = this.add.rectangle(0, 0, this.gameWidth, this.gameHeight, 0x16213e, 0.2);
    overlay.setOrigin(0, 0);
  }

  createParticleSystem() {
    // Simple static stars for modern look without animation overhead
    this.createStaticStars();
  }

  createStaticStars() {
    const starCount = this.deviceType === 'mobile' ? 20 : 35;

    for (let i = 0; i < starCount; i++) {
      const x = Phaser.Math.Between(0, this.gameWidth);
      const y = Phaser.Math.Between(0, this.gameHeight * 0.6);
      const size = this.scaleValue(Phaser.Math.Between(1, 3));
      const brightness = Phaser.Math.FloatBetween(0.3, 0.8);

      const star = this.add.circle(x, y, size, 0xffffff);
      star.setAlpha(brightness);
    }
  }

  createModernTitle(centerX, layout) {
    // Clean title with modern typography
    const title = this.add
      .text(centerX, this.gameHeight * layout.titleY, 'Le Tonnerre du Dragon', {
        fontSize: this.scaleFont(this.deviceType === 'mobile' ? 42 : 52),
        fill: '#FFD700',
        fontFamily: 'Cinzel, Georgia, serif',
        fontWeight: '600',
        stroke: '#e94560',
        strokeThickness: this.scaleValue(2),
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: '#000000',
          blur: 6,
          stroke: false,
          fill: true,
        },
      })
      .setOrigin(0.5);

    return title;
  }

  createSubtitle(centerX, layout) {
    const subtitle = this.add
      .text(centerX, this.gameHeight * layout.subtitleY, 'Chapitre 1: La Nuit du Tonnerre', {
        fontSize: this.scaleFont(this.deviceType === 'mobile' ? 22 : 26),
        fill: '#a0a0a0',
        fontFamily: 'Inter, Arial, sans-serif',
        fontWeight: '400',
        shadow: {
          offsetX: 1,
          offsetY: 1,
          color: '#000000',
          blur: 4,
          stroke: false,
          fill: true,
        },
      })
      .setOrigin(0.5);

    return subtitle;
  }

  createStorySection(centerX, layout) {
    // Story text with better mobile formatting and larger text
    const storyText =
      this.deviceType === 'mobile'
        ? `Dans le village de Millhaven, la nuit du tonnerre change tout.

Un grondement mystérieux secoue le ciel, éveillant deux jeunes habitants: Kiara et Finn.

Qui serez-vous pour affronter les mystères de cette nuit?`
        : `Dans le village de Millhaven, la nuit du tonnerre change tout.
        
    Un grondement mystérieux secoue le ciel, éveillant la curiosité de deux jeunes habitants:
    Kiara, une fille aventureuse de 12 ans au courage sans limite, et Finn, un inventeur
    ingénieux du même âge.
        
    Une aventure dangereuse mais fascinante vous attend. Qui serez-vous pour
    affronter les mystères de la nuit du tonnerre?`;

    // Create a subtle background for the story text
    const storyBg = this.add.rectangle(
      centerX,
      this.gameHeight * layout.storyY,
      this.gameWidth * (this.deviceType === 'mobile' ? 0.9 : 0.85),
      this.scaleValue(this.deviceType === 'mobile' ? 160 : 140),
      0x1a1a2e,
      0.3
    );
    storyBg.setStrokeStyle(1, 0x2d2d44, 0.5);

    const story = this.add
      .text(centerX, this.gameHeight * layout.storyY, storyText, {
        fontSize: this.scaleFont(this.deviceType === 'mobile' ? 18 : 19),
        fill: '#ffffff',
        fontFamily: 'Inter, Arial, sans-serif',
        fontWeight: '400',
        align: 'center',
        wordWrap: { width: this.gameWidth * (this.deviceType === 'mobile' ? 0.85 : 0.8) },
        lineSpacing: layout.spacing === 'compact' ? 10 : this.deviceType === 'mobile' ? 14 : 6,
        shadow: {
          offsetX: 1,
          offsetY: 1,
          color: '#000000',
          blur: 3,
          stroke: false,
          fill: true,
        },
      })
      .setOrigin(0.5);

    return story;
  }

  createCharacterSelection(centerX, layout) {
    // Character selection title
    const selectionTitle = this.add
      .text(centerX, this.gameHeight * layout.selectionY, 'Choisissez votre personnage:', {
        fontSize: this.scaleFont(this.deviceType === 'mobile' ? 20 : 22),
        fill: '#FFD700',
        fontFamily: 'Inter, Arial, sans-serif',
        fontWeight: '500',
        shadow: {
          offsetX: 1,
          offsetY: 1,
          color: '#000000',
          blur: 4,
          stroke: false,
          fill: true,
        },
      })
      .setOrigin(0.5);

    // Create character buttons
    this.createCharacterButtons();
  }

  createCharacterButtons() {
    const centerX = this.gameWidth / 2;
    const buttonWidth = this.scaleValue(this.deviceType === 'mobile' ? 250 : 200);
    const buttonHeight = this.scaleValue(this.deviceType === 'mobile' ? 70 : 60);

    // Get layout positions
    const layout = this.orientationManager
      ? this.orientationManager.getLandscapeLayout()
      : this.getDefaultLayout();

    // Button positioning based on device and orientation
    let kiaraX, kiaraY, finnX, finnY;

    if (this.deviceType === 'mobile') {
      // For mobile landscape, place buttons horizontally
      if (this.orientationManager && this.orientationManager.isLandscape()) {
        kiaraX = this.gameWidth * 0.35;
        finnX = this.gameWidth * 0.65;
        kiaraY = finnY = this.gameHeight * layout.buttonsY;
      } else {
        // Fallback to vertical layout if not landscape
        kiaraX = finnX = centerX;
        kiaraY = this.gameHeight * 0.65;
        finnY = this.gameHeight * 0.78;
      }
    } else if (this.deviceType === 'tablet') {
      // Slightly closer together on tablet
      kiaraX = this.gameWidth * 0.3;
      finnX = this.gameWidth * 0.7;
      kiaraY = finnY = this.gameHeight * layout.buttonsY;
    } else {
      // Desktop layout
      kiaraX = this.gameWidth * 0.35;
      finnX = this.gameWidth * 0.65;
      kiaraY = finnY = this.gameHeight * layout.buttonsY;
    }

    // Kiara button with clean modern design
    const kiaraBtn = this.add
      .rectangle(kiaraX, kiaraY, buttonWidth, buttonHeight, 0x4a90e2, 0.8)
      .setInteractive()
      .setStrokeStyle(2, 0x5ba0f2, 0.6);

    // Simple hover effects without complex animations
    kiaraBtn
      .on('pointerdown', () => {
        this.selectCharacter('kiara');
        kiaraBtn.setScale(0.95);
        this.time.delayedCall(100, () => kiaraBtn.setScale(1));
      })
      .on('pointerover', () => {
        kiaraBtn.setFillStyle(0x5ba0f2, 0.9);
        kiaraBtn.setScale(1.05);
      })
      .on('pointerout', () => {
        kiaraBtn.setFillStyle(0x4a90e2, 0.8);
        kiaraBtn.setScale(1);
      });

    const kiaraText = this.add
      .text(kiaraX, kiaraY, 'Kiara\n(Aventureuse)', {
        fontSize: this.scaleFont(this.deviceType === 'mobile' ? 18 : 16),
        fill: '#FFFFFF',
        fontFamily: 'Inter, Arial, sans-serif',
        fontWeight: '500',
        align: 'center',
        shadow: {
          offsetX: 1,
          offsetY: 1,
          color: '#000000',
          blur: 3,
          stroke: false,
          fill: true,
        },
      })
      .setOrigin(0.5);

    // Finn button with clean modern design
    const finnBtn = this.add
      .rectangle(finnX, finnY, buttonWidth, buttonHeight, 0xe94560, 0.8)
      .setInteractive()
      .setStrokeStyle(2, 0xf75c4c, 0.6);

    // Simple hover effects
    finnBtn
      .on('pointerdown', () => {
        this.selectCharacter('finn');
        finnBtn.setScale(0.95);
        this.time.delayedCall(100, () => finnBtn.setScale(1));
      })
      .on('pointerover', () => {
        finnBtn.setFillStyle(0xf75c4c, 0.9);
        finnBtn.setScale(1.05);
      })
      .on('pointerout', () => {
        finnBtn.setFillStyle(0xe94560, 0.8);
        finnBtn.setScale(1);
      });

    const finnText = this.add
      .text(finnX, finnY, 'Finn\n(Inventeur)', {
        fontSize: this.scaleFont(this.deviceType === 'mobile' ? 18 : 16),
        fill: '#FFFFFF',
        fontFamily: 'Inter, Arial, sans-serif',
        fontWeight: '500',
        align: 'center',
        shadow: {
          offsetX: 1,
          offsetY: 1,
          color: '#000000',
          blur: 3,
          stroke: false,
          fill: true,
        },
      })
      .setOrigin(0.5);
  }

  // Device detection helper
  getDeviceType() {
    const width = this.gameWidth;
    const height = this.gameHeight;
    const aspectRatio = width / height;

    if (width <= 480 || (width <= 768 && aspectRatio < 1.3)) {
      return 'mobile';
    } else if (width <= 1024) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }

  // Default layout positions when orientation manager is not available
  getDefaultLayout() {
    return {
      titleY: 0.08,
      subtitleY: 0.14,
      storyY: 0.35,
      selectionY: 0.55,
      buttonsY: 0.7,
      spacing: 'normal',
    };
  }

  // Helper methods for responsive design with better mobile readability
  scaleValue(value) {
    const baseWidth = this.deviceType === 'mobile' ? 320 : 1024;
    const baseHeight = this.deviceType === 'mobile' ? 568 : 768;
    const scaleFactor = Math.min(this.gameWidth / baseWidth, this.gameHeight / baseHeight);

    // More aggressive scaling for mobile to ensure readability
    if (this.deviceType === 'mobile') {
      return Math.max(value * scaleFactor * 1.2, value * 0.8); // Minimum 80% scaling for mobile
    } else {
      return Math.max(value * scaleFactor, value * 0.6); // Standard scaling for desktop
    }
  }

  scaleFont(size) {
    const scaledSize = this.scaleValue(size);

    // Additional boost for very small screens
    if (this.deviceType === 'mobile' && this.gameWidth < 400) {
      return `${Math.max(scaledSize * 1.15, size * 0.9)}px`;
    }

    return `${scaledSize}px`;
  }

  resize(gameSize) {
    // Update cached game dimensions
    this.gameWidth = gameSize.width;
    this.gameHeight = gameSize.height;

    // Reset and recreate the scene when resized
    this.scene.restart();
  }

  selectCharacter(character) {
    window.gameState.currentCharacter = character;
    this.scene.start('FinnHouseScene');
  }
}
