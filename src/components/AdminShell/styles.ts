import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(255, 159, 67, 0.2), transparent 32%),
    radial-gradient(circle at top right, rgba(48, 86, 211, 0.18), transparent 28%),
    linear-gradient(180deg, #07111f 0%, #0b1628 42%, #f4f7fb 42%, #eef3f9 100%);
`;

export const Hero = styled.section`
  padding: 32px 24px 12px;
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
    align-items: flex-start;
  }
`;

export const Eyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #9eb3d1;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

export const Title = styled.h1`
  margin-top: 18px;
  color: #f8fbff;
  font-size: clamp(2rem, 4vw, 3.6rem);
  line-height: 0.96;
  letter-spacing: -0.04em;
  max-width: 16ch;
  overflow-wrap: anywhere;
`;

export const Description = styled.p`
  max-width: 680px;
  margin-top: 16px;
  color: #b8c7db;
  font-size: 1.02rem;
  line-height: 1.7;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 900px) {
    width: 100%;
  }
`;

export const WorkspaceNav = styled.nav`
  max-width: 1180px;
  margin: 20px auto 0;
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;

  @media (min-width: 761px) {
    &::-webkit-scrollbar {
      height: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.18);
      border-radius: 999px;
    }
  }
`;

export const WorkspaceTab = styled.button<{ active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
  border: 1px solid
    ${(props) =>
      props.active ? 'rgba(255, 159, 67, 0.3)' : 'rgba(255, 255, 255, 0.12)'};
  border-radius: 18px;
  padding: 12px 16px;
  background: ${(props) =>
    props.active
      ? 'linear-gradient(135deg, rgba(255, 159, 67, 0.22), rgba(255, 122, 24, 0.18))'
      : 'rgba(255, 255, 255, 0.06)'};
  color: ${(props) => (props.active ? '#ffffff' : '#b8c7db')};
  font-weight: 700;
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(255, 159, 67, 0.28);
  }
`;

export const Main = styled.main`
  max-width: 1180px;
  margin: 0 auto;
  padding: 20px 24px 48px;
  min-width: 0;
`;
