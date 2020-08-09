import styled from 'styled-components';
import TinyColor from 'tinycolor2';
import { shade, lighten } from 'polished';

interface PageColor {
  primaryColor: string;
  secondaryColor: string;
  disabled?: boolean;
  currentSelected?: boolean;
}

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  > div {
    max-width: 1120px;
    width: 100%;
    display: flex;
    flex-direction: column;

    align-items: center;
    align-self: center;
    padding: 50px 0;
    button {
      width: 300px;
      align-self: center;
      margin: 50px 0;
    }
  }
`;

export const Form = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  > div {
    display: flex;
    width: 100%;
    justify-content: space-between;
    @media (max-width: 600px) {
      flex-direction: column-reverse;
      padding: 15px;
    }

    > div {
      display: flex;
      flex-direction: column;
      width: 100%;
      label {
        margin: 10px 0;
      }
      align-items: center;
    }
  }
`;

export const AvatarInput = styled.div`
  margin-bottom: 32px;
  position: relative;
  width: 156px;
  align-self: center;

  img {
    width: 156px;
    height: 156px;
    border-radius: 50%;
  }

  label {
    position: absolute;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    bottom: 0;
    right: 0;
    background: #ff9000;
    border: 0;
    transition: background-color 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    input {
      display: none;
    }

    svg {
      width: 20px;
      height: 20px;
    }

    &:hover {
      background: ${shade(0.2, '#ff9000')};
    }
  }
`;

export const Cel = styled.div`
  border-radius: 5px;
  max-width: 320px;
  width: 100%;
  height: 560px;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div<PageColor>`
  padding: 15px 20px;
  height: 144px;
  background: ${(props) => props.primaryColor};
  color: ${(props) =>
    TinyColor(props.primaryColor).isLight() ? '#000' : '#fff'};
  display: flex;
  justify-content: space-between;
  align-items: center;

  > img {
    width: 100px;
    height: 100px;
    border-radius: 50px;
    border: 2px solid ${(props) => props.secondaryColor};
  }
`;

export const Body = styled.div<PageColor>`
  padding: 15px 20px;
  flex: 1;
  background: ${(props) => lighten(0.03, props.primaryColor)};

  display: flex;
  align-items: center;
`;
