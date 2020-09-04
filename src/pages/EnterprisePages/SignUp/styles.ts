import styled, { keyframes } from 'styled-components';

import { shade } from 'polished';
import signUpBackgroundImg from '../../../assets/teste1.png';

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  > header {
    height: 80px;
    background: #28262e;
    display: flex;
    align-items: center;

    button {
      margin-left: auto;
      background: transparent;
      border: 0;
    }
    div {
      width: 100%;
      max-width: 1120px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      svg {
        color: #999591;
        width: 24px;
        height: 24px;
      }

      @media (max-width: 600px) {
        padding: 15px;
        width: 100%;
      }
    }
  }
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

export const Background = styled.div`
  flex: 1;
  background: url(${signUpBackgroundImg}) no-repeat center;
  background-size: cover;
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

export const AnimationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  animation: ${appearFromRight} 1s;

  @media (max-width: 600px) {
    padding: 20px 0;
    img {
      margin: 550px 0 0;
    }
  }
  form {
    margin: 80px 0;
    width: 340px;
    text-align: center;
    @media (max-width: 600px) {
      width: 100%;
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
