import styled from "styled-components";

export const StyledGameContainer = styled.div`
  overflow: hidden;

  position: relative;
  margin: 20px auto 0 auto;
  outline: 1px solid white;
  width: 352px;
  height: 208px;

  /*scale assets, push image down to compensate*/
  transform: scale(3) translateY(50%);

  > canvas {
    image-rendering: pixelated;
  }
`;
