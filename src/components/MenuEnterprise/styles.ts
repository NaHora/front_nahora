import styled from 'styled-components';
import { lighten, darken } from 'polished';
import TinyColor from 'tinycolor2';

interface ContainerColor {
  primaryColor: string;
  secondaryColor: string;
  disabled?: boolean;
  currentPage?: boolean;
  currentSelected?: boolean;
}

export const Container = styled.header<ContainerColor>`
  width: 400px;
  background: ${(props) =>
    TinyColor(props.primaryColor).isLight()
      ? darken(0.1, props.primaryColor)
      : lighten(0.1, props.primaryColor)};
  cursor: default;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  box-shadow: 0px 3px 6px #000000;
  border-radius: 0px 5px 5px 0px;
  padding: 50px 30px;
  display: flex;
  z-index: 2;
  align-items: flex-start;
  flex-direction: column;
  overflow-y: scroll;
  color: ${(props) =>
    TinyColor(props.primaryColor).isLight() ? '#3e3b47' : '#f4ede8'};
  ::-webkit-scrollbar {
    display: none;
  }

  hr {
    width: 100%;
    border-color: ${(props) => props.secondaryColor};
    margin: 30px 0;
    border-style: solid;
  }

  > h2 {
    font-size: 26px;
    color: ${(props) => props.secondaryColor};
    margin: 40px 0 17px;
    font-weight: bold;
  }

  > div {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;

    > span {
      font-size: 14px;
      cursor: pointer;
      color: ${(props) => props.secondaryColor};
    }

    > svg {
      cursor: pointer;
      width: 56px;
    }
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;

export const Span = styled.span<ContainerColor>`
  font-size: 20px;
  margin: 17px 0;
  cursor: pointer;
  color: ${(props) =>
    props.currentPage
      ? props.secondaryColor
      : TinyColor(props.primaryColor).isLight()
      ? '#3e3b47'
      : '#f4ede8'};
`;
