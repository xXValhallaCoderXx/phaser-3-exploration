class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  preload() {}

  create() {
    let goldPickupSound = this.sound.add("goalSound", {
      loop: false,
      // volume: 0.2,
    });

    this.chest = new Chest(this, 300, 300, "items", 0);
    this.wall = this.physics.add.image(500, 100, "button1");
    this.wall.setImmovable();
    this.player = new Player(this, 32, 32, "characters", 0); // NEW

    this.physics.add.collider(this.player, this.wall);
    this.physics.add.overlap(this.player, this.chest, function (player, chest) {
      chest.destroy();
      goldPickupSound.play();
    });

    this.cursors = this.input.keyboard.createCursorKeys();
  }
  update() {
    // On classes update method is not run automatically so we are calling it
    this.player.update(this.cursors);
  }
}
