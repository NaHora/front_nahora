import styled, { keyframes } from 'styled-components';
import GoogleLogin from 'react-google-login';

import { shade } from 'polished';
import signUpBackgroundImg from '../../assets/teste.svg';
import Button from '../../components/Button';

export const Container = styled.div`
  min-height: 100vh;

  display: flex;
  align-items: stretch;
`;

export const Background = styled.div`
  flex: 1;
  background: url(${signUpBackgroundImg}) no-repeat center;
  background-size: contain;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  max-width: 700px;
`;

const appearFromRight = keyframes`
  from{
    opacity:0;
    transform: translateX(50px)
  }
  to{
    opacity:1;
    transform: translateX(0)
  }
`;

export const SelectDefault = styled.select`
  width: 100%;
  background: #232129;
  border: none;
  color: white;
  padding: 16px;
  font-size: 16px;
  border: 2px solid #232129;
  border-radius: 10px;
  margin: 8px 0;

  :focus {
    outline: none;
  }
`;

export const AnimationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  animation: ${appearFromRight} 1s;

  @media (max-width: 600px) {
    padding: 10px 10px 50px;
    width: 100%;
  }

  form {
    > span {
      width: 100%;
      margin-top: 16px;
      > button {
        display: flex;
        padding: 16px;
        justify-content: flex-start;

        border-radius: 10px !important;
        width: 100%;
        > span {
          svg {
            margin-right: 18px;
          }
          text-transform: none;
          font-family: Roboto, sans-serif !important;
          font-size: 16px !important;
          font-weight: bold !important;
        }
      }
    }
    margin: 10px 0 10px;
    width: 340px;
    text-align: center;
    @media (max-width: 600px) {
      width: 100%;
      margin: 0;
    }
    img {
      width: 300px;
    }

    h1 {
      margin-bottom: 24px;
    }

    a {
      color: #f4ede8;
      display: block;
      margin-top: 24px;
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: ${shade(0.2, '#f4ede8')};
      }
    }
  }
  > a {
    color: #ff9000;
    display: block;
    margin-top: 24px;
    text-decoration: none;
    transition: color 0.2s;

    display: flex;
    align-items: center;

    svg {
      margin-right: 16px;
    }

    &:hover {
      color: ${shade(0.2, '#ff9000')};
    }
  }
`;

export const GoogleLoginStyled = styled(GoogleLogin)`
  width: 100%;
  border-radius: 10px !important;
  margin-bottom: 8px;
  > span {
    padding: 0 16px !important;
    display: flex;
    align-items: center;
    svg {
      margin-right: 8px;
    }
    > span {
      margin-left: 10px;
      font-size: 16px;
      font-weight: bold;
    }
  }
  height: 56px;
  > div {
    display: none;
  }
`;

export const ButtonStyled = styled(Button)`
  margin-bottom: 16px;
  justify-content: flex-start;
  color: #312e38;
  span {
    margin-left: 10px;
    font-weight: bold;
  }
`;
