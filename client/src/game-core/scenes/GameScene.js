import Phaser from "phaser";
import PlayerContainer from "game-core/classes/player/PlayerContainer";
import Chest from "game-core/classes/Chest";
import Monster from "game-core/classes/Monster";
import Map from "game-core/classes/Map";
import SocketService from "shared/services/socket/socket-service";

class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");

    this.socket = SocketService?.socket;
  }

  init() {
    // Launch instead of start will run scene in parallele - what ever scene active 1st is on bittom lauyet
    // Start will shut down current and switch to new
    this.scene.launch("Ui");

    // Listen for websocket Events
    this.socketListener();
  }

  socketListener() {
    // Spawn player game objects
    this.socket.on("currentPlayers", (players) => {
      console.log("All current players: ", players);
      Object.keys(players).forEach((id) => {
        if (players[id].id === this.socket.id) {
          this.createPlayer(players[id], true);
          this.addCollisions();
        } else {
          this.createPlayer(players[id], false);
        }
      });
    });
    this.socket.on("currentMonsters", (monsters) => {
      Object.keys(monsters).forEach((id) => {
        this.spawnMonster(monsters[id]);
      });
    });
    this.socket.on("currentChests", (chests) => {
      Object.keys(chests).forEach((id) => {
        this.spawnChest(chests[id]);
      });
    });
    this.socket.on("spawnPlayer", (player) => {
      console.log("New Player Event", player);
      this.createPlayer(player, false);
    });

    this.socket.on("playerMoved", (player) => {
      this.otherPlayers.getChildren().forEach((otherPlayer) => {
        if (player.id === otherPlayer.id) {
          console.log("OTHER PLAYER: ", otherPlayer);
          otherPlayer.flipX = player.flipX;
          otherPlayer.setPosition(player.x, player.y);
          otherPlayer.updateHealthBar();
          otherPlayer.updateFlipX();
          otherPlayer.playerAttacking = player.playerAttacking;
          otherPlayer.currentDirection = player.currentDirection;
          if (player.playerAttacking) {
            otherPlayer.attack();
          }
        }
      });
    });

    this.socket.on("chestSpawned", (chest) => {
      this.spawnChest(chest);
    });
    this.socket.on("monsterSpawned", (monster) => {
      this.spawnMonster(monster);
    });

    this.socket.on("chestRemoved", (chestID) => {
      this.chests.getChildren().forEach((chest) => {
        if (chest.id === chestID) {
          chest.makeInactive();
        }
      });
    });

    this.socket.on("monsterRemoved", (monsterID) => {
      this.monsters.getChildren().forEach((monster) => {
        if (monster.id === monsterID) {
          monster.makeInactive();
          this.monsterDeathAudio.play();
        }
      });
    });

    this.socket.on("monsterMovement", (monsters) => {
      this.monsters.getChildren().forEach((monster) => {
        Object.keys(monsters).forEach((monsterID) => {
          if (monster.id === monsterID) {
            this.physics.moveToObject(monster, monsters[monsterID], 40);
          }
        });
      });
    });

    this.socket.on("updateScore", (goldAmount) => {
      this.events.emit("updateScore", goldAmount);
    });

    this.socket.on("updateMonsterHealth", (monsterID, health) => {
      this.monsters.getChildren().forEach((monster) => {
        if (monster.id === monsterID) {
          monster.updateHealth(health);
        }
      });
    });

    this.socket.on("updatePlayerHealth", (playerID, health) => {
      if (this.player.id === playerID) {
        if (health < this.player.health) {
          this.playerDamageAudio.play();
        }
        this.player.updateHealth(health);
      } else {
        this.otherPlayers.getChildren().forEach((player) => {
          if (player.id === playerID) {
            player.updateHealth(health);
          }
        });
      }
    });

    this.socket.on("respawnPlayer", (playerObject) => {
      if (this.player.id === playerObject.id) {
        this.player.respawn(playerObject);
        this.playerDeathAudio.play();
      } else {
        this.otherPlayers.getChildren().forEach((player) => {
          if (player.id === playerObject.id) {
            player.respawn(playerObject);
          }
        });
      }
    });
  }

  preload() {}

  create() {
    this.createMap();
    this.createAudio();
    this.createGroups();

    this.createInput();

    this.socket.emit("newPlayer");
  }
  update() {
    if (this.player) {
      // On classes update method is not run automatically so we are calling it
      this.player.update(this.cursors);
    }

    // Check if current pos or flip x is different to rec to see if player moved
    if (this.player) {
      // emit movement to server
      const { x, y, flipX, playerAttacking, currentDirection } = this.player;
      if (
        this.player.oldPosition &&
        (x !== this.player.oldPosition.x ||
          y !== this.player.oldPosition.y ||
          flipX !== this.player.oldPosition.flipX ||
          playerAttacking !== this.player.oldPosition.playerAttacking)
      ) {
        this.socket.emit("playerMovement", {
          x,
          y,
          flipX,
          playerAttacking,
          currentDirection,
        });
      }

      // Save old position
      this.player.oldPosition = {
        x: this.player?.x ?? 0,
        y: this.player?.y ?? 0,
        flipX: this.player?.flipX,
        playerAttacking: this.player?.playerAttacking,
      };
    }
  }

  createAudio() {
    this.goldPickupSound = this.sound.add("goalSound", {
      loop: false,
      // volume: 0.2,
    });
    this.playerAttackAudio = this.sound.add("playerAttack", {
      loop: false,
      // volume: 0.2,
    });
    this.playerDamageAudio = this.sound.add("playerDamage", {
      loop: false,
      // volume: 0.2,
    });
    this.playerDeathAudio = this.sound.add("playerDeath", {
      loop: false,
      // volume: 0.2,
    });
    this.monsterDeathAudio = this.sound.add("enemyDeath", {
      loop: false,
      // volume: 0.2,
    });
  }

  createPlayer(playerObject, mainPlayer) {
    const newPlayerGameObject = new PlayerContainer(
      this,
      playerObject.x * 2,
      playerObject.y * 2,
      "characters",
      0,
      playerObject.health,
      playerObject.maxHealth,
      playerObject.id,
      this.playerAttackAudio,
      mainPlayer
    ); // NEW

    if (!mainPlayer) {
      this.otherPlayers.add(newPlayerGameObject);
    } else {
      this.player = newPlayerGameObject;
    }
  }

  createGroups() {
    // Chest group
    this.chests = this.physics.add.group();
    this.monsters = this.physics.add.group();
    this.monsters.runChildUpdate = true; // Will run update in all children
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

    // Other plays
    this.otherPlayers = this.physics.add.group();
    this.otherPlayers.runChildUpdate = true;
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
        monsterObj.x,
        monsterObj.y,
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
      monster.setPosition(monsterObj.x, monsterObj.y);
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
      this.socket.emit("monsterAttacked", enemy.id);
    }
  }

  collectChest(player, chest) {
    chest.makeInactive();
    this.goldPickupSound.play();

    this.socket.emit("updateScore", this.score);
    // Delayed call so the chest if it spawns in same location as player its not instantly collected
    // this.time.delayedCall(1000, this.spawnChest, [], this);
    this.socket.emit("pickupChest", chest.id);
  }

  createMap() {
    this.map = new Map(this, "map", "background", "background", "blocked");
  }
}

export default GameScene;
