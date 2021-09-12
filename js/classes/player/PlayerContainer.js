class PlayerContainer extends Phaser.GameObjects.Container {
  constructor(scene, x, y, key, frame) {
    super(scene, x, y);

    //store a reference to the scene
    this.scene = scene;
    this.velocity = 160;
    this.currentDirection = DIRECTION.RIGHT;
    this.playerAttacking = false;
    this.flipX = true;
    this.swordHit = false;
    // set size on container
    // by default container wont have size till objs added
    this.setSize(64, 64);

    // enable physics
    this.scene.physics.world.enable(this);

    // collide with world bounds
    this.body.setCollideWorldBounds(true);
    // add the player to our existing scene
    this.scene.add.existing(this);

    this.scene.cameras.main.startFollow(this);

    // create player
    // Game object is relative to container
    this.player = new Player(this.scene, 0, 0, key, frame);
    this.add(this.player);

    // Create weapon
    this.weapon = this.scene.add.image(40, 0, "items", 4);
    this.weapon.setScale(1.5);
    this.scene.physics.world.enable(this.weapon);
    this.add(this.weapon);
    this.weapon.alpha = 0; // Want weapon to show only when swinging
  }

  update(cursors) {
    this.body.setVelocity(0);

    if (cursors.left.isDown) {
      this.body.setVelocityX(-this.velocity);
      this.currentDirection = DIRECTION.LEFT;
      this.weapon.setPosition(-40, 0);
      this.player.flipX = false;
    } else if (cursors.right.isDown) {
      this.body.setVelocityX(this.velocity);
      this.currentDirection = DIRECTION.RIGHT;
      this.weapon.setPosition(40, 0);
      this.player.flipX = true;
    }

    if (cursors.up.isDown) {
      this.body.setVelocityY(-this.velocity);
      this.currentDirection = DIRECTION.UP;
      this.weapon.setPosition(0, -40);
    } else if (cursors.down.isDown) {
      this.body.setVelocityY(this.velocity);
      this.weapon.setPosition(0, 40);
      this.currentDirection = DIRECTION.DOWN;
    }

    if (
      Phaser.Input.Keyboard.JustDown(cursors.space) &&
      !this.playerAttacking
    ) {
      this.weapon.alpha = 1;
      this.playerAttacking = true;
      this.scene.time.delayedCall(
        150,
        () => {
          this.weapon.alpha = 0;
          this.playerAttacking = false;
          this.swordHit = false;
        },
        [],
        this
      );
    }

    if (this.playerAttacking) {
      if (this.weapon.flipX) {
        this.weapon.angle -= 10;
      } else {
        this.weapon.angle += 10;
      }
    } else {
      if (this.currentDirection === DIRECTION.DOWN) {
        this.weapon.setAngle(-270);
      } else if (this.currentDirection === DIRECTION.UP) {
        this.weapon.setAngle(-90);
      } else {
        this.weapon.setAngle(0);
      }
    }

    this.weapon.flipX = false;
    if (this.currentDirection === DIRECTION.LEFT) {
      this.weapon.flipX = true;
    }
  }
}

const DIRECTION = {
  RIGHT: "RIGHT",
  LEFT: "LEFT",
  UP: "UP",
  DOWN: "DOWN",
};
