// create a new scene named "Game"
let gameScene = new Phaser.Scene("Game");

// some parameters for our scene
gameScene.init = function () {
  this.nextWord = undefined;
  this.words = [
    {
      key: "building",
      setXY: {
        x: 100,
        y: 240,
      },
      spanish: "Edificio",
    },
    {
      key: "house",
      setXY: {
        x: 240,
        y: 280,
      },
      setScale: {
        x: 0.8,
        y: 0.8,
      },
      spanish: "Casa",
    },
    {
      key: "car",
      setXY: {
        x: 400,
        y: 300,
      },
      setScale: {
        x: 0.8,
        y: 0.8,
      },
      spanish: "Automovil",
    },
    {
      key: "tree",
      setXY: {
        x: 550,
        y: 250,
      },
      spanish: "Arbol",
    },
  ];
};

// load asset files for our game
gameScene.preload = function () {
  this.load.image("background", "assets/images/background-city.png");
  this.load.image("building", "assets/images/building.png");
  this.load.image("car", "assets/images/car.png");
  this.load.image("house", "assets/images/house.png");
  this.load.image("tree", "assets/images/tree.png");

  this.load.audio("treeAudio", "assets/audio/arbol.mp3");
  this.load.audio("carAudio", "assets/audio/auto.mp3");
  this.load.audio("houseAudio", "assets/audio/casa.mp3");
  this.load.audio("buildingAudio", "assets/audio/edificio.mp3");
  this.load.audio("treeAudio", "assets/audio/arbol.mp3");
  this.load.audio("correctAudio", "assets/audio/correct.mp3");
  this.load.audio("wrongAudio", "assets/audio/wrong.mp3");
};

// executed once, after assets were loaded
gameScene.create = function () {
  this.items = this.add.group(this.words);

  let bg = this.add.sprite(0, 0, "background").setOrigin(0, 0);
  // bg.depth = -1;
  this.items.setDepth(1);

  // let items = this.items.getChildren();

  // for (let i = 0; i < this.items.length; i++) {
  //   let item = items[i];

  //   item.setInteractive();

  //   // Resize tween
  //   item.resizeTween = this.tweens.add({
  //     targets: item,
  //     scaleX: 1.2,
  //     scaleY: 1.2,
  //     duration: 200,
  //     paused: true,
  //     yoyo: true,
  //   });

  //   item.alphaTween = this.tweens.add({
  //     targets: item,
  //     alpha: 0.7,
  //     duration: 200,
  //     paused: true,
  //   });
  //   item.on(
  //     "pointerdown",
  //     function (pointer) {
  //       item.resizeTween.restart();
  //       // Show next question
  //       this.showNextQuestion();
  //     },
  //     this
  //   );

  //   item.on("pointerover", function (pointer) {
  //     item.alphaTween.restart();
  //   });
  //   item.on("pointerout", function (pointer) {
  //     item.alphaTween.stop(); // Because animation may still be running
  //     item.alpha = 1;
  //   });
  // }

  Phaser.Actions.Call(
    this.items.getChildren(),
    function (item) {
      item.setInteractive();

      // Resize tween
      item.correctTween = this.tweens.add({
        targets: item,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 200,
        paused: true,
        yoyo: true,
      });

      item.wrongTween = this.tweens.add({
        targets: item,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 200,
        angle: 90,
        paused: true,
        yoyo: true,
      });

      item.alphaTween = this.tweens.add({
        targets: item,
        alpha: 0.7,
        duration: 200,
        paused: true,
      });
      item.on(
        "pointerdown",
        function (pointer) {
          // item.resizeTween.restart();
          // Show next question

          let result = this.processAnswer(item.texture.key);
          if (result) {
            item.correctTween.restart();
          } else {
            item.wrongTween.restart();
          }
          console.log("RESULT", result);
          this.showNextQuestion();
        },
        this
      );

      item.on("pointerover", function (pointer) {
        item.alphaTween.restart();
      });
      item.on("pointerout", function (pointer) {
        item.alphaTween.stop(); // Because animation may still be running
        item.alpha = 1;
      });
    },
    this
  );

  this.wordText = this.add.text(30, 20, " ", {
    font: "28px Open Sans",
    fill: "#ffffff",
  });

  this.correctSound = this.sound.add("correctAudio");
  this.wrongSound = this.sound.add("wrongAudio");

  this.showNextQuestion();
};

// SHow question

gameScene.showNextQuestion = function () {
  //Select random word - Phase has util functions
  this.nextWord = Phaser.Math.RND.pick(this.words);

  //Play sound
  let spainishSound = this.sound.add(`${this.nextWord.key}Audio`);
  spainishSound.play();
  // SHow Text

  this.wordText.setText(this.nextWord.spanish);
};

gameScene.processAnswer = function (userResponse) {
  console.log("X : ", this.nextWord.key);
  console.log("Y : ", userResponse);
  if (userResponse === this.nextWord.key) {
    this.correctSound.play();
    return true;
  } else {
    this.wrongSound.play();
    return false;
  }
};

// our game's configuration
let config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  scene: gameScene,
  title: "Spanish Learning Game",
  pixelArt: false,
};

// create the game, and pass it the configuration
let game = new Phaser.Game(config);
