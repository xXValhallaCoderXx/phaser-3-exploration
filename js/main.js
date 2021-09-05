// create a new scene
let gameScene = new Phaser.Scene("Game");

// some parameters for our scene
gameScene.init = function () {
  this.stats = {
    health: 100,
    fun: 20,
  };
};

// load asset files for our game
gameScene.preload = function () {
  // load assets
  this.load.image("backyard", "assets/images/backyard.png");
  this.load.image("apple", "assets/images/apple.png");
  this.load.image("candy", "assets/images/candy.png");
  this.load.image("rotate", "assets/images/rotate.png");
  this.load.image("toy", "assets/images/rubber_duck.png");

  this.load.spritesheet("pet", "assets/images/pet.png", {
    frameWidth: 97,
    frameHeight: 83,
    margin: 1,
    spacing: 1,
  });
};

// executed once, after assets were loaded
gameScene.create = function () {
  this.bg = this.add.sprite(0, 0, "backyard").setInteractive();
  this.bg.setOrigin(0, 0);

  this.bg.on("pointerdown", this.placeItem, this);

  this.pet = this.add.sprite(100, 200, "pet").setInteractive();

  this.input.setDraggable(this.pet);

  this.input.on("drag", function (pointer, gameObject, dragX, dragY) {
    gameObject.x = dragX;
    gameObject.y = dragY;
  });

  this.createUI();
};

gameScene.createUI = function () {
  this.appleBtn = this.add.sprite(72, 570, "apple").setInteractive();
  this.appleBtn.customStats = {
    health: 20,
    fun: 0,
  };
  this.appleBtn.on("pointerdown", this.pickItem);
  this.candyBtn = this.add.sprite(144, 570, "candy").setInteractive();
  this.candyBtn.customStats = {
    health: -10,
    fun: 20,
  };
  this.candyBtn.on("pointerdown", this.pickItem);
  this.toyBtn = this.add.sprite(216, 570, "toy").setInteractive();
  this.toyBtn.customStats = {
    health: 0,
    fun: 10,
  };
  this.toyBtn.on("pointerdown", this.pickItem);
  this.rotateBtn = this.add.sprite(288, 570, "rotate").setInteractive();
  this.rotateBtn.on("pointerdown", this.rotatePet);

  this.buttons = [this.appleBtn, this.candyBtn, this.toyBtn, this.rotateBtn];

  // UI starts as not blocked
  this.uiBlocked = false;

  this.uiReady();
};

gameScene.rotatePet = function () {
  if (this.scene.uiBlocked) return;
  console.log("WE ARE ROTATING PET");
  this.scene.uiReady();

  // Block UI during animation
  this.scene.uiBlocked = true;
  this.alpha = 0.5;
  let scene = this.scene;
  setTimeout(function () {
    scene.uiReady();
  }, 1500);
};

gameScene.pickItem = function () {
  // If blocked don't do anything
  if (this.scene.uiBlocked) return;
  // Make sure UI ready
  this.scene.uiReady();

  this.scene.selectedItem = this;

  this.alpha = 0.5;
};

gameScene.uiReady = function () {
  // Nothing is being selected
  this.selectedItem = null;

  // Set all buttons to alpha 1 (no transparency)
  for (let i = 0; i < this.buttons.length; i++) {
    this.buttons[i].alpha = 1;
  }

  this.uiBlocked = false;
};

gameScene.placeItem = function (pointer, localX, localY) {
  // Check item selected

  if (!this.selectedItem) return;

  // Create new item in postion
  let newItem = this.add.sprite(localX, localY, this.selectedItem.texture.key);

  // this.stats.health += this.selectedItem.customStats.health;
  // this.stats.fun += this.selectedItem.customStats.fun;

  for (stat in this.selectedItem.customStats) {
    if (this.selectedItem.customStats.hasOwnProperty(stat)) {
      this.stats[stat] += this.selectedItem.customStats[stat];
    }
  }
  console.log("THIS STATS: ", this.stats);
  // Clear UI
  this.uiReady();
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
