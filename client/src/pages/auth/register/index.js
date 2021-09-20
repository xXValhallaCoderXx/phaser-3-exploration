import { useState } from "react";
import styled from "styled-components";
import { apiCall } from "shared/api";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Card, Button, Input, FormField, FormLabel } from "shared/components";

const SignInContainer = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const history = useHistory();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const onSubmit = async (data) => {
    const res = await apiCall({
      url: "http://localhost:4000/signup",
      method: "POST",
      data,
    });

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
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField error={errors?.username?.message}>
            <FormLabel>Username</FormLabel>
            <Input
              {...register("username", { required: "Username is required" })}
            />
          </FormField>
          <div style={{ height: 20 }} />
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
            {error && (
              <FeedbackLabel className="nes-text is-error">
                {error}
              </FeedbackLabel>
            )}
            {success && (
              <FeedbackLabel className="nes-text is-success">
                Sign Successful!!
              </FeedbackLabel>
            )}
            <Button type="submit">Register</Button>
          </ActionContainer>
        </form>
      </Card>
    </Container>
  );
};

const FeedbackLabel = styled.span`
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

export default SignInContainer;
