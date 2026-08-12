import styled, { css } from 'styled-components';

export const HeroAction = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  border: 0;
  border-radius: 10px;
  background: #ff9000;
  color: #0b0b0b;
  font-weight: 600;
  cursor: pointer;
  transition: filter 120ms ease;

  &:hover {
    filter: brightness(0.96);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const Metrics = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const MetricCard = styled.article`
  padding: 22px 24px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid rgba(11, 11, 11, 0.06);
  color: #0b0b0b;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 148px;

  strong {
    font-size: 2.1rem;
    letter-spacing: -0.05em;
    line-height: 1;
  }

  span {
    color: #62748d;
    font-size: 0.9rem;
    line-height: 1.4;
  }
`;

export const MetricEyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #ff9000;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const Layout = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(320px, 0.85fr);
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
  padding: 28px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid rgba(11, 11, 11, 0.06);
  color: #0b0b0b;

  @media (max-width: 620px) {
    padding: 22px;
  }
`;

export const PanelHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 620px) {
    flex-direction: column;
  }
`;

export const PanelTitleWrap = styled.div`
  h2 {
    color: #0c1729;
    font-size: 1.35rem;
    letter-spacing: -0.03em;
  }

  p {
    margin-top: 6px;
    color: #62748d;
    line-height: 1.55;
    font-size: 0.92rem;
  }
`;

export const HeaderLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid rgba(11, 11, 11, 0.1);
  border-radius: 10px;
  padding: 10px 14px;
  background: #ffffff;
  color: #0b0b0b;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: border-color 120ms ease;

  &:hover {
    border-color: #ff9000;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const SearchRow = styled.div`
  margin-top: 22px;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 12px;
`;

export const FilterChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
`;

export const FilterChip = styled.button<{ active?: boolean }>`
  padding: 8px 14px;
  border-radius: 10px;
  border: 1px solid rgba(11, 11, 11, 0.1);
  background: #ffffff;
  color: #62748d;
  font-weight: 600;
  font-size: 0.82rem;
  cursor: pointer;
  transition: background 120ms ease, color 120ms ease, border-color 120ms ease;

  ${({ active }) =>
    active &&
    css`
      background: #ff9000;
      color: #0b0b0b;
      border-color: #ff9000;
    `}
`;

export const ClientList = styled.div`
  margin-top: 20px;
  display: grid;
  gap: 14px;
`;

export const ClientCard = styled.article`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 14px;
  align-items: center;
  padding: 16px;
  border-radius: 10px;
  background: #f6f6fa;
  border: 1px solid rgba(11, 11, 11, 0.06);

  @media (max-width: 720px) {
    grid-template-columns: auto minmax(0, 1fr);
  }
`;

export const ClientInfo = styled.div`
  min-width: 0;
  display: grid;
  gap: 6px;

  h3 {
    color: #0c1729;
    font-size: 1rem;
    letter-spacing: -0.01em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const ClientMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const MetaPill = styled.span<{ tone?: 'accent' | 'muted' | 'warn' | 'danger' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 0.74rem;
  font-weight: 700;

  ${({ tone }) =>
    tone === 'accent' &&
    css`
      background: #ff9000;
      color: #0b0b0b;
      border: 1px solid #ff9000;
    `}

  ${({ tone }) =>
    tone === 'warn' &&
    css`
      background: #fff4e0;
      color: #7a5a2f;
      border: 1px solid rgba(255, 144, 0, 0.28);
    `}

  ${({ tone }) =>
    tone === 'danger' &&
    css`
      background: #fdecec;
      color: #a4212a;
      border: 1px solid rgba(213, 76, 70, 0.32);
    `}

  ${({ tone }) =>
    (!tone || tone === 'muted') &&
    css`
      background: #ffffff;
      color: #0b0b0b;
      border: 1px solid rgba(11, 11, 11, 0.08);
    `}

  svg {
    width: 12px;
    height: 12px;
  }
`;

export const ClientActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  @media (max-width: 720px) {
    grid-column: 1 / -1;
    justify-content: flex-end;
    margin-top: 6px;
  }
`;

export const IconButton = styled.button<{ variant?: 'success' | 'danger' | 'neutral' }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 120ms ease, background 120ms ease, border-color 120ms ease;
  text-decoration: none;

  &:hover {
    transform: translateY(-1px);
  }

  svg {
    width: 16px;
    height: 16px;
  }

  ${({ variant }) =>
    variant === 'success' &&
    css`
      background: #ff9000;
      color: #0b0b0b;
      border-color: #ff9000;
      &:hover {
        filter: brightness(0.96);
      }
    `}

  ${({ variant }) =>
    variant === 'danger' &&
    css`
      background: #ffffff;
      color: #d54c46;
      border-color: rgba(213, 76, 70, 0.3);
      &:hover {
        background: #fdecec;
      }
    `}

  ${({ variant }) =>
    (!variant || variant === 'neutral') &&
    css`
      background: #ffffff;
      color: #0b0b0b;
      border-color: rgba(11, 11, 11, 0.1);
      &:hover {
        border-color: #ff9000;
      }
    `}
`;

export const ClientBottom = styled.div`
  grid-column: 1 / -1;
  margin-top: 10px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const PlanControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 720px) {
    flex-wrap: wrap;
  }
`;

export const NativeSelect = styled.select`
  flex: 1;
  min-width: 160px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid rgba(11, 11, 11, 0.15);
  background: #ffffff;
  color: #0b0b0b;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  height: 44px;

  &:focus {
    outline: none;
    border-color: #ff9000;
  }

  @media (max-width: 620px) {
    min-width: 0;
    width: 100%;
  }
`;

export const DetailLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 0;
  background: transparent;
  color: #ff9000;
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const EmptyState = styled.div`
  margin-top: 22px;
  padding: 22px;
  border-radius: 10px;
  background: #f6f6fa;
  border: 1px dashed rgba(11, 11, 11, 0.12);
  color: #62748d;
  text-align: center;
  font-size: 0.9rem;
`;

export const InviteForm = styled.div`
  display: grid;
  gap: 12px;
  margin-top: 22px;
  padding: 20px;
  border-radius: 10px;
  background: #f6f6fa;
  border: 1px solid rgba(11, 11, 11, 0.06);
`;

export const InviteGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const SolicitationList = styled.div`
  margin-top: 22px;
  display: grid;
  gap: 12px;
`;

export const SolicitationCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  background: #f6f6fa;
  border: 1px solid rgba(11, 11, 11, 0.06);
`;

export const SolicitationInfo = styled.div`
  flex: 1;
  min-width: 0;

  strong {
    display: block;
    color: #0c1729;
    font-size: 0.98rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  span {
    display: block;
    color: #62748d;
    font-size: 0.8rem;
  }
`;

export const AlertCard = styled.div`
  margin-top: 22px;
  padding: 18px;
  border-radius: 10px;
  background: #fff4e0;
  border: 1px solid rgba(255, 144, 0, 0.28);
  color: #0b0b0b;

  strong {
    display: block;
    font-size: 1.5rem;
    letter-spacing: -0.03em;
    color: #0b0b0b;
  }

  span {
    display: block;
    margin-top: 6px;
    color: #7a5a2f;
    font-size: 0.9rem;
    line-height: 1.4;
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
    margin-top: -8px;
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
  transition: filter 120ms ease, border-color 120ms ease;
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

export const ModalDateInput = styled.input`
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
