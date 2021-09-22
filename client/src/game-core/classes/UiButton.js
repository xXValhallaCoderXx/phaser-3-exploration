import Phaser from "phaser";

class UiButton extends Phaser.GameObjects.Container {
  constructor(scene, x, y, key, hoverKey, text, onClick) {
    super(scene, x, y);
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.key = key;
    this.hoverKey = hoverKey; // Image displayed on hover
    this.text = text;
    this.onClick = onClick; // onClick callback

    this.createButton();
    this.scene.add.existing(this);
  }
  createButton() {
    this.button = this.scene.add.image(0, 0, "button1"); // Position is set relative to container scene

    this.button.setInteractive();
    this.button.setScale(1.4);
    this.buttonText = this.scene.add.text(0, 0, this.text, {
      fontSize: "26px",
      fill: "#fff",
    });
    Phaser.Display.Align.In.Center(this.buttonText, this.button);

    // Add two game objects to container
    this.add(this.button);
    this.add(this.buttonText);
    this.button.on("pointerdown", () => {
      this.onClick();
    });
    this.button.on("pointerover", () => {
      this.button.setTexture(this.hoverKey);
    });
    this.button.on("pointerout", () => {
      this.button.setTexture(this.key);
    });
  }
}

export default UiButton;
