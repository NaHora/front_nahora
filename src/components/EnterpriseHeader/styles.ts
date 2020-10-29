import styled from 'styled-components';
import TinyColor from 'tinycolor2';

interface PageColor {
  primaryColor: string;
  secondaryColor: string;
  disabled?: boolean;
  currentSelected?: boolean;
}

export const Header = styled.header<PageColor>`
  padding: 15px 20px;
  height: 144px;
  background: ${(props) => props.primaryColor};

  display: flex;
  align-items: center;

  div {
    max-width: 1120px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;

    > span {
      font-size: 40px;
      font-weight: bold;
      color: ${(props) =>
        TinyColor(props.primaryColor).isLight() ? '#3e3b47' : '#f4ede8'};

      @media (max-width: 600px) {
        display: none;
      }
    }

    > img {
      width: 100px;
      height: 100px;
      border-radius: 50px;
      border: 2px solid ${(props) => props.secondaryColor};
    }

    button {
      background: transparent;
      border: none;
      > a {
        > svg {
          color: ${(props) =>
            TinyColor(props.primaryColor).isLight() ? '#3e3b47' : '#f4ede8'};
          width: 24px;
          height: 24px;
        }
      }
    }

    > svg {
      color: ${(props) =>
        TinyColor(props.primaryColor).isLight() ? '#3e3b47' : '#f4ede8'};
      width: 24px;
      height: 24px;
    }
  }
`;
