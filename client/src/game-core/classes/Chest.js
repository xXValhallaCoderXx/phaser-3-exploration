import Phaser from "phaser";

class Chest extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, key, frame, coins, id) {
    super(scene, x, y, key, frame);
    this.id = id;
    this.scene = scene;
    this.coins = coins; // Coins inside chest
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);

    this.setScale(2);
  }

  makeActive() {
    this.setActive(true);
    this.setVisible(true);
    this.body.checkCollision.none = false;
  }

  makeInactive() {
    this.setActive(false);
    this.setVisible(false);
    this.body.checkCollision.none = true;
  }
}

export default Chest;
