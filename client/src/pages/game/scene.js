/* eslint-disable no-useless-constructor */
import Phaser from "phaser";
import logoImg from "./logo.svg";
import store from "config/store";
// import { increment } from "../../slices/ui-core";
class PhaserCore extends Phaser.Scene {
  constructor(config) {
    super(config);
  }

  preload() {
    this.load.image("logo", logoImg);
  }

  create() {
    const logo = this.add.image(400, 150, "logo");
    logo.setInteractive();

    logo.on("pointerdown", function (pointer) {
      console.log("CLICK", pointer);
      // store.dispatch(increment());
    });
    this.tweens.add({
      targets: logo,
      y: 450,
      x: 100,
      duration: 2000,
      ease: "Power2",
      yoyo: true,
      loop: -1,
    });
  }
}

export default PhaserCore;
