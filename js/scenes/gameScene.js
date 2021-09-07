// create a new scene
let gameScene = new Phaser.Scene("Game");

// some parameters for our scene
gameScene.init = function () {
  this.stats = {
    health: 100,
    fun: 20,
  };

  this.decayRate = {
    health: -5,
    fun: 2,
  };
};

// executed once, after assets were loaded
gameScene.create = function () {
  this.bg = this.add.sprite(0, 0, "backyard").setInteractive();
  this.bg.setOrigin(0, 0);

  this.bg.on("pointerdown", this.placeItem, this);

  this.pet = this.add.sprite(100, 200, "pet").setInteractive();
  // this.pet.depth = 1;
  this.input.setDraggable(this.pet);

  this.input.on("drag", function (pointer, gameObject, dragX, dragY) {
    gameObject.x = dragX;
    gameObject.y = dragY;
  });

  this.createUI();
  this.refreshHud();

  // Decay Health / Fun
  this.timedEventStats = this.time.addEvent({
    delay: 1000,
    repeat: -1,
    callbackScope: this,
    callback: function () {
      this.updateStats(this.decayRate);
    },
  });
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
  this.rotateBtn.customStats = {
    fun: 30,
  };
  this.rotateBtn.on("pointerdown", this.rotatePet);

  this.buttons = [this.appleBtn, this.candyBtn, this.toyBtn, this.rotateBtn];

  // UI starts as not blocked
  this.uiBlocked = false;

  this.uiReady();

  // Display stats
  this.createHUD();
  this.refreshHud();
};

gameScene.rotatePet = function () {
  if (this.scene.uiBlocked) return;
  console.log("WE ARE ROTATING PET");
  this.scene.uiReady();

  // Block UI during animation
  this.scene.uiBlocked = true;
  this.alpha = 0.5;

  // Rotation tween
  let rotateTween = this.scene.tweens.add({
    targets: this.scene.pet,
    duration: 600,
    angle: 360,
    pause: false, // So it starts straight away
    callbackScope: this, // Providde context of scene to "this" in onComplete
    onComplete: function (tween, sprites) {
      // increase fun
      this.scene.updateStats(this.customStats);
      //set ui to ready
      this.scene.uiReady();
    },
  });
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
  // Check UI
  if (this.uiBlocked) return;

  // Create new item in postion
  let newItem = this.add.sprite(localX, localY, this.selectedItem.texture.key);

  this.uiBlocked = true;

  // Pet Movement

  let petTween = this.tweens.add({
    targets: this.pet,
    duration: 500,
    x: newItem.x,
    y: newItem.y,
    paused: false,
    callbackScope: this,
    onComplete: function (tween, sprites) {
      // destroy item
      newItem.destroy();

      // Event listener for when spritesheeet anim ends
      this.pet.on(
        "animationcomplete",
        function () {
          // Set pet back to normal frame
          this.pet.setFrame(0);
          // Clear UI
          this.uiReady();
        },
        this
      );

      // Play sprite sheet
      this.pet.play("eating");

      this.updateStats(this.selectedItem.customStats);
    },
  });
};

gameScene.createHUD = function () {
  // Health Stat
  this.healthText = this.add.text(20, 20, "Health: ", {
    font: "20px Arial",
    fill: "#fff",
  });

  this.funText = this.add.text(20, 50, "Fun: ", {
    font: "20px Arial",
    fill: "#fff",
  });
};

gameScene.refreshHud = function () {
  this.healthText.setText(`Health: ${this.stats.health}`);
  this.funText.setText(`Fun: ${this.stats.fun}`);
};

gameScene.updateStats = function (stats) {
  let isGameOver = false;
  // this.stats.health += this.selectedItem.customStats.health;
  // this.stats.fun += this.selectedItem.customStats.fun;
  for (stat in stats) {
    if (stats.hasOwnProperty(stat)) {
      this.stats[stat] += stats[stat];
      if (this.stats[stat] < 0) {
        isGameOver = true;
        this.stats[stat] = 0;
      }
    }
  }

  this.refreshHud();

  if (isGameOver) {
    this.gameOver();
  }
};

gameScene.gameOver = function () {
  console.log("GAME OVER");
  this.uiBlocked = true;
  // Change pet frame
  this.pet.setFrame(4);

  this.time.addEvent({
    delay: 2000,
    repeat: 0,
    callbackScope: this,
    callback: function () {
      this.scene.start("Home");
    },
  });
};
