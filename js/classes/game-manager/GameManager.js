class GameManager {
  constructor(scene, mapData) {
    this.scene = scene;
    this.mapData = mapData;

    this.spawners = {};
    this.chests = {};
    this.monsters = {};
    this.playerLocations = [];
    this.chestLocations = {};
    this.monsterLocations = {};
  }

  setup() {
    this.parseMapData();
    this.setupEventListeners();
    this.setupSpawners();
    this.spawnPlayer();
  }

  parseMapData() {
    this.mapData.forEach((layer) => {
      if (layer.name === "player_locations") {
        layer.objects.forEach((player) =>
          this.playerLocations.push([player.x, player.y])
        );
      } else if (layer.name === "chest_locations") {
        layer.objects.forEach((chest) => {
          if (this.chestLocations[chest.properties.spawner]) {
            this.chestLocations[chest.properties.spawner].push([
              chest.x,
              chest.y,
            ]);
          } else {
            this.chestLocations[chest.properties.spawner] = [
              [chest.x, chest.y],
            ];
          }
        });
      } else if (layer.name === "monster_locations") {
        layer.objects.forEach((monster) => {
          if (this.monsterLocations[monster.properties.spawner]) {
            this.monsterLocations[monster.properties.spawner].push([
              monster.x,
              monster.y,
            ]);
          } else {
            this.chestLocations[monster.properties.spawner] = [
              [monster.x, monster.y],
            ];
          }
        });
      }
    });

    console.log("PLAYERS:", this.playerLocations);
    console.log("MONSTER: ", this.monsterLocations);
  }

  setupEventListeners() {
    this.scene.events.on("pickupChest", (chestID) => {
      // Update spawner
      if (this.chests[chestID]) {
        // Check if exists in object array
        // Get its spawnerID
        // In spawner ID call remove object
        this.spawners[this.chests[chestID].spawnerId].removeObject(chestID);
      }
    });
  }
  setupSpawners() {
    const config = {
      spawnInterval: 3000,
      limit: 3,
      spawnerType: SPAWN_TYPE.CHEST,
      id: ``,
    };
    let spawner;
    Object.keys(this.chestLocations).forEach((key) => {
      config.id = `chest-${key}`;
      spawner = new Spawner(
        config,
        this.chestLocations[key],
        this.addChest.bind(this),
        this.deleteChest.bind(this)
      );
      this.spawners[spawner.id] = spawner;
    });

    Object.keys(this.monsterLocations).forEach((key) => {
      config.id = `monster-${key}`;
      config.spawnerType = SPAWN_TYPE.MONSTER;

      spawner = new Spawner(
        config,
        this.monsterLocations[key],
        this.addMonster.bind(this),
        this.deleteMonster.bind(this)
      );
      this.spawners[spawner.id] = spawner;
    });
  }
  spawnPlayer() {
    const location =
      this.playerLocations[
        Math.floor(Math.random() * this.playerLocations.length)
      ];

    this.scene.events.emit("spawnPlayer", location);
  }

  addChest(id, chest) {
    this.chests[id] = chest;
    this.scene.events.emit("chestSpawned", chest);
  }

  deleteChest(chestId) {
    delete this.chests[chestId];
  }

  addMonster(id, monster) {
    this.monsters[id] = monster;
    this.scene.events.emit("monsterSpawned", monster);
  }

  deleteMonster(id) {
    delete this.monsters[id];
  }
}
