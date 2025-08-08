export default class IntroScene extends Phaser.Scene {
  constructor() {
    super({ key: 'IntroScene' });
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

    // Create stars
    const starCount = this.deviceType === 'mobile' ? 30 : 50;
    for (let i = 0; i < starCount; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, this.gameWidth),
        Phaser.Math.Between(0, this.gameHeight * 0.4),
        this.scaleValue(1),
        0xffffff
      );
    }

    const centerX = this.gameWidth / 2;

    // Title - with device-specific font sizes
    this.add
      .text(centerX, this.gameHeight * 0.08, 'Le Tonnerre du Dragon', {
        fontSize: this.scaleFont(this.deviceType === 'mobile' ? 32 : 48),
        fill: '#FFD700',
        fontFamily: 'Georgia',
        stroke: '#8B4513',
        strokeThickness: this.scaleValue(3),
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, this.gameHeight * 0.14, 'Chapitre 1: La Nuit du Tonnerre', {
        fontSize: this.scaleFont(this.deviceType === 'mobile' ? 18 : 24),
        fill: '#FFFFFF',
        fontFamily: 'Georgia',
      })
      .setOrigin(0.5);

    // Story text - with better mobile formatting
    const storyText =
      this.deviceType === 'mobile'
        ? `Dans le village de Millhaven, la nuit du tonnerre change tout.\n\nUn grondement mystérieux secoue le ciel, éveillant deux jeunes habitants: Kiara et Finn.\n\nQui serez-vous pour affronter les mystères de cette nuit?`
        : `Dans le village de Millhaven, la nuit du tonnerre change tout.
        
    Un grondement mystérieux secoue le ciel, éveillant la curiosité de deux jeunes habitants:
    Kiara, une fille aventureuse de 12 ans au courage sans limite, et Finn, un inventeur
    ingénieux du même âge.
        
    Une aventure dangereuse mais fascinante vous attend. Qui serez-vous pour
    affronter les mystères de la nuit du tonnerre?`;

    this.add
      .text(centerX, this.gameHeight * 0.35, storyText, {
        fontSize: this.scaleFont(this.deviceType === 'mobile' ? 14 : 18),
        fill: '#FFFFFF',
        fontFamily: 'Georgia',
        align: 'center',
        wordWrap: { width: this.gameWidth * (this.deviceType === 'mobile' ? 0.9 : 0.8) },
        lineSpacing: this.deviceType === 'mobile' ? 5 : 0,
      })
      .setOrigin(0.5);

    // Character selection
    this.add
      .text(centerX, this.gameHeight * 0.55, 'Choisissez votre personnage:', {
        fontSize: this.scaleFont(this.deviceType === 'mobile' ? 16 : 20),
        fill: '#FFD700',
        fontFamily: 'Georgia',
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

    // Button positioning based on device
    let kiaraX, kiaraY, finnX, finnY;

    if (this.deviceType === 'mobile') {
      // Stack vertically on mobile with more spacing
      kiaraX = finnX = centerX;
      kiaraY = this.gameHeight * 0.65;
      finnY = this.gameHeight * 0.78;
    } else if (this.deviceType === 'tablet') {
      // Slightly closer together on tablet
      kiaraX = this.gameWidth * 0.3;
      finnX = this.gameWidth * 0.7;
      kiaraY = finnY = this.gameHeight * 0.7;
    } else {
      // Desktop layout
      kiaraX = this.gameWidth * 0.35;
      finnX = this.gameWidth * 0.65;
      kiaraY = finnY = this.gameHeight * 0.7;
    }

    // Kiara button
    const kiaraBtn = this.add
      .rectangle(kiaraX, kiaraY, buttonWidth, buttonHeight, 0x4a90e2)
      .setInteractive()
      .on('pointerdown', () => this.selectCharacter('kiara'))
      .on('pointerover', () => kiaraBtn.setFillStyle(0x5ba0f2))
      .on('pointerout', () => kiaraBtn.setFillStyle(0x4a90e2));

    this.add
      .text(kiaraX, kiaraY, 'Kiara\n(Aventureuse)', {
        fontSize: this.scaleFont(this.deviceType === 'mobile' ? 14 : 16),
        fill: '#FFFFFF',
        fontFamily: 'Georgia',
        align: 'center',
      })
      .setOrigin(0.5);

    // Finn button
    const finnBtn = this.add
      .rectangle(finnX, finnY, buttonWidth, buttonHeight, 0xe74c3c)
      .setInteractive()
      .on('pointerdown', () => this.selectCharacter('finn'))
      .on('pointerover', () => finnBtn.setFillStyle(0xf75c4c))
      .on('pointerout', () => finnBtn.setFillStyle(0xe74c3c));

    this.add
      .text(finnX, finnY, 'Finn\n(Inventeur)', {
        fontSize: this.scaleFont(this.deviceType === 'mobile' ? 14 : 16),
        fill: '#FFFFFF',
        fontFamily: 'Georgia',
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

  // Helper methods for responsive design
  scaleValue(value) {
    const baseWidth = this.deviceType === 'mobile' ? 480 : 1024;
    const baseHeight = this.deviceType === 'mobile' ? 800 : 768;
    const scaleFactor = Math.min(this.gameWidth / baseWidth, this.gameHeight / baseHeight);
    return Math.max(value * scaleFactor, value * 0.5); // Minimum 50% scaling
  }

  scaleFont(size) {
    return `${this.scaleValue(size)}px`;
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
