import styled from "styled-components";

export const StyledContainer = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;

  overflow-x: hidden;
`;
export const StyledControls = styled.div`
  width: 80%;
  margin-top: 3rem;
  padding: 1rem;

  outline: 1px solid white;
  background-color: antiquewhite;
  > div {
    width: 100%;

    padding: 1rem;
    margin-bottom: 1rem;

    outline: 1px solid black;
  }
`;
export const StyledControl = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  > div {
    margin-top: 10px;
    margin-left: 20px;
  }
  > div > label {
    margin-right: 10px;
  }
  > div > input[type="range"] {
    padding: 5px;
  }
`;
export const StyledExport = styled.div`
  display: flex;
  gap: 15px;
  > button {
    padding: 5px;
    cursor: pointer;
  }
`;

export const StyledInfo = styled.div`
  margin: 1rem;
  min-height: 36px;
  text-align: center;
`;
export const StyledCanvases = styled.div`
  position: relative;
`;

export const StyledCanvas = styled.canvas`
  position: absolute;
  left: 50%;
  image-rendering: pixelated;

  transform: scale(3) translateX(-50%);
  transform-origin: top left;
  outline: 1px solid white;
`;
