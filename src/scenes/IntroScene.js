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

    // Create modern animated stars with glow effect
    const starCount = this.deviceType === 'mobile' ? 30 : 50;
    this.stars = [];

    for (let i = 0; i < starCount; i++) {
      const x = Phaser.Math.Between(0, this.gameWidth);
      const y = Phaser.Math.Between(0, this.gameHeight * 0.4);
      const size = this.scaleValue(Phaser.Math.Between(1, 3));

      const star = this.add.circle(x, y, size, 0xffffff);
      star.setAlpha(Phaser.Math.FloatBetween(0.3, 1));

      // Add subtle animation to stars
      this.tweens.add({
        targets: star,
        alpha: Phaser.Math.FloatBetween(0.2, 1),
        duration: Phaser.Math.Between(2000, 4000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      this.stars.push(star);
    }

    const centerX = this.gameWidth / 2;

    // Modern title with gradient effect - positioned for landscape
    const title = this.add
      .text(centerX, this.gameHeight * layout.titleY, 'Le Tonnerre du Dragon', {
        fontSize: this.scaleFont(this.deviceType === 'mobile' ? 42 : 48),
        fill: '#FFD700',
        fontFamily: 'Cinzel, Georgia, serif',
        fontWeight: '600',
        stroke: '#e94560',
        strokeThickness: this.scaleValue(2),
      })
      .setOrigin(0.5);

    // Add glow effect to title
    this.tweens.add({
      targets: title,
      alpha: 0.8,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.add
      .text(centerX, this.gameHeight * layout.subtitleY, 'Chapitre 1: La Nuit du Tonnerre', {
        fontSize: this.scaleFont(this.deviceType === 'mobile' ? 22 : 24),
        fill: '#a0a0a0',
        fontFamily: 'Inter, Arial, sans-serif',
        fontWeight: '400',
      })
      .setOrigin(0.5);

    // Story text - with better mobile formatting and larger text
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

    this.add
      .text(centerX, this.gameHeight * layout.storyY, storyText, {
        fontSize: this.scaleFont(this.deviceType === 'mobile' ? 18 : 18),
        fill: '#ffffff',
        fontFamily: 'Inter, Arial, sans-serif',
        fontWeight: '400',
        align: 'center',
        wordWrap: { width: this.gameWidth * (this.deviceType === 'mobile' ? 0.85 : 0.8) },
        lineSpacing: layout.spacing === 'compact' ? 8 : this.deviceType === 'mobile' ? 12 : 4,
        shadow: {
          offsetX: 1,
          offsetY: 1,
          color: '#000000',
          blur: 2,
          stroke: false,
          fill: true,
        },
      })
      .setOrigin(0.5);

    // Character selection with modern styling - positioned for landscape
    this.add
      .text(centerX, this.gameHeight * layout.selectionY, 'Choisissez votre personnage:', {
        fontSize: this.scaleFont(this.deviceType === 'mobile' ? 20 : 20),
        fill: '#FFD700',
        fontFamily: 'Inter, Arial, sans-serif',
        fontWeight: '500',
      })
      .setOrigin(0.5);

    // Button layout based on device type
    this.createCharacterButtons();

    // Listen for resize events
    this.scale.on('resize', this.resize, this);
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

    // Kiara button with modern gradient design
    const kiaraBtn = this.add
      .rectangle(kiaraX, kiaraY, buttonWidth, buttonHeight, 0x4a90e2)
      .setInteractive()
      .setStrokeStyle(2, 0x5ba0f2)
      .on('pointerdown', () => {
        this.selectCharacter('kiara');
        // Add button press effect
        this.tweens.add({
          targets: kiaraBtn,
          scaleX: 0.95,
          scaleY: 0.95,
          duration: 100,
          yoyo: true,
        });
      })
      .on('pointerover', () => {
        kiaraBtn.setFillStyle(0x5ba0f2);
        this.tweens.add({
          targets: kiaraBtn,
          scaleX: 1.05,
          scaleY: 1.05,
          duration: 200,
          ease: 'Power2',
        });
      })
      .on('pointerout', () => {
        kiaraBtn.setFillStyle(0x4a90e2);
        this.tweens.add({
          targets: kiaraBtn,
          scaleX: 1,
          scaleY: 1,
          duration: 200,
          ease: 'Power2',
        });
      });

    const kiaraText = this.add
      .text(kiaraX, kiaraY, 'Kiara\n(Aventureuse)', {
        fontSize: this.scaleFont(this.deviceType === 'mobile' ? 18 : 16),
        fill: '#FFFFFF',
        fontFamily: 'Inter, Arial, sans-serif',
        fontWeight: '500',
        align: 'center',
      })
      .setOrigin(0.5);

    // Finn button with modern gradient design
    const finnBtn = this.add
      .rectangle(finnX, finnY, buttonWidth, buttonHeight, 0xe94560)
      .setInteractive()
      .setStrokeStyle(2, 0xf75c4c)
      .on('pointerdown', () => {
        this.selectCharacter('finn');
        // Add button press effect
        this.tweens.add({
          targets: finnBtn,
          scaleX: 0.95,
          scaleY: 0.95,
          duration: 100,
          yoyo: true,
        });
      })
      .on('pointerover', () => {
        finnBtn.setFillStyle(0xf75c4c);
        this.tweens.add({
          targets: finnBtn,
          scaleX: 1.05,
          scaleY: 1.05,
          duration: 200,
          ease: 'Power2',
        });
      })
      .on('pointerout', () => {
        finnBtn.setFillStyle(0xe94560);
        this.tweens.add({
          targets: finnBtn,
          scaleX: 1,
          scaleY: 1,
          duration: 200,
          ease: 'Power2',
        });
      });

    const finnText = this.add
      .text(finnX, finnY, 'Finn\n(Inventeur)', {
        fontSize: this.scaleFont(this.deviceType === 'mobile' ? 18 : 16),
        fill: '#FFFFFF',
        fontFamily: 'Inter, Arial, sans-serif',
        fontWeight: '500',
        align: 'center',
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
