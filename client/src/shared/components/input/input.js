import { forwardRef } from "react";
import styled from "styled-components";

const InputContainer = forwardRef(
  ({ variant, children, className, ...rest }, ref) => {
    const VARIANT = {
      success: "is-success",
      warning: "is-warning",
      error: "is-error",
    };

    return (
      <Styled
        ref={ref}
        {...rest}
        className={`nes-input ${VARIANT[variant] ?? ""} ${className}`}
      >
        {children}
      </Styled>
    );
  }
);

const Styled = styled.input``;

export default InputContainer;
