import styled from "styled-components";

const FormField = ({ children, className, ...rest }) => {
  return (
    <Styled {...rest} className={`nes-field ${className}`}>
      {children}
    </Styled>
  );
};

const Styled = styled.div``;

export default FormField;
