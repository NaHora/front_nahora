import styled from 'styled-components';
import { shade, lighten, darken } from 'polished';
import TinyColor from 'tinycolor2';

interface PageColor {
  primaryColor: string;
  secondaryColor: string;
  disabled?: boolean;
  currentSelected?: boolean;
}

export const SelectDefault = styled.select`
  width: 180px;
  background: #232129;
  border: none;
  color: white;
  padding: 16px;
  font-size: 16px;
  border: 2px solid #232129;
  border-radius: 10px;

  :focus {
    outline: none;
  }
`;

export const Container = styled.div<PageColor>`
  background: ${(props) =>
    TinyColor(props.primaryColor).isLight()
      ? darken(0.05, props.primaryColor)
      : lighten(0.03, props.primaryColor)};
  min-height: 100vh;
  width: 100%;
  display: flex;
  color: ${(props) =>
    TinyColor(props.primaryColor).isLight() ? '#000' : '#f4ede8'};
  flex-direction: column;

  > div {
    max-width: 1120px;
    align-self: center;
    width: 100%;
    padding: 10px;

    > main {
      margin: 24px 0;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;

      @media (max-width: 600px) {
        grid-template-columns: 1fr;
      }
      > label {
        display: flex;
        margin: 8px 0 0;
        flex-direction: column;
        @media (max-width: 600px) {
          width: 100%;

          > div {
            width: 100%;
          }
        }
      }
    }
  }
`;
