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
  gap: 10px;
  min-height: 44px;
  padding: 8px 14px;
  border: 1px solid rgba(11, 11, 11, 0.1);
  border-radius: 10px;
  background: #ffffff;
  color: #0b0b0b;
  cursor: pointer;
  transition: border-color 120ms ease;

  &:hover {
    border-color: #ff9000;
  }

  svg {
    color: #ff9000;
    width: 18px;
    height: 18px;
  }

  @media (max-width: 700px) {
    padding: 8px 12px;
    min-height: 40px;
  }
`;

export const TriggerText = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  line-height: 1.1;

  span {
    color: #62748d;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  strong {
    margin-top: 3px;
    color: #0b0b0b;
    font-size: 0.9rem;
  }

  @media (max-width: 700px) {
    display: none;
  }
`;

export const MenuOverlay = styled.button`
  position: fixed;
  inset: 0;
  border: 0;
  background: rgba(11, 11, 11, 0.35);
  backdrop-filter: blur(3px);
  z-index: 20;
  cursor: pointer;
`;

export const Panel = styled.aside`
  width: min(420px, calc(100vw - 32px));
  background: #ffffff;
  position: fixed;
  top: 16px;
  right: 16px;
  bottom: 16px;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  z-index: 21;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(11, 11, 11, 0.08);
  box-shadow: 0 30px 80px rgba(7, 17, 31, 0.25);

  @media (max-width: 640px) {
    width: calc(100vw - 12px);
    top: 6px;
    right: 6px;
    bottom: 6px;
    padding: 16px;
    border-radius: 16px;
  }
`;

export const PanelHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 4px 4px 18px;
  border-bottom: 1px solid rgba(11, 11, 11, 0.06);

  span {
    display: block;
    color: #62748d;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  strong {
    display: block;
    margin-top: 6px;
    color: #0b0b0b;
    font-size: 1.25rem;
    letter-spacing: -0.03em;
  }
`;

export const PanelBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 4px 4px 8px;
  scrollbar-width: thin;
  scrollbar-color: rgba(11, 11, 11, 0.2) transparent;

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(11, 11, 11, 0.2);
    border-radius: 999px;
  }
`;

export const CloseButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid rgba(11, 11, 11, 0.1);
  background: #ffffff;
  color: #0b0b0b;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: border-color 120ms ease;

  &:hover {
    border-color: #ff9000;
  }

  svg {
    width: 16px;
    height: 16px;
    color: #0b0b0b;
  }
`;

export const MenuSection = styled.div`
  margin-top: 20px;

  &:first-of-type {
    margin-top: 12px;
  }

  > span {
    display: block;
    margin-bottom: 8px;
    color: #62748d;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
`;

export const MenuItem = styled.button<PageColor>`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 14px;
  margin-top: 6px;
  border-radius: 10px;
  border: 1px solid
    ${(props) => (props.currentPage ? '#ff9000' : 'rgba(11, 11, 11, 0.08)')};
  background: ${(props) => (props.currentPage ? '#fff4e0' : '#ffffff')};
  color: #0b0b0b;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  white-space: normal;

  &:hover {
    border-color: #ff9000;
    background: ${(props) => (props.currentPage ? '#fff4e0' : '#faf7f1')};
  }

  svg {
    min-width: 18px;
    min-height: 18px;
    margin-top: 2px;
    color: #ff9000;
  }
`;

export const MenuItemText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
  flex: 1;

  strong {
    color: #0b0b0b;
    font-size: 0.95rem;
    font-weight: 700;
    line-height: 1.2;
  }

  span {
    color: #62748d;
    font-size: 0.82rem;
    line-height: 1.4;
    white-space: normal;
  }
`;
