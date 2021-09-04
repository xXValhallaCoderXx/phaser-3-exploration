let gameScene = new Phaser.Scene("Game");

// Load assets
gameScene.preload = function () {
  this.load.image("background", "assets/background.png");
  this.load.image("enemy", "assets/dragon.png");
  this.load.image("player", "assets/player.png");
  //   this.load.image("treasure", "assets/treasure.png");
};

gameScene.create = function () {
  // Sprites are rendered in order they are defined by default
  // We can use Depth kinda like z-index
  let player = this.add.sprite(50, 180, "player");
  player.depth = 1;
  // player.x = 100; Can also change x/y like this

  player.setScale(0.5, 0.5);

  let gameWidth = this.sys.game.config.width;
  let gameHeight = this.sys.game.config.height;
  let bg = this.add.sprite(0, 0, "background");
  // bg.setOrigin(0, 0); // Changing asset origin
  bg.setPosition(gameWidth / 2, gameHeight / 2);

  this.enemy1 = this.add.sprite(200, 180, "enemy");
  this.enemy1.scaleX = 0.5;
  this.enemy1.scaleY = 0.5;

  let enemy2 = this.add.sprite(400, 180, "enemy");
  enemy2.displayWidth = 100;
  enemy2.scaleY = 0.5;

  // Flip on X axis
  this.enemy1.flipX = true;

  // enemy1.setAngle(45);
  // enemy1.angle = 45;
  // enemy1.rotation = Math.PI / 4;
  this.enemy1.setRotation(Math.PI / 4);
};

// Upto 60 times per second
gameScene.update = function () {
  if (this.enemy1.scaleX < 2) {
    this.enemy1.scaleX += 0.001;
  }

  if (this.enemy1.scaleY < 2) {
    this.enemy1.scaleY += 0.001;
  }
};

let config = {
  type: Phaser.AUTO, // Phaser uses WebGL if avail or Canvas
  width: 640,
  height: 360,
  scene: gameScene,
};

let game = new Phaser.Game(config);
