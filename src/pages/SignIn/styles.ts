import styled, { keyframes } from 'styled-components';

const appearFromRight = keyframes`
  from {
    opacity: 0;
    transform: translate3d(28px, 0, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

export const Container = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  background:
    radial-gradient(circle at top left, rgba(255, 159, 67, 0.22), transparent 30%),
    radial-gradient(circle at bottom right, rgba(48, 86, 211, 0.25), transparent 34%),
    linear-gradient(135deg, #06101e 0%, #0f1f3b 52%, #091423 100%);

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

export const Background = styled.section`
  padding: 56px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 960px) {
    padding: 32px 24px 10px;
  }
`;

export const Brand = styled.div`
  max-width: 620px;

  img {
    width: 150px;
    object-fit: contain;
  }

  span {
    display: inline-flex;
    margin-top: 32px;
    padding: 8px 14px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #9eb3d1;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  h1 {
    margin-top: 22px;
    color: #f8fbff;
    font-size: clamp(2.8rem, 6vw, 5rem);
    line-height: 0.92;
    letter-spacing: -0.05em;
  }

  p {
    max-width: 560px;
    margin-top: 20px;
    color: #b8c7db;
    font-size: 1.04rem;
    line-height: 1.8;
  }
`;

export const FeatureList = styled.ul`
  list-style: none;
  max-width: 620px;
  display: grid;
  gap: 16px;

  li {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 20px 22px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.09);
    backdrop-filter: blur(12px);
  }

  svg {
    min-width: 20px;
    min-height: 20px;
    margin-top: 2px;
    color: #ff9f43;
  }

  strong {
    color: #f8fbff;
    font-size: 1rem;
  }

  span {
    display: block;
    margin-top: 4px;
    color: #b8c7db;
    line-height: 1.6;
  }

  @media (max-width: 960px) {
    margin-top: 24px;
  }
`;

export const Content = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
`;

export const AnimationContainer = styled.div`
  width: 100%;
  max-width: 480px;
  animation: ${appearFromRight} 0.8s ease;
`;

export const FormCard = styled.div`
  padding: 34px;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.11);
  box-shadow: 0 24px 60px rgba(7, 17, 31, 0.3);
  backdrop-filter: blur(22px);

  > span {
    color: #9eb3d1;
    font-size: 0.74rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  h2 {
    margin-top: 14px;
    color: #f8fbff;
    font-size: 2rem;
    letter-spacing: -0.04em;
  }

  > p {
    margin-top: 10px;
    color: #b8c7db;
    line-height: 1.7;
  }

  form {
    margin-top: 26px;
  }
`;

export const FooterLinks = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 18px;

  a {
    color: #f8fbff;
    text-decoration: none;
    opacity: 0.88;
  }

  @media (max-width: 520px) {
    flex-direction: column;
  }
`;
