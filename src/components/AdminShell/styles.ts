import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  background: #f6f6fa;
  overflow-x: hidden;
`;

export const Hero = styled.section`
  padding: 32px 24px 12px;

  @media (max-width: 620px) {
    padding: 20px 16px 8px;
  }
`;

export const HeroContent = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;

  > div:first-child {
    min-width: 0;
    flex: 1;
  }

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
`;

export const Eyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 8px 14px;
  border-radius: 10px;
  background: rgba(255, 144, 0, 0.12);
  border: 1px solid rgba(255, 144, 0, 0.2);
  color: #ff9000;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

export const Title = styled.h1`
  margin-top: 14px;
  color: #0b0b0b;
  font-size: clamp(1.6rem, 4vw, 3.2rem);
  line-height: 1.05;
  letter-spacing: -0.04em;
  max-width: 22ch;
  overflow-wrap: anywhere;
`;

export const Description = styled.p`
  max-width: 680px;
  margin-top: 12px;
  color: #62748d;
  font-size: 1rem;
  line-height: 1.55;

  @media (max-width: 620px) {
    font-size: 0.92rem;
  }
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 900px) {
    width: 100%;
  }

  @media (max-width: 620px) {
    > button,
    > a {
      width: 100%;
      justify-content: center;
    }
  }
`;

export const WorkspaceNav = styled.nav`
  max-width: 1180px;
  margin: 20px auto 0;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 8px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 620px) {
    margin-top: 14px;
  }
`;

export const WorkspaceTab = styled.button<{ active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  border: 1px solid
    ${(props) => (props.active ? '#ff9000' : 'rgba(11, 11, 11, 0.08)')};
  border-radius: 10px;
  padding: 10px 14px;
  min-height: 42px;
  background: ${(props) => (props.active ? '#ff9000' : '#ffffff')};
  color: ${(props) => (props.active ? '#0b0b0b' : '#62748d')};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
  flex-shrink: 0;

  &:hover {
    transform: translateY(-1px);
    border-color: #ff9000;
  }

  @media (max-width: 620px) {
    padding: 10px 12px;
    font-size: 0.85rem;
  }
`;

export const Main = styled.main`
  max-width: 1180px;
  margin: 0 auto;
  padding: 20px 24px 48px;
  min-width: 0;

  @media (max-width: 620px) {
    padding: 16px 12px 40px;
  }
`;
