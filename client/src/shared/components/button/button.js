import styled from "styled-components";

const ButtonContainer = ({ variant, children }) => {
  const VARIANT = {
    primary: "primary",
  };

  return (
    <Styled className={`nes-btn is-${VARIANT[variant] ?? "primary"}`}>
      {children}
    </Styled>
  );
};

const Styled = styled.button``;

export default ButtonContainer;
