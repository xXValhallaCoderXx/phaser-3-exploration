const { SPAWN_TYPE, randomNumber } = require("../utils");
const ChestModel = require("./ChestModel");
const MonsterModel = require("./MonsterModel");

class Spawner {
  constructor(config, spawnLocations, addObject, deleteObject, moveObjects) {
    this.id = config.id;
    this.spawnInterval = config.spawnInterval;
    this.limit = config.limit;
    this.objectType = config.spawnerType;
    this.spawnLocations = spawnLocations;
    this.addObject = addObject;
    this.deleteObject = deleteObject;
    this.moveObjects = moveObjects;
    this.objectsCreated = [];

    this.start();
  }

  start() {
    this.interval = setInterval(() => {
      if (this.objectsCreated.length < this.limit) {
        this.spawnObject();
      }
    }, this.spawnInterval);
    if (this.objectType === SPAWN_TYPE.MONSTER) {
      this.moveMonsters();
    }
  }

  spawnObject() {
    if (this.objectType === SPAWN_TYPE.CHEST) {
      this.spawnChest();
    } else if (this.objectType === SPAWN_TYPE.MONSTER) {
      this.spawnMonster();
    }
  }

  spawnChest() {
    const location = this.pickRandomLocation();
    const gold = randomNumber(1, 100);
    const chest = new ChestModel(location[0], location[1], gold, this.id);
    this.objectsCreated.push(chest);
    this.addObject(chest.id, chest);
  }

  spawnMonster() {
    const location = this.pickRandomLocation();
    const gold = randomNumber(1, 100);
    const monsterType = randomNumber(0, 20);
    const health = randomNumber(3, 5);
    const monster = new MonsterModel(
      location[0],
      location[1],
      gold,
      this.id,
      monsterType,
      health,
      1
    );
    this.objectsCreated.push(monster);
    this.addObject(monster.id, monster);
  }

  pickRandomLocation() {
    const location =
      this.spawnLocations[
        Math.floor(Math.random() * this.spawnLocations.length)
      ];

    // Check current locations are not already taken
    const invalidLocations = this.objectsCreated.some((obj) => {
      if (obj.x === location[0] && this.objectType.y === location[1]) {
        return true;
      } else {
        return false;
      }
    });
    if (invalidLocations) {
      return this.pickRandomLocation();
    }
    return location;
  }

  removeObject(id) {
    // eslint-disable-next-line no-unused-expressions
    this.objectsCreated === this.objectsCreated.filter((obj) => obj.id !== id);
    this.deleteObject(id);
  }

  moveMonsters() {
    this.moveMonsterInterval = setInterval(() => {
      this.objectsCreated.forEach((monster) => {
        monster.move();
      });
      this.moveObjects();
    }, 1000);
  }
}

module.exports = Spawner;
