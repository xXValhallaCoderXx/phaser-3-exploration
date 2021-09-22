import { useRef, useEffect } from "react";
import Phaser from "phaser";
import styled from "styled-components";
import BootScene from "game-core/scenes/BootScene";
import TitleScene from "game-core/scenes/TitleScene";
import GameScene from "game-core/scenes/GameScene";
import UiScene from "game-core/scenes/UiScene";

// type: Phaser.AUTO,
// mode: Phaser.Scale.FIT,

let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "phaser",
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
  pixelArt: true,
  roundPixels: true, // Sometimes when sclaing it may be a float number
};

const GameContainer = () => {
  const phaserGame = useRef({});
  useEffect(() => {
    phaserGame.current = new Phaser.Game(config);
    return () => phaserGame.current.destroy(true);
  }, []);
  return (
    <Container>
      <div style={{ position: "relative" }} className="phaser" id="phaser" />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  height: 100vh;

  align-items: center;
  flex-direction: column;
`;

export default GameContainer;
