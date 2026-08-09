import styled, { css } from 'styled-components';
import Tooltip from '../Tooltip';

interface ContainerProps {
  isFocused: boolean;
  isFilled: boolean;
  maxWidth?: string;
  margin?: boolean;
  erroMsg: boolean;
}

export const Container = styled.div<ContainerProps>`
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid ${(props) => (props.isFocused ? '#ff9000' : 'rgba(11, 11, 11, 0.15)')};
  padding: 16px;
  width: ${(props) => (props.maxWidth ? props.maxWidth : '100%')};
  color: #62748d;
  transition: border-color 120ms ease;

  display: flex;
  align-items: center;

  input {
    width: 100%;
    border: 0;
    background: transparent;
    color: #0c1729;

    ::-webkit-calendar-picker-indicator {
      filter: invert(100%);
    }

    :-webkit-autofill {
      -webkit-box-shadow: 0 0 0 30px #ffffff inset;
    }

    /* Cor do texto do autocomplete */
    :-webkit-autofill {
      -webkit-text-fill-color: #0c1729 !important;
    }
    ::placeholder {
      color: #7c91af;
    }
  }

  ${(props) =>
    props.margin &&
    css`
      & + div {
        margin-top: 8px;
      }
    `}

  ${(props) =>
    props.erroMsg &&
    css`
      border-color: #c53030;
    `}

  ${(props) =>
    props.isFocused &&
    css`
      color: #ff9f43;
      border-color: #ff9f43;
      box-shadow: 0 0 0 4px rgba(255, 159, 67, 0.12);
    `}

  ${(props) =>
    props.isFilled &&
    css`
      color: #ff9f43;
    `}


  svg {
    margin-right: 16px;
  }
`;

export const Error = styled(Tooltip)`
  height: 20px;
  margin-left: 16px;

  svg {
    margin: 0%;
  }

  span {
    background: #c53030;
    color: #fff;

    &::before {
      border-color: #c53030 transparent;
    }
  }
`;
