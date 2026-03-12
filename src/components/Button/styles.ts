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
  min-height: 56px;
  border-radius: 18px;
  border: ${(props) =>
    props.transparent ? `1px solid ${props.secondaryColor}` : 0};
  padding: 14px 22px;
  width: 100%;
  color: ${(props) =>
    props.transparent
      ? props.secondaryColor
      : TinyColor(props.secondaryColor).isLight()
      ? '#000'
      : '#fff'};
  font-size: 0.96rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin-top: 16px;
  transition:
    background-color 0.2s,
    transform 0.2s,
    box-shadow 0.2s,
    border-color 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  box-shadow: ${(props) =>
    props.transparent ? 'none' : '0 18px 35px rgba(255, 159, 67, 0.24)'};

  svg {
    margin-right: 0;
  }

  &:hover {
    background: ${(props) =>
      !props.disabled &&
      shade(0.2, props.secondaryColor ? props.secondaryColor : '#ff9000')};
    color: ${(props) =>
      props.transparent
        ? props.primaryColor
        : TinyColor(props.secondaryColor).isLight()
        ? '#000'
        : '#fff'};
    transform: ${(props) => !props.disabled && 'translateY(-1px)'};
  }
`;
