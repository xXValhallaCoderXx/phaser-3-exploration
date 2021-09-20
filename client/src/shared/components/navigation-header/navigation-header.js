import styled from "styled-components";
import { Link as RouterLink } from "react-router-dom";
const NavigationHeader = () => {
  return (
    <Container>
      <Link to="/">Login</Link>
      <Link to="/register">Register</Link>
      <Link to="/forgot-password">Forgot Password</Link>
      <Link to="/game">Game</Link>
    </Container>
  );
};

const Link = styled(RouterLink)``;

const Container = styled.div`
  padding: 10px;
  border: 2px solid black;
  display: flex;
  justify-content: space-around;
`;

export default NavigationHeader;
