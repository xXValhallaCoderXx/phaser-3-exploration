class TitleScene extends Phaser.Scene {
  constructor() {
    super("Title");
  }

  preload() {}

  create() {
    this.titleText = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      "MMORPG",
      {
        fontSize: "64px",
        fill: "#fff",
      }
    );
    this.titleText.setOrigin(0.5);
    this.button = this.add.image(
      this.scale.width / 2,
      this.scale.height * 0.65,
      "button1"
    );
  }
}
