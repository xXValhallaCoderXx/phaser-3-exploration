import styled from "styled-components";
import { Link as RouterLink, useLocation } from "react-router-dom";
const NavigationHeader = ({ isAuthenticated = false }) => {
  const location = useLocation();

  if (location.pathname.includes("auth")) {
    return null;
  }
  return (
    <Container>
      <Link to="/">Login</Link>

      {isAuthenticated && <Link to="/game">Game</Link>}
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
