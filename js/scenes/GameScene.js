class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  init() {
    // Launch instead of start will run scene in parallele - what ever scene active 1st is on bittom lauyet
    // Start will shut down current and switch to new
    this.scene.launch("Ui");
    this.score = 0;
  }

  preload() {}

  create() {
    this.createAudio();
    this.createChest();
    this.createWalls();
    this.createPlayer();
    this.addCollisions();
    this.createInput();
  }
  update() {
    // On classes update method is not run automatically so we are calling it
    this.player.update(this.cursors);
  }

  createAudio() {
    this.goldPickupSound = this.sound.add("goalSound", {
      loop: false,
      // volume: 0.2,
    });
  }

  createPlayer() {
    this.player = new Player(this, 32, 32, "characters", 0); // NEW
  }

  createWalls() {
    this.wall = this.physics.add.image(500, 100, "button1");
    this.wall.setImmovable();
  }

  createChest() {
    // Chest group
    this.chests = this.physics.add.group();
    // Create locations
    this.chestPositons = [
      [100, 100],
      [200, 200],
      [300, 300],
      [400, 400],
      [500, 500],
    ];

    // Max number of chests
    this.maxNumber = 3;
    for (let i = 0; i < this.maxNumber; i += 1) {
      // SPawn chest
      this.spawnChest();
    }
  }

  spawnChest() {
    const location =
      this.chestPositons[Math.floor(Math.random() * this.chestPositons.length)];
    const chest = new Chest(this, location[0], location[1], "items", 0);
    this.chests.add(chest);
  }

  createInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  addCollisions() {
    this.physics.add.collider(this.player, this.wall);
    this.physics.add.overlap(
      this.player,
      this.chests,
      this.collectChest,
      null,
      this
    );
  }

  collectChest(player, chest) {
    chest.destroy();
    this.goldPickupSound.play();
    this.score += chest.coins;
    this.events.emit("updateScore", this.score);
    // Delayed call so the chest if it spawns in same location as player its not instantly collected
    this.time.delayedCall(1000, this.spawnChest, [], this);
  }
}
