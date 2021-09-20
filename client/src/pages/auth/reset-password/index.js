import { useState } from "react";
import styled from "styled-components";
import { apiCall } from "shared/api";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Card, Button, Input, FormField, FormLabel } from "shared/components";

const ResetPasswordContainer = () => {
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
      url: "http://localhost:4000/reset-password",
      method: "POST",
      data: {
        ...data,
        token: document.location.href.split("token=")[1],
      },
    });

    if (res.status === 500) {
      setError(res.error);
    } else if (res.status === 200) {
      setSuccess(true);
      setTimeout(() => {
        history.push("/");
      }, 1500);
    }
  };
  return (
    <Container>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField error={errors?.email?.message}>
            <FormLabel>Email</FormLabel>
            <Input {...register("email", { required: "Email is required" })} />
          </FormField>
          <FormField error={errors?.password?.message}>
            <FormLabel>Password</FormLabel>
            <Input
              {...register("password", { required: "Password is required" })}
            />
          </FormField>
          <FormField error={errors?.verifyPassword?.message}>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              {...register("verifyPassword", {
                required: "Password is required",
              })}
            />
          </FormField>

          <ActionContainer>
            {error && (
              <ErrorLabel className="nes-text is-error">{error}</ErrorLabel>
            )}
            {success && (
              <ErrorLabel className="nes-text is-success">
                Password has been updated!
              </ErrorLabel>
            )}
            <Button type="submit">Update Password</Button>
          </ActionContainer>
        </form>
      </Card>
    </Container>
  );
};

const ErrorLabel = styled.span`
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

export default ResetPasswordContainer;
