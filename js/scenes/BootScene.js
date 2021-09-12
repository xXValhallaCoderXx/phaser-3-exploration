class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    this.load.image("button1", "assets/images/ui/blue_button01.png");
    this.load.spritesheet("items", "assets/images/items.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("characters", "assets/images/characters.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    // Could provide a wav and mp3 and phaser will choose best one for broswser
    this.load.audio("goalSound", ["assets/audio/Pickup.wav"]);
  }
  create() {
    this.scene.start("Title");
  }
}
