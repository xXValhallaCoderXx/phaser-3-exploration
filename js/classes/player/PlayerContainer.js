class PlayerContainer extends Phaser.GameObjects.Container {
  constructor(scene, x, y, key, frame, health, maxHealth, id) {
    super(scene, x, y);

    //store a reference to the scene
    this.scene = scene;
    this.velocity = 160;
    this.currentDirection = DIRECTION.RIGHT;
    this.playerAttacking = false;
    this.flipX = true;
    this.swordHit = false;
    this.health = health;
    this.maxHealth = maxHealth;
    this.id = id;
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

    this.createHealthBar();
  }

  updateHealth(health) {
    this.health = health;
    this.updateHealthBar();
  }

  createHealthBar() {
    this.healthBar = this.scene.add.graphics();
    this.updateHealthBar();
  }

  updateHealthBar() {
    this.healthBar.clear();
    this.healthBar.fillStyle(0xffffff, 1);
    this.healthBar.fillRect(this.x - 32, this.y - 40, 64, 5);
    this.healthBar.fillGradientStyle(0xff0000, 0xffffff, 4);
    this.healthBar.fillRect(
      this.x - 32,
      this.y - 40,
      64 * (this.health / this.maxHealth),
      5
    );
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

    this.updateHealthBar();
  }
}

const DIRECTION = {
  RIGHT: "RIGHT",
  LEFT: "LEFT",
  UP: "UP",
  DOWN: "DOWN",
};
