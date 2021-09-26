const PlayerModel = require("./PlayerModel");
const levelData = require("../../client/src/shared/level/large_level.json");
class GameManager {
  constructor(io) {
    this.io = io;

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
    this.levelData = levelData;
    console.log("level data: ", this.levelData);
    this.levelData.layers.forEach((layer) => {
      if (layer.name === "player_locations") {
        layer.objects.forEach((obj) => {
          this.playerLocations.push([obj.x, obj.y]);
        });
      } else if (layer.name === "monster_locations") {
        layer.objects.forEach((obj) => {
          if (this.monsterLocations[obj.properties.spawner]) {
            this.monsterLocations[obj.properties.spawner].push([obj.x, obj.y]);
          } else {
            this.monsterLocations[obj.properties.spawner] = [[obj.x, obj.y]];
          }
        });
      } else if (layer.name === "chest_locations") {
        layer.objects.forEach((obj) => {
          if (this.chestLocations[obj.properties.spawner]) {
            this.chestLocations[obj.properties.spawner].push([obj.x, obj.y]);
          } else {
            this.chestLocations[obj.properties.spawner] = [[obj.x, obj.y]];
          }
        });
      }
    });
  }

  setupEventListeners() {
    this.io.on("connection", (socket) => {
      socket.on("disconnect", () => {
        console.log("Player Discconect: ");
        // Delete from server
        delete this.players[socket.id];
        // Emit to all players
        this.io.emit("playerDisconnect", socket.id);
      });

      socket.on("newPlayer", () => {
        // Create new player
        this.spawnPlayer(socket.id);

        // Send players object to player
        socket.emit("currentPlayers", this.players);

        // send monster to player
        socket.emit("currentMonsters", this.monsters);
        // send cheests to ;ayer
        socket.emit("currentChests", this.chests);

        // inform other players
        socket.broadcast.emit("spawnPlayer", this.players[socket.id]);
      });

      socket.on("playerMovement", (playerData) => {
        if (this.players[socket.id]) {
          this.players[socket.id].x = playerData.x;
          this.players[socket.id].y = playerData.y;
          this.players[socket.id].flipX = playerData.flipX;
          this.players[socket.id].playerAttacking = playerData.playerAttacking;
          this.players[socket.id].currentDirection =
            playerData.currentDirection;

          // Emit messagge to all players
          this.io.emit("playerMoved", this.players[socket.id]);
        }
      });
    });
  }
  setupSpawners() {}
  spawnPlayer(playerId) {
    const player = new PlayerModel(playerId, this.playerLocations);
    this.players[playerId] = player;
  }
}

module.exports = GameManager;
