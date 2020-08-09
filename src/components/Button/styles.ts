import styled from 'styled-components';
import { shade } from 'polished';
import TinyColor from 'tinycolor2';

interface PageColor {
  primaryColor: string;
  secondaryColor: string;
  transparent?: boolean;
}

export const Container = styled.button<PageColor>`
  background: ${(props) =>
    props.transparent
      ? 'transparent'
      : props.secondaryColor
      ? props.secondaryColor
      : '#ff9000'};
  height: 56px;
  border-radius: 10px;
  border: ${(props) =>
    props.transparent ? `1px solid ${props.secondaryColor}` : 0};
  padding: 0 16px;
  width: 100%;
  color: ${(props) =>
    props.transparent
      ? props.secondaryColor
      : TinyColor(props.secondaryColor).isLight()
      ? '#000'
      : '#fff'};
  font-weight: 500px;
  margin-top: 16px;
  transition: background-color 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    margin-right: 8px;
  }

  &:hover {
    background: ${(props) =>
      shade(0.2, props.secondaryColor ? props.secondaryColor : '#ff9000')};
    color: ${(props) =>
      props.transparent
        ? props.primaryColor
        : TinyColor(props.secondaryColor).isLight()
        ? '#000'
        : '#fff'};
  }
`;
