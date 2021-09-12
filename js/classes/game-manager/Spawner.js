class Spawner {
  constructor(config, spawnLocations, addObject, deleteObject) {
    this.id = config.id;
    this.spawnInterval = config.spawnInterval;
    this.limit = config.limit;
    this.objectType = config.spawnerType;
    this.spawnLocations = spawnLocations;
    this.addObject = addObject;
    this.deleteObject = deleteObject;

    this.objectsCreated = [];

    this.start();
  }

  start() {
    this.interval = setInterval(() => {
      if (this.objectsCreated.length < this.limit) {
        this.spawnObject();
      }
    }, this.spawnInterval);
  }

  spawnObject() {
    console.log("SPAWNING SOMETHING");
    if (this.objectType === SPAWN_TYPE.CHEST) {
      this.spawnChest();
    }
  }

  spawnChest() {
    const location = this.pickRandomLocation();
    const gold = randomNumber(1, 100);
    const chest = new ChestModel(location[0], location[1], gold, this.id);
    this.objectsCreated.push(chest);
    this.addObject(chest.id, chest);
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
    this.objectsCreated === this.objectsCreated.filter((obj) => obj.id !== id);
    thiws.deleteObject(id);
  }
}
