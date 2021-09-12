// create a new scene
let gameScene = new Phaser.Scene("Game");

// Pool of object
// Check if an object is created, instead of creating one each time
// Only creates if no new active object available
// When finished the object is deativated

// some parameters for our scene
gameScene.init = function () {
  // player params
  this.playerSpeed = 150;
  this.jumpSpeed = -600;
};

// load asset files for our game
gameScene.preload = function () {
  // load images
  this.load.image("ground", "assets/images/ground.png");
  this.load.image("platform", "assets/images/platform.png");
  this.load.image("block", "assets/images/block.png");
  this.load.image("goal", "assets/images/gorilla3.png");
  this.load.image("barrel", "assets/images/barrel.png");

  // load spritesheets
  this.load.spritesheet("player", "assets/images/player_spritesheet.png", {
    frameWidth: 28,
    frameHeight: 30,
    margin: 1,
    spacing: 1,
  });

  this.load.spritesheet("fire", "assets/images/fire_spritesheet.png", {
    frameWidth: 20,
    frameHeight: 21,
    margin: 1,
    spacing: 1,
  });

  this.load.json("levelData", "assets/levels/index.json");
};

// executed once, after assets were loaded
gameScene.create = function () {
  // Better to use a loader scene
  if (!this.anims.get("walking")) {
    // Walking animation
    this.anims.create({
      key: "walking",
      frames: this.anims.generateFrameNames("player", {
        frames: [0, 1, 2],
      }),
      frameRate: 12,
      yoyo: true,
      repeat: -1,
    });
  }

  if (!this.anims.get("burning")) {
    // Fire animation
    this.anims.create({
      key: "burning",
      frames: this.anims.generateFrameNames("fire", {
        frames: [0, 1],
      }),
      frameRate: 4,
      repeat: -1,
    });
  }

  // Setup world
  this.setupLevel();

  // Start Barrel SPawner
  this.setupSpawner();

  this.physics.add.collider(
    [this.goal, this.player, this.barrels],
    this.platforms
  );
  // Array can only be done with physics group
  this.physics.add.overlap(
    this.player,
    [this.fires, this.goal, this.barrels],
    this.restartGame,
    null, // Function to check if you want to run restartGame or now
    this
  );

  // let ground = this.add.sprite(180, 604, "ground");
  // 2nd param is false by default
  // If you send true it becomes a static body
  // this.physics.add.existing(ground, true); // Add to existing objects dynamically
  // this.platforms.add(ground);

  // No need as ground is static
  // ground.body.allowGravity = false;
  // ground.body.immovable = true;

  // let ground2 = this.physics.add.sprite(180, 200, "ground");

  // Physics collision detection
  // Can pass in sprites or groups
  // this.physics.add.collider(ground, ground2);

  // Repeats texture
  // let platform = this.add.tileSprite(180, 500, 36 * 4, 1 * 30, "block");
  // this.physics.add.existing(platform, true);
  // this.platforms.add(platform);

  // this.player = this.add.sprite(180, 400, "player", 3);
  // this.physics.add.existing(this.player);
  // this.physics.add.collider(this.player, this.platforms);
  // this.player.body.setCollideWorldBounds(true);

  this.cursors = this.input.keyboard.createCursorKeys();

  this.input.on("pointerup,", function (pointer) {
    console.log("X: ", pointer.x);
    console.log("Y: ", pointer.y);
  });
};

gameScene.update = function () {
  // Ground check
  // blocked does no automatically upate

  // blocked = only true on world boundary or static tile
  let onGround =
    this.player.body.blocked.down || this.player.body.touching.down;
  if (this.cursors.left.isDown && !this.cursors.right.isDown) {
    this.player.body.setVelocityX(-this.playerSpeed);
    this.player.flipX = false;
    if (onGround && !this.player.anims.isPlaying) {
      this.player.anims.play("walking");
    }
  } else if (this.cursors.right.isDown && !this.cursors.left.isDown) {
    this.player.body.setVelocityX(this.playerSpeed);
    this.player.flipX = true;
    if (onGround && !this.player.anims.isPlaying) {
      this.player.anims.play("walking");
    }
  } else {
    this.player.body.setVelocityX(0);
    this.player.anims.stop("walking");
    if (onGround) {
      this.player.setFrame(3);
    }
  }

  // Handle Jump
  if (onGround && (this.cursors.space.isDown || this.cursors.up.isDown)) {
    this.player.anims.stop("walking");
    this.player.body.setVelocityY(this.jumpSpeed);
    this.player.setFrame(2);
  }
};

