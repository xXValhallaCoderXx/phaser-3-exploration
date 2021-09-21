import { useEffect } from "react";
import styled from "styled-components";
import { Card, Button, Input, FormField, FormLabel } from "shared/components";

import Phaser from "phaser";
import PhaserCore from "pages/game/scene";

const config = {
  type: Phaser.AUTO,
  mode: Phaser.Scale.FIT,
  parent: "phaser",

  scene: PhaserCore,
};

const GameContainer = () => {
  useEffect(() => {
    new Phaser.Game(config);
  }, []);
  const onClick = () => {};
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
