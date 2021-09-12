class MonsterModel {
  constructor(x, y, gold, spawnerId, frame, health, attackPower) {
    this.id = `${spawnerId}-${uuidv4()}`;
    this.spawnerId = spawnerId;
    this.x = x;
    this.y = y;
    this.gold = gold;
    this.frame = frame;
    this.health = health;
    this.maxHealth = health;
    this.attack = attackPower;
  }

  loseHealth() {
    this.health -= 1;
  }
}
