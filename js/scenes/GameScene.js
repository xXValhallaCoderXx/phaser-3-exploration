class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  init() {
    // Launch instead of start will run scene in parallele - what ever scene active 1st is on bittom lauyet
    // Start will shut down current and switch to new
    this.scene.launch("Ui");
  }

  preload() {}

  create() {
    this.createMap();
    this.createAudio();
    this.createGroups();

    this.createInput();

    this.createGameManager();
  }
  update() {
    if (this.player) {
      // On classes update method is not run automatically so we are calling it
      this.player.update(this.cursors);
    }
  }

  createAudio() {
    this.goldPickupSound = this.sound.add("goalSound", {
      loop: false,
      // volume: 0.2,
    });
  }

  createPlayer(player) {
    this.player = new PlayerContainer(
      this,
      player.x * 2,
      player.y * 2,
      "characters",
      0,
      player.health,
      player.maxHealth,
      player.id
    ); // NEW
  }

  createGroups() {
    // Chest group
    this.chests = this.physics.add.group();
    this.monsters = this.physics.add.group();
    // Create locations
    // this.chestPositons = [
    //   [100, 100],
    //   [200, 200],
    //   [300, 300],
    //   [400, 400],
    //   [500, 500],
    // ];

    // // Max number of chests
    // this.maxNumber = 3;
    // for (let i = 0; i < this.maxNumber; i += 1) {
    //   // SPawn chest
    //   this.spawnChest();
    // }
  }

  spawnChest(chestObj) {
    // const location =
    //   this.chestPositons[Math.floor(Math.random() * this.chestPositons.length)];
    let chest = this.chests.getFirstDead(); // Loop through chest group and get first inactive object in array
    // If none active - phase will return null
    if (!chest) {
      chest = new Chest(
        this,
        chestObj.x * 2,
        chestObj.y * 2,
        "items",
        0,
        chestObj.gold,
        chestObj.id
      );
      this.chests.add(chest);
      chest.setCollideWorldBounds(true);
    } else {
      chest.coins = chestObj.gold;
      chest.id = chestObj.id;
      chest.setPosition(chestObj.x * 2, chestObj.y * 2);
      chest.makeActive();
    }
  }

  spawnMonster(monsterObj) {
    let monster = this.monsters.getFirstDead(); // Loop through chest group and get first inactive object in array
    // If none active - phase will return null
    if (!monster) {
      monster = new Monster(
        this,
        monsterObj.x * 2,
        monsterObj.y * 2,
        "monsters",
        monsterObj.frame,
        monsterObj.id,
        monsterObj.health,
        monsterObj.maxHealth
      );
      this.monsters.add(monster);
      monster.setCollideWorldBounds(true);
    } else {
      // monster.coins = monsterObj.gold;
      monster.id = monsterObj.id;
      monster.health = monsterObj.health;
      monster.maxHealth = monsterObj.maxHealth;
      monster.setTexture("monsters", monsterObj.frame);
      monster.setPosition(monsterObj.x * 2, monsterObj.y * 2);
      monster.makeActive();
    }
  }

  createInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  addCollisions() {
    this.physics.add.collider(this.player, this.map.blockedLayer);
    this.physics.add.overlap(
      this.player,
      this.chests,
      this.collectChest,
      null,
      this
    );
    this.physics.add.collider(this.monsters, this.map.blockedLayer);
    this.physics.add.overlap(
      this.player.weapon,
      this.monsters,
      this.enemyOverlap,
      null,
      this
    );
  }

  enemyOverlap(player, enemy) {
    if (this.player.playerAttacking && !this.player.swordHit) {
      this.player.swordHit = true;
      // enemy.makeInactive();
      this.events.emit("monsterAttacked", enemy.id);
    }
  }

  collectChest(player, chest) {
    chest.makeInactive();
    this.goldPickupSound.play();

    this.events.emit("updateScore", this.score);
    // Delayed call so the chest if it spawns in same location as player its not instantly collected
    // this.time.delayedCall(1000, this.spawnChest, [], this);
    this.events.emit("pickupChest", chest.id, player.id);
  }

  createMap() {
    this.map = new Map(this, "map", "background", "background", "blocked");
  }

  createGameManager() {
    this.events.on("spawnPlayer", (player) => {
      this.createPlayer(player);
      this.addCollisions();
    });
    this.events.on("chestSpawned", (chest) => {
      this.spawnChest(chest);
    });
    this.events.on("monsterSpawned", (monster) => {
      this.spawnMonster(monster);
    });

    this.events.on("monsterRemoved", (monsterID) => {
      this.monsters.getChildren().forEach((monster) => {
        if (monster.id === monsterID) {
          monster.makeInactive();
        }
      });
    });

    this.events.on("chestRemoved", (chestID) => {
      this.chests.getChildren().forEach((chest) => {
        if (chest.id === chestID) {
          chest.makeInactive();
        }
      });
    });

    this.events.on("updateMonsterHealth", (monsterID, health) => {
      this.monsters.getChildren().forEach((monster) => {
        if (monster.id === monsterID) {
          monster.updateHealth(health);
        }
      });
    });
    this.gameManager = new GameManager(this, this.map.map.objects);
    this.gameManager.setup();
  }
}
