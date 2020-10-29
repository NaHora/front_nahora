import styled from 'styled-components';

interface PageColor {
  primaryColor: string;
  secondaryColor: string;
  disabled?: boolean;
  currentSelected?: boolean;
}
export const Container = styled.div<PageColor>`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: purple;

  > div {
    width: 50%;
    align-self: center;

    > textarea {
      width: 100%;
    }
  }

  > main {
    width: 50%;
    align-self: center;
  }
`;
