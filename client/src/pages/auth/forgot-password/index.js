import { useState } from "react";
import styled from "styled-components";
import { apiCall } from "shared/api";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Card, Button, Input, FormField, FormLabel } from "shared/components";

const ForgotPasswordContainer = () => {
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
      url: "http://localhost:4000/forgot-password",
      method: "POST",
      data,
    });
    console.log("WHAT IS: ", res);
    if (res.status === 500) {
      setError(res.error);
    } else if (res.status === 200) {
      setSuccess(true);
      // setTimeout(() => {
      //   history.push("/game");
      // }, 1500);
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

          <ActionContainer>
            {error && (
              <ErrorLabel className="nes-text is-error">{error}</ErrorLabel>
            )}
            {success && (
              <ErrorLabel className="nes-text is-success">
                Email has been submit!
              </ErrorLabel>
            )}
            <Button type="submit">Send Email!</Button>
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

export default ForgotPasswordContainer;
