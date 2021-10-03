class PlayerModel {
  constructor(playerId, spawnLocations, players) {
    this.health = 10;
    this.maxHealth = 10;
    this.gold = 0;
    this.flipX = true;
    this.playerAttacking = false;
    this.id = playerId;
    this.spawnLocations = spawnLocations;

    [this.x, this.y] = this.generateLocation(players);
  }

  updateGold(gold) {
    this.gold += gold;
  }

  updateHealth(health) {
    this.health += health;
    if (this.health > 10) {
      this.health = 10;
    }
  }

  respawn(players) {
    this.health = this.maxHealth;
    const location = this.generateLocation(players);
    // this.x = location[0] * 2;
    // this.y = location[1] * 2;
    [this.x, this.y] = location;
  }

  generateLocation(players) {
    const location =
      this.spawnLocations[
        Math.floor(Math.random() * this.spawnLocations.length)
      ];
    const inValidLocation = Object.keys(players).some((key) => {
      if (players[key].x === location[0] && players[key].y === location[1]) {
        return true;
      } else {
        return false;
      }
    });
    if (inValidLocation) return this.generateLocation(players);
    return location;
  }
}
module.exports = PlayerModel;
