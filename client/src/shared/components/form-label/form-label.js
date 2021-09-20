import styled from "styled-components";

const FormLabel = ({ children, className, ...rest }) => {
  return (
    <Styled {...rest} className={`W${className}`}>
      {children}
    </Styled>
  );
};

const Styled = styled.label``;

export default FormLabel;
