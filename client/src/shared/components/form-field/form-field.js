import styled from "styled-components";

const FormField = ({ children, className, error, ...rest }) => {
  return (
    <div {...rest} className={`nes-field ${className}`}>
      {children}
      {error && <ErrorLabel className="nes-text is-error">{error}</ErrorLabel>}
    </div>
  );
};

const ErrorLabel = styled.span`
  font-size: 12px;
`;

export default FormField;
