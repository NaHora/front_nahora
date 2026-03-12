import styled, { css } from 'styled-components';
import Tooltip from '../Tooltip';

interface ContainerProps {
  isFocused: boolean;
  isFilled: boolean;
  erroMsg: boolean;
}

export const Container = styled.div<ContainerProps>`
  background: rgba(255, 255, 255, 0.04);
  border-radius: 18px;
  border: 1px solid rgba(158, 179, 209, 0.18);
  padding: 16px;
  width: 100%;
  color: #8ea5c5;
  backdrop-filter: blur(14px);

  display: flex;
  align-items: center;

  input {
    flex: 1;
    border: 0;
    background: transparent;
    width: 100%;
    color: #f8fbff;

    ::-webkit-calendar-picker-indicator {
      filter: invert(100%);
    }

    :-webkit-autofill {
      -webkit-box-shadow: 0 0 0 30px #17243b inset;
    }

    /* Cor do texto do autocomplete */
    :-webkit-autofill {
      -webkit-text-fill-color: white !important;
    }

    ::placeholder {
      color: #7c91af;
    }
  }

  & + div {
    margin-top: 8px;
  }
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
      box-shadow: 0 0 0 4px rgba(255, 159, 67, 0.16);
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