gameScene.setupLevel = function () {
  this.levelData = this.cache.json.get("levelData");

  this.physics.world.bounds.width = this.levelData.world.width;
  this.physics.world.bounds.height = this.levelData.world.height;

  // this.fires = this.add.group();
  this.fires = this.physics.add.group({
    allowGravity: false,
    immovable: true,
  });
  for (let i = 0; i < this.levelData.fires.length; i++) {
    let curr = this.levelData.fires[i];

    let newObj = this.add.sprite(curr.x, curr.y, "fire").setOrigin(0);

    // this.physics.add.existing(newObj);
    // newObj.body.allowGravity = false;
    // newObj.body.immovable = true;

    newObj.anims.play("burning");
    this.fires.add(newObj);
    newObj.setInteractive();
    this.input.setDraggable(newObj);
  }

  // this.input("drag", function (pointer, gameObject, dragX, dragY) {});

  // this.platforms = this.add.group();
  this.platforms = this.physics.add.staticGroup(); // Uses a tree structure for searching which body is hit
  for (let i = 0; i < this.levelData.platforms.length; i++) {
    let curr = this.levelData.platforms[i];
    let newObj;
    if (curr.numTiles === 1) {
      newObj = this.add.sprite(curr.x, curr.y, curr.key).setOrigin(0);
    } else {
      let width = this.textures.get(curr.key).get(0).width;
      let height = this.textures.get(curr.key).get(0).height;
      newObj = this.add
        .tileSprite(curr.x, curr.y, curr.numTiles * width, height, curr.key)
        .setOrigin(0);
    }

    this.physics.add.existing(newObj, true);
    this.platforms.add(newObj);
  }

  this.player = this.add.sprite(
    this.levelData.player.x,
    this.levelData.player.y,
    "player",
    3
  );
  this.physics.add.existing(this.player);

  this.player.body.setCollideWorldBounds(true);

  // camera bounds
  this.cameras.main.setBounds(
    0,
    0,
    this.levelData.world.length,
    this.levelData.world.height
  );
  this.cameras.main.startFollow(this.player);

  this.goal = this.add.sprite(
    this.levelData.goal.x,
    this.levelData.goal.y,
    "goal"
  );
  this.physics.add.existing(this.goal);
};

gameScene.restartGame = function (sourceSprite, targetSprite) {
  this.cameras.main.fade(500);

  this.cameras.main.on(
    "camerafadeoutcomplete",
    function () {
      this.scene.restart();
    },
    this
  );
};

gameScene.setupSpawner = function () {
  this.barrels = this.physics.add.group({
    bounceY: 0.1,
    bounceX: 1,
    collideWorldBounds: true,
  });

  let spawningEvent = this.time.addEvent({
    delay: this.levelData.spawner.interval,
    loop: true,
    callbackScope: this,
    callback: function () {
      // Create barrel
      // let barrel = this.barrels.create(this.goal.x, this.goal.y, "barrel");

      let barrel = this.barrels.get(this.goal.x, this.goal.y, "barrel");
      barrel.setActive(true);
      barrel.setVisible(true);
      barrel.body.enable = true;
      barrel.setVelocityX(this.levelData.spawner.speed);
      this.time.addEvent({
        delay: this.levelData.spawner.lifespan,
        repeat: 0,
        callbackScope: this,
        callback: function () {
          // barrel.destroy();
          this.barrels.killAndHide(barrel);
          barrel.body.enable = false;
        },
      });
    },
  });
};

// our game's configuration
let config = {
  type: Phaser.AUTO,
  width: 360,
  height: 640,
  scene: gameScene,
  title: "Monster Kong",
  pixelArt: false,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1000 },
      debug: true,
    },
  },
};

// create the game, and pass it the configuration
let game = new Phaser.Game(config);
