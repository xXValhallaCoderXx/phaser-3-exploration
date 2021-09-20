import styled from "styled-components";
import { Card, Button, Input, FormField, FormLabel } from "shared/components";

const GameContainer = () => {
  const onClick = () => {};
  return (
    <Container>
      GAME
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
