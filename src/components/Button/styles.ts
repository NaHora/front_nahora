import styled from 'styled-components';
import { shade } from 'polished';
import TinyColor from 'tinycolor2';

interface PageColor {
  primaryColor: string;
  secondaryColor: string;
}

export const Container = styled.button<PageColor>`
  background: ${(props) =>
    props.secondaryColor ? props.secondaryColor : '#ff9000'};
  height: 56px;
  border-radius: 10px;
  border: 0;
  padding: 0 16px;
  width: 100%;
  color: ${(props) =>
    TinyColor(props.secondaryColor).isLight() ? '#3e3b47' : '#999591'};
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
  }
`;
