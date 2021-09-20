import axios from "axios";

import styled from "styled-components";
import { Card, Button, Input, FormField, FormLabel } from "shared/components";

const SignUpContainer = () => {
  const onClick = () => {
    const res = axios.post("http://localhost:4000/login", {
      hello: "stin",
    });
    console.log("RS: ", res);
  };
  return (
    <Container>
      <Card>
        <FormField>
          <FormLabel>Email</FormLabel>
          <Input />
        </FormField>

        <FormField>
          <FormLabel>Password</FormLabel>
          <Input />
        </FormField>

        <Button onCLick={onClick}>Sign In</Button>
      </Card>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export default SignUpContainer;
