import styled from "styled-components";

const InputContainer = ({ variant, children, className, ...rest }) => {
  const VARIANT = {
    success: "is-success",
    warning: "is-warning",
    error: "is-error",
  };

  return (
    <Styled
      {...rest}
      className={`nes-input ${VARIANT[variant] ?? ""} ${className}`}
    >
      {children}
    </Styled>
  );
};

const Styled = styled.input``;

export default InputContainer;
