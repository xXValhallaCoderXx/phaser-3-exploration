import styled from "styled-components";
import { Card, Button, Input, FormField, FormLabel } from "shared/components";

const SignInContainer = () => {
  const onClick = () => {};
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

export default SignInContainer;
