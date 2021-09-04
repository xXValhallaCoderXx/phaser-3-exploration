let gameScene = new Phaser.Scene("Game");

gameScene.init = function () {
  // Define parameters of the scene
  this.playerSpeed = 2;
  this.enemyMinSpeed = 1;
  this.enemyMaxSpeed = 4;
  this.enemyMinY = 80;
  this.enemyMaxY = 280;
  this.isTerminating = false;
};

// Load assets
gameScene.preload = function () {
  this.load.image("background", "assets/background.png");
  this.load.image("enemy", "assets/dragon.png");
  this.load.image("player", "assets/player.png");
  this.load.image("goal", "assets/treasure.png");
};

gameScene.create = function () {
  let gameWidth = this.sys.game.config.width;
  let gameHeight = this.sys.game.config.height;
  let bg = this.add.sprite(0, 0, "background");
  bg.setOrigin(0, 0);

  this.player = this.add.sprite(40, gameHeight / 2, "player");
  this.player.setScale(0.5);

  this.goal = this.add.sprite(gameWidth - 80, gameHeight / 2, "goal");
  this.goal.setScale(0.6);

  this.enemies = this.add.group({
    key: "enemy",
    repeat: 5,
    setXY: {
      x: 90,
      y: 100,
      stepX: 80,
      stepY: 20,
    },
  });

  // this.enemy = this.add.sprite(120, gameHeight / 2, "enemy");
  // this.enemy.flipX = true;
  // this.enemy.setScale(0.6);

  // this.enemies.add(this.enemy);
  Phaser.Actions.Call(
    this.enemies.getChildren(),
    function (enemy) {
      enemy.flipX = true;
      // Set enemy speed
      let direction = Math.random() < 0.5 ? 1 : -1;
      let speed = Math.floor(
        Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed + 1) +
          this.enemyMinSpeed
      );

      enemy.speed = direction * speed;
    },
    this
  );

  // Modify group scale
  Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.4, -0.4);

  // Set enemy speed
  // let direction = Math.random() < 0.5 ? 1 : -1;
  // let speed = Math.floor(
  //   Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed + 1) +
  //     this.enemyMinSpeed
  // );

  // this.enemy.speed = direction * speed;
};

// Upto 60 times per second
gameScene.update = function () {
  // Dont run if terminating
  if (this.isTerminating) {
    return;
  }

  // Check for active input (Click / Touch)
  if (this.input.activePointer.isDown) {
    this.player.x += this.playerSpeed;
  }

  // Check goal touch
  let playerBounds = this.player.getBounds();
  let goalBounds = this.goal.getBounds();

  // Empty return to exit and continue other code
  if (Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, goalBounds)) {
    return this.gameOver();
  }

  // ENemy movement
  let enemies = this.enemies.getChildren();
  let numOfEnemies = enemies.length;

  for (let i = 0; i < numOfEnemies; i++) {
    enemies[i].y += enemies[i].speed;

    const dragonGoingUp =
      enemies[i].speed < 0 && enemies[i].y <= this.enemyMinY;
    const dragonGoingDown =
      enemies[i].speed > 0 && enemies[i].y >= this.enemyMaxY;

    // Check not passed the bounds (Y plane) reverse
    if (dragonGoingUp || dragonGoingDown) {
      enemies[i].speed *= -1;
    }

    let enemyBounds = enemies[i].getBounds();

    // Empty return to exit and continue other code
    if (
      Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, enemyBounds)
    ) {
      return this.gameOver();
    }
  }
};

gameScene.gameOver = function () {
  // Initiate game over
  this.isTerminating = true;

  this.cameras.main.shake(500);
  this.cameras.main.on(
    "camerashakecomplete",
    function (camera, effect) {
      this.cameras.main.fade(500);
      // Add this so this function has scene context
    },
    this
  );

  this.cameras.main.on(
    "camerafadeoutcomplete",
    function () {
      this.scene.restart();
    },
    this
  );
};

let config = {
  type: Phaser.AUTO, // Phaser uses WebGL if avail or Canvas
  width: 640,
  height: 360,
  scene: gameScene,
};

let game = new Phaser.Game(config);
