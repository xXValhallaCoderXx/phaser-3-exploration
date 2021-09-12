// our game's configuration
let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scale: {
    mode: Phaser.Scale.FIT,
  },
  scene: [BootScene, TitleScene, GameScene, UiScene],
  title: "MMO",
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: {
        y: 0,
      },
    },
  },
};

// create the game, and pass it the configuration
let game = new Phaser.Game(config);
