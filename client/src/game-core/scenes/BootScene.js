import Phaser from "phaser";
import button1 from "shared/images/ui/blue_button01.png";
import button2 from "shared/images/ui/blue_button02.png";
import background from "shared/level/background-extruded.png";
import goalSound from "shared/audio/Pickup.wav";
import enemyDeath from "shared/audio/EnemyDeath.wav";
import playerAttack from "shared/audio/PlayerAttack.wav";
import playerDamage from "shared/audio/PlayerDamage.wav";
import playerDeath from "shared/audio/PlayerDeath.wav";
import itemSpriteSheet from "shared/images/items.png";
import charSpriteSheet from "shared/images/characters.png";
import monsterSpriteSheet from "shared/images/monsters.png";
import tileMap from "shared/level/large_level.json";
class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    this.loadImages();
    this.loadAudio();
    this.loadSpriteSheets();
    this.loadTileMap();
  }

  loadImages() {
    this.load.image("button1", button1);
    this.load.image("button2", button2);
    this.load.image("background", background);
  }

  loadSpriteSheets() {
    this.load.spritesheet("items", itemSpriteSheet, {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("characters", charSpriteSheet, {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("monsters", monsterSpriteSheet, {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  loadAudio() {
    // Could provide a wav and mp3 and phaser will choose best one for broswser
    this.load.audio("goalSound", [goalSound]);
    this.load.audio("enemyDeath", [enemyDeath]);
    this.load.audio("playerAttack", [playerAttack]);
    this.load.audio("playerDamage", [playerDamage]);
    this.load.audio("playerDeath", [playerDeath]);
  }
  create() {
    this.scene.start("Game");
  }

  loadTileMap() {
    this.load.tilemapTiledJSON("map", tileMap);
  }
}

export default BootScene;
