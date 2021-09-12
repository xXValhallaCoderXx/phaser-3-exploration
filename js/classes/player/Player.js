class Player extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, key, frame) {
    super(scene, x, y, key, frame);

    //store a reference to the scene
    this.scene = scene;

    // enable physics
    this.scene.physics.world.enable(this);
    // set immovable if another object collides with our player
    this.setImmovable(true);
    // scale our player
    this.setScale(2);

    // add the player to our existing scene
    this.scene.add.existing(this);
  }
}
