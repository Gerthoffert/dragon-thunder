// Orientation manager for mobile landscape requirement
export class OrientationManager {
  constructor(scene) {
    this.scene = scene;
    this.isLandscapeRequired = true;
    this.orientationOverlay = null;
    this.isOverlayVisible = false;

    // Check if device is mobile
    this.isMobileDevice = this.detectMobileDevice();

    if (this.isMobileDevice) {
      this.createOrientationOverlay();
      this.checkOrientation();

      // Listen for orientation changes
      window.addEventListener('orientationchange', () => {
        setTimeout(() => this.checkOrientation(), 500);
      });

      window.addEventListener('resize', () => {
        setTimeout(() => this.checkOrientation(), 100);
      });
    }
  }

  detectMobileDevice() {
    const userAgent = navigator.userAgent;
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isSmallScreen = window.innerWidth <= 768;
    return isMobile || isSmallScreen;
  }

  isLandscape() {
    return window.innerWidth > window.innerHeight;
  }

  createOrientationOverlay() {
    // Create HTML overlay for orientation warning
    if (!document.getElementById('orientation-overlay')) {
      const overlay = document.createElement('div');
      overlay.id = 'orientation-overlay';
      overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                color: white;
                text-align: center;
                padding: 20px;
                box-sizing: border-box;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            `;

      // Create background particles
      const background = document.createElement('div');
      background.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: 
                    radial-gradient(circle at 20% 50%, rgba(233, 69, 96, 0.08) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(255, 215, 0, 0.08) 0%, transparent 50%),
                    radial-gradient(circle at 40% 80%, rgba(15, 52, 96, 0.12) 0%, transparent 50%);
                animation: backgroundFloat 20s ease-in-out infinite;
                pointer-events: none;
                z-index: -1;
            `;

      // Create main content container
      const container = document.createElement('div');
      container.style.cssText = `
                max-width: 380px;
                background: rgba(26, 26, 46, 0.8);
                border: 2px solid rgba(45, 45, 68, 0.6);
                border-radius: 16px;
                padding: 40px 32px;
                backdrop-filter: blur(20px);
                box-shadow: 
                    0 20px 60px rgba(0, 0, 0, 0.4),
                    0 0 0 1px rgba(255, 255, 255, 0.05),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1);
            `;

      // Phone icon
      const phoneIcon = document.createElement('div');
      phoneIcon.style.cssText = `
                font-size: 72px; 
                margin-bottom: 24px; 
                animation: rotateDevice 3s ease-in-out infinite;
                filter: drop-shadow(0 4px 12px rgba(233, 69, 96, 0.3));
            `;
      phoneIcon.textContent = '📱';

      // Title
      const title = document.createElement('h2');
      title.style.cssText = `
                font-family: 'Cinzel', Georgia, serif;
                font-size: clamp(24px, 6vw, 32px);
                font-weight: 600;
                background: linear-gradient(45deg, #FFD700, #e94560);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin: 0 0 16px 0;
                animation: titleGlow 2s ease-in-out infinite alternate;
            `;
      title.textContent = 'Rotate Your Device';

      // Description
      const description = document.createElement('p');
      description.style.cssText = `
                font-size: clamp(14px, 3.5vw, 16px);
                line-height: 1.6;
                color: #a0a0a0;
                margin: 0 0 32px 0;
                font-weight: 400;
            `;
      description.textContent =
        'Dragon Thunder is designed for landscape mode to provide the best gaming experience.';

      // Action card
      const actionCard = document.createElement('div');
      actionCard.style.cssText = `
                border: 2px solid #e94560;
                border-radius: 12px;
                padding: 16px 24px;
                background: linear-gradient(135deg, rgba(233, 69, 96, 0.1), rgba(233, 69, 96, 0.05));
                font-size: clamp(12px, 3vw, 14px);
                color: #ffffff;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                font-weight: 500;
            `;
      actionCard.innerHTML =
        '<span style="font-size: 16px;">🎮</span>Turn your device sideways to continue';

      // Assemble elements
      container.appendChild(phoneIcon);
      container.appendChild(title);
      container.appendChild(description);
      container.appendChild(actionCard);

      overlay.appendChild(background);
      overlay.appendChild(container);

      // Add styles via stylesheet
      this.addOrientationStyles();

      document.body.appendChild(overlay);
      this.orientationOverlay = overlay;
    } else {
      this.orientationOverlay = document.getElementById('orientation-overlay');
    }
  }

  addOrientationStyles() {
    if (!document.getElementById('orientation-styles')) {
      const style = document.createElement('style');
      style.id = 'orientation-styles';
      style.textContent = `
                @keyframes rotateDevice {
                    0%, 100% { 
                        transform: rotate(-90deg) scale(1); 
                        opacity: 0.8; 
                    }
                    50% { 
                        transform: rotate(0deg) scale(1.05); 
                        opacity: 1; 
                    }
                }
                
                @keyframes titleGlow {
                    from { filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.3)); }
                    to { filter: drop-shadow(0 0 20px rgba(233, 69, 96, 0.4)); }
                }
                
                @keyframes backgroundFloat {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    33% { transform: translateY(-10px) rotate(1deg); }
                    66% { transform: translateY(5px) rotate(-1deg); }
                }
            `;
      document.head.appendChild(style);
    }
  }

  checkOrientation() {
    if (!this.isMobileDevice || !this.orientationOverlay) {
      return;
    }

    const isCurrentlyLandscape = this.isLandscape();
    const shouldShowOverlay = !isCurrentlyLandscape;

    if (shouldShowOverlay && !this.isOverlayVisible) {
      this.showOrientationOverlay();
    } else if (!shouldShowOverlay && this.isOverlayVisible) {
      this.hideOrientationOverlay();
    }
  }

  showOrientationOverlay() {
    if (this.orientationOverlay && !this.isOverlayVisible) {
      this.orientationOverlay.style.opacity = '1';
      this.orientationOverlay.style.pointerEvents = 'auto';
      this.isOverlayVisible = true;

      // Pause the game
      if (this.scene && this.scene.scene.isActive()) {
        this.scene.scene.pause();
      }
    }
  }

  hideOrientationOverlay() {
    if (this.orientationOverlay && this.isOverlayVisible) {
      this.orientationOverlay.style.opacity = '0';
      this.orientationOverlay.style.pointerEvents = 'none';
      this.isOverlayVisible = false;

      // Resume the game
      if (this.scene && this.scene.scene.isPaused()) {
        this.scene.scene.resume();
      }
    }
  }

  destroy() {
    // Clean up event listeners
    window.removeEventListener('orientationchange', this.checkOrientation);
    window.removeEventListener('resize', this.checkOrientation);

    // Remove overlay
    if (this.orientationOverlay && this.orientationOverlay.parentNode) {
      this.orientationOverlay.parentNode.removeChild(this.orientationOverlay);
    }
  }

  // Get optimal layout for landscape mobile
  getLandscapeLayout() {
    if (this.isMobileDevice && this.isLandscape()) {
      return {
        titleY: 0.12,
        subtitleY: 0.22,
        storyY: 0.45,
        selectionY: 0.65,
        buttonsY: 0.78,
        spacing: 'compact',
      };
    }
    return {
      titleY: 0.08,
      subtitleY: 0.14,
      storyY: 0.35,
      selectionY: 0.55,
      buttonsY: 0.7,
      spacing: 'normal',
    };
  }
}

// Global instance for sharing across scenes
window.orientationManager = null;
