import styled from 'styled-components';

interface PageColor {
  currentPage: boolean;
}

export const Container = styled.div`
  position: relative;
`;

export const TriggerButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 54px;
  padding: 10px 14px;
  border: 1px solid rgba(158, 179, 209, 0.14);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.05);
  color: #f8fbff;

  @media (max-width: 700px) {
    padding: 10px 12px;
  }
`;

export const TriggerText = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  line-height: 1.1;

  span {
    color: #8ea5c5;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  strong {
    margin-top: 4px;
    color: #f8fbff;
    font-size: 0.92rem;
  }

  @media (max-width: 700px) {
    display: none;
  }
`;

export const MenuOverlay = styled.button`
  position: fixed;
  inset: 0;
  border: 0;
  background: rgba(7, 17, 31, 0.52);
  backdrop-filter: blur(4px);
  z-index: 20;
`;

export const Panel = styled.aside`
  width: min(640px, calc(100vw - 32px));
  background: linear-gradient(180deg, #08101e 0%, #101d34 100%);
  position: fixed;
  top: 16px;
  right: 16px;
  bottom: 16px;
  border-radius: 32px;
  padding: 22px;
  display: flex;
  z-index: 21;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(158, 179, 209, 0.14);
  box-shadow: 0 30px 80px rgba(7, 17, 31, 0.32);

  @media (max-width: 640px) {
    width: calc(100vw - 12px);
    top: 6px;
    right: 6px;
    bottom: 6px;
    padding: 18px;
    border-radius: 24px;
  }
`;

export const PanelHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 8px 6px 22px;
  border-bottom: 1px solid rgba(158, 179, 209, 0.12);

  span {
    display: block;
    color: #8ea5c5;
    font-size: 0.74rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  strong {
    display: block;
    margin-top: 6px;
    color: #f8fbff;
    font-size: 1.4rem;
    letter-spacing: -0.04em;
  }
`;

export const PanelBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 8px 6px 8px 2px;

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(158, 179, 209, 0.3);
    border-radius: 999px;
  }
`;

export const CloseButton = styled.button`
  width: 42px;
  height: 42px;
  border-radius: 14px;
  border: 1px solid rgba(158, 179, 209, 0.16);
  background: rgba(255, 255, 255, 0.05);
  color: #f8fbff;
`;

export const MenuSection = styled.div`
  margin-top: 28px;

  > span {
    display: block;
    margin-bottom: 12px;
    color: #8ea5c5;
    font-size: 0.74rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
`;

export const MenuItem = styled.button<PageColor>`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px 18px;
  margin-top: 10px;
  border-radius: 18px;
  border: 1px solid
    ${(props) =>
      props.currentPage ? 'rgba(255, 159, 67, 0.48)' : 'rgba(158, 179, 209, 0.1)'};
  background: ${(props) =>
    props.currentPage ? 'rgba(255, 159, 67, 0.16)' : 'rgba(255, 255, 255, 0.04)'};
  color: ${(props) => (props.currentPage ? '#f8fbff' : '#d8e3f1')};
  text-align: left;
  transition: transform 0.2s, border-color 0.2s, background 0.2s;
  white-space: normal;

  &:hover {
    transform: translateX(-2px);
    border-color: rgba(255, 159, 67, 0.4);
  }

  svg {
    min-width: 18px;
    min-height: 18px;
    margin-top: 2px;
    color: ${(props) => (props.currentPage ? '#ff9f43' : '#9eb3d1')};
  }
`;

export const MenuItemText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  flex: 1;

  strong {
    color: #f8fbff;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.2;
  }

  span {
    color: #8ea5c5;
    font-size: 0.86rem;
    line-height: 1.45;
    white-space: normal;
  }
`;
