import styled from "styled-components";

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1vw;
  margin-bottom: 2vw;
`;

export const NameInput = styled.input`
  font-size: 2vw;
  font-weight: 600;
  padding: 0.5vw;
  color: black;

  &::placeholder {
    color: gray;
    font-weight: 400;
  }
`;

export const SubmitButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const SubmitButton = styled.button`
  background-color: #fbbe01;
  color: #000;
  text-transform: uppercase;
  font-size: 2vw;
  font-weight: 600;
  border: 3px solid transparent;
  outline: none;
  cursor: pointer;
  transition: all 290ms ease-in-out;
  border-radius: 8px;
  padding: 0.6vw 1.2vw;

  &:hover {
    background-color: transparent;
    color: #fff;
    border: 3px solid #fbbe01;
  }
`;


export const ToggleModeButton = styled.button`
  margin-top: 1vw;
  font-size: 1.2vw;
  background: none;
  border: none;
  color: #0066cc;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: #004a99;
  }
`;
