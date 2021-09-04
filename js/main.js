// create a new scene
let gameScene = new Phaser.Scene("Game");

// some parameters for our scene
gameScene.init = function () {};

// load asset files for our game
gameScene.preload = function () {
  // load assets
  this.load.image("backyard", "assets/images/backyard.png");
  this.load.image("apple", "assets/images/apple.png");
  this.load.image("candy", "assets/images/candy.png");
  this.load.image("rotate", "assets/images/rotate.png");
  this.load.image("toy", "assets/images/rubber_duck.png");

  this.load
    .spritesheet("pet", "assets/images/pet.png", {
      frameWidth: 97,
      frameHeight: 83,
      margin: 1,
      spacing: 1,
    })
    .setInteractive();
};

// executed once, after assets were loaded
gameScene.create = function () {
  this.bg = this.add.sprite(0, 0, "backyard");
  this.bg.setOrigin(0, 0);
  this.pet = this.add.sprite(100, 200, "pet");

  this.createUI();
};

gameScene.createUI = function () {
  this.appleBtn = this.add.sprite(72, 570, "apple").setInteractive();
  this.candyBtn = this.add.sprite(144, 570, "candy").setInteractive();
  this.toyBtn = this.add.sprite(216, 570, "toy").setInteractive();
  this.rotateBtn = this.add.sprite(288, 570, "rotate").setInteractive();
};

// our game's configuration
let config = {
  type: Phaser.AUTO,
  width: 360,
  height: 640,
  scene: gameScene,
  title: "Virtual Pet",
  pixelArt: false,
  backgroundColor: "ffffff",
};

// create the game, and pass it the configuration
let game = new Phaser.Game(config);
