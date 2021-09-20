import styled from "styled-components";

const CardContainer = ({ variant, children, className, centered, ...rest }) => {
  // const VARIANT = {
  //   primary: "primary",
  // };
  const isCentered = centered ? "is-centered" : "";
  return (
    <Styled {...rest} className={`nes-container ${isCentered} ${className}`}>
      {children}
    </Styled>
  );
};

const Styled = styled.div``;

export default CardContainer;
