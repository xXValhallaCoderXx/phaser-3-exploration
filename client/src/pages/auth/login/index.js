import { useState } from "react";
import styled from "styled-components";
import { apiCall } from "shared/api";
import { useHistory, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Card, Button, Input, FormField, FormLabel } from "shared/components";

const SignInContainer = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    const res = await apiCall({
      url: "http://localhost:4000/login",
      method: "POST",
      data,
    });
    setLoading(false);
    if (res.status === 500) {
      setError(res.error);
    } else if (res.status === 200) {
      setSuccess(true);
      setTimeout(() => {
        history.push("/game");
      }, 1500);
    }
  };

  return (
    <Container>
      <MainTitle className="nes-text is-success">Crypto Quest</MainTitle>
      <FormTitle>Login</FormTitle>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField error={errors?.email?.message}>
            <FormLabel>Email</FormLabel>
            <Input {...register("email", { required: "Email is required" })} />
          </FormField>
          <div style={{ height: 20 }} />
          <FormField error={errors?.password?.message}>
            <FormLabel>Password</FormLabel>
            <Input
              {...register("password", { required: "Password is required" })}
            />
          </FormField>
          <ActionContainer>
            {loading && <Label className="nes-text is-success">Loading</Label>}
            {error && <Label className="nes-text is-error">{error}</Label>}
            {success && (
              <Label className="nes-text is-success">Login success!</Label>
            )}
            <Button type="submit">Sign In</Button>
          </ActionContainer>
        </form>
        <ForgotWrapper>
          <ForgotLabel>Trouble signing in?</ForgotLabel>
          <Link to="/auth/forgot-password">Forgot Password</Link>
        </ForgotWrapper>
      </Card>
      <SignupWrapper>
        <Label>Don't yet have an account?</Label>
        <StyledLink to="/auth/register">Sign up!</StyledLink>
      </SignupWrapper>
    </Container>
  );
};

const MainTitle = styled.h1`
  margin-bottom: 50px;
`;

const FormTitle = styled.h2`
  margin-bottom: 20px;
`;

const Label = styled.span`
  font-size: 12px;
  text-align: center;
  margin-bottom: 10px;
`;

const ActionContainer = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Container = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const SignupWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const ForgotWrapper = styled.div`
  margin-top: 10px;
  font-size: 8px;
  display: flex;
  flex-direction: row;
`;

const StyledLink = styled(Link)`
  font-size: 12px;
`;

const ForgotLabel = styled.div`
  margin-right: 5px;
`;

export default SignInContainer;
