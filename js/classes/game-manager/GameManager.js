class GameManager {
  constructor(scene, mapData) {
    this.scene = scene;
    this.mapData = mapData;

    this.spawners = {};
    this.players = {};
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
  /* 


Logout
My Courses
Subscriber Discounts
My Account
The anchor point of an object is the point of its sprite where its location points to. For example, in Tiled, the location of an object refers to the location of its bottom left corner. On the other hand, in Phaser 3, the default anchor point is the middle of the object.

Because of that, when creating a new object from a Tiled map, you need to handle this difference in order to create the object visually in the same location as in the Tiled map.

An easy way to fix that is changing the parseMapData method to adjust the locations accordingly, as below. Notice that, instead of using (obj.x, obj.y) we use (obj.x + (obj.width / 2), obj.y – (obj.height / 2)).
*/
  parseMapData() {
    this.mapData.forEach((layer) => {
      if (layer.name === "player_locations") {
        layer.objects.forEach((obj) =>
          this.playerLocations.push([
            obj.x + obj.width / 2,
            obj.y - obj.height / 2,
          ])
        );
      } else if (layer.name === "chest_locations") {
        layer.objects.forEach((obj) => {
          if (this.chestLocations[obj.properties.spawner]) {
            this.chestLocations[obj.properties.spawner].push([
              obj.x + obj.width / 2,
              obj.y - obj.height / 2,
            ]);
          } else {
            this.chestLocations[obj.properties.spawner] = [
              [obj.x + obj.width / 2, obj.y - obj.height / 2],
            ];
          }
        });
      } else if (layer.name === "monster_locations") {
        layer.objects.forEach((obj) => {
          if (this.monsterLocations[obj.properties.spawner]) {
            this.monsterLocations[obj.properties.spawner].push([
              obj.x + obj.width / 2,
              obj.y - obj.height / 2,
            ]);
          } else {
            this.monsterLocations[obj.properties.spawner] = [
              [obj.x + obj.width / 2, obj.y - obj.height / 2],
            ];
          }
        });
      }
    });

    console.log("PLAYERS:", this.playerLocations);
    console.log("MONSTER: ", this.monsterLocations);
  }

  setupEventListeners() {
    this.scene.events.on("pickupChest", (chestID, playerID) => {
      // Update spawner
      if (this.chests[chestID]) {
        const { gold } = this.chests[chestID];
        this.players[playerID].updateGold(gold);
        // Update score
        this.scene.events.emit("updateScore", this.players[playerID].gold);
        // Check if exists in object array
        // Get its spawnerID
        // In spawner ID call remove object
        this.spawners[this.chests[chestID].spawnerId].removeObject(chestID);
        this.scene.events.emit("chestRemoved", chestID);
      }
    });
    this.scene.events.on("monsterAttacked", (monsterId) => {
      // Update spawner
      if (this.monsters[monsterId]) {
        // Subtract HP
        console.log("WHAT: ", this.monsters[monsterId]);
        this.monsters[monsterId].loseHealth();

        // CHeck monster dead then remove
        if (this.monsters[monsterId].health <= 0) {
          // Check if exists in object array
          // Get its spawnerID
          // In spawner ID call remove object
          this.spawners[this.monsters[monsterId].spawnerId].removeObject(
            monsterId
          );
          this.scene.events.emit("monsterRemoved", monsterId);
        } else {
          this.scene.events.emit(
            "updateMonsterHealth",
            monsterId,
            this.monsters[monsterId].health
          );
        }
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
    const player = new PlayerModel(this.playerLocations);
    this.players[player.id] = player;
    this.scene.events.emit("spawnPlayer", player);
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
