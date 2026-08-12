import styled, { css } from 'styled-components';

export const HeroAction = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border: 1px solid rgba(11, 11, 11, 0.1);
  border-radius: 10px;
  background: #ffffff;
  color: #0b0b0b;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 120ms ease;

  &:hover {
    border-color: #ff9000;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const Layout = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(320px, 1.35fr);
  gap: 24px;
  margin-top: 24px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

export const Column = styled.div`
  display: grid;
  gap: 24px;
  align-content: start;
`;

export const Panel = styled.section`
  padding: 24px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid rgba(11, 11, 11, 0.06);
  color: #0b0b0b;

  @media (max-width: 620px) {
    padding: 20px;
  }
`;

export const PanelHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;

  @media (max-width: 620px) {
    flex-direction: column;
  }
`;

export const PanelTitleWrap = styled.div`
  h2 {
    color: #0b0b0b;
    font-size: 1.2rem;
    letter-spacing: -0.02em;
  }

  p {
    margin-top: 4px;
    color: #62748d;
    font-size: 0.88rem;
    line-height: 1.5;
  }
`;

export const ProfilePanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid rgba(11, 11, 11, 0.06);

  h2 {
    color: #0b0b0b;
    font-size: 1.25rem;
    letter-spacing: -0.02em;
    text-align: center;
  }
`;

export const ProfileMetaGrid = styled.div`
  display: grid;
  gap: 10px;
  width: 100%;
  margin-top: 8px;
`;

export const ProfileMetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #f6f6fa;
  border: 1px solid rgba(11, 11, 11, 0.06);
  color: #0b0b0b;
  font-size: 0.88rem;
  overflow: hidden;

  svg {
    color: #ff9000;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
  }

  span,
  a {
    color: #0b0b0b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

export const CountsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  width: 100%;
  margin-top: 12px;
`;

export const CountsCard = styled.div`
  padding: 14px;
  border-radius: 10px;
  background: #f6f6fa;
  border: 1px solid rgba(11, 11, 11, 0.06);
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: center;

  strong {
    font-size: 1.4rem;
    color: #0b0b0b;
    letter-spacing: -0.02em;
  }

  span {
    color: #62748d;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 700;
  }
`;

export const PlanBadge = styled.div<{ tone?: 'active' | 'warn' | 'danger' | 'none' }>`
  padding: 14px 16px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid;

  ${({ tone }) =>
    tone === 'active' &&
    css`
      background: rgba(15, 169, 127, 0.1);
      border-color: rgba(15, 169, 127, 0.28);
      color: #0b7259;
    `}

  ${({ tone }) =>
    tone === 'warn' &&
    css`
      background: #fff4e0;
      border-color: rgba(255, 144, 0, 0.28);
      color: #7a4d00;
    `}

  ${({ tone }) =>
    tone === 'danger' &&
    css`
      background: #fdecec;
      border-color: rgba(213, 76, 70, 0.3);
      color: #a4212a;
    `}

  ${({ tone }) =>
    (!tone || tone === 'none') &&
    css`
      background: #f6f6fa;
      border-color: rgba(11, 11, 11, 0.08);
      color: #62748d;
    `}

  svg {
    flex-shrink: 0;
    width: 18px;
    height: 18px;
  }

  strong {
    display: block;
    font-size: 0.98rem;
  }

  span {
    display: block;
    font-size: 0.82rem;
    opacity: 0.85;
  }
`;

export const PlanBadgeInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const FormPanel = styled.div`
  display: grid;
  gap: 14px;
  margin-top: 20px;
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;

  > span {
    color: #62748d;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
`;

export const InlineGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const Input = styled.input`
  height: 46px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid rgba(11, 11, 11, 0.15);
  background: #ffffff;
  color: #0b0b0b;
  font-size: 0.95rem;
  transition: border-color 120ms ease;

  &:focus {
    outline: none;
    border-color: #ff9000;
  }
`;

export const ChipRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const Chip = styled.button<{ active?: boolean }>`
  padding: 8px 14px;
  border-radius: 10px;
  border: 1px solid
    ${({ active }) => (active ? '#ff9000' : 'rgba(11, 11, 11, 0.1)')};
  background: ${({ active }) => (active ? '#ff9000' : '#ffffff')};
  color: ${({ active }) => (active ? '#0b0b0b' : '#62748d')};
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 120ms ease, color 120ms ease, border-color 120ms ease;

  &:hover {
    border-color: #ff9000;
  }
`;

export const PrimaryButton = styled.button`
  align-self: flex-start;
  padding: 12px 20px;
  border: 0;
  border-radius: 10px;
  background: #ff9000;
  color: #0b0b0b;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: filter 120ms ease;

  &:hover:not(:disabled) {
    filter: brightness(0.96);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const EmptyState = styled.div`
  margin-top: 20px;
  padding: 22px;
  border-radius: 10px;
  background: #f6f6fa;
  border: 1px dashed rgba(11, 11, 11, 0.12);
  color: #62748d;
  text-align: center;
  font-size: 0.9rem;
`;

export const AppointmentList = styled.ul`
  list-style: none;
  display: grid;
  gap: 10px;
  margin-top: 20px;
`;

export const AppointmentRow = styled.li`
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) auto;
  gap: 14px;
  align-items: center;
  padding: 12px 14px;
  border-radius: 10px;
  background: #f6f6fa;
  border: 1px solid rgba(11, 11, 11, 0.06);
`;

export const AppointmentBadge = styled.div<{ tone?: 'future' | 'past' }>`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${({ tone }) =>
    tone === 'future'
      ? 'rgba(255, 144, 0, 0.14)'
      : 'rgba(11, 11, 11, 0.06)'};
  color: ${({ tone }) => (tone === 'future' ? '#ff9000' : '#62748d')};

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const AppointmentInfo = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    color: #0b0b0b;
    font-size: 0.98rem;
  }

  span {
    color: #62748d;
    font-size: 0.82rem;
  }
`;

export const ModalOverlay = styled.button`
  position: fixed;
  inset: 0;
  border: 0;
  background: rgba(11, 11, 11, 0.4);
  backdrop-filter: blur(2px);
  z-index: 40;
  cursor: pointer;
`;

export const ModalCard = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(420px, calc(100vw - 32px));
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 30px 60px rgba(7, 17, 31, 0.28);
  z-index: 41;
  display: flex;
  flex-direction: column;
  gap: 16px;

  h3 {
    color: #0b0b0b;
    font-size: 1.15rem;
    letter-spacing: -0.02em;
  }

  p {
    color: #62748d;
    font-size: 0.9rem;
    line-height: 1.55;
  }
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;

  @media (max-width: 620px) {
    flex-direction: column-reverse;
  }
`;

export const ModalButton = styled.button<{ variant?: 'primary' | 'ghost' }>`
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  min-height: 42px;

  ${({ variant }) =>
    variant === 'primary'
      ? css`
          background: #ff9000;
          color: #0b0b0b;
          border: 0;
          &:hover:not(:disabled) {
            filter: brightness(0.96);
          }
          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        `
      : css`
          background: #ffffff;
          color: #0b0b0b;
          border: 1px solid rgba(11, 11, 11, 0.15);
          &:hover {
            border-color: #ff9000;
          }
        `}
`;
