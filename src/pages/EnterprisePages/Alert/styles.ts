import styled, { css } from 'styled-components';

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
  min-height: 132px;

  strong {
    font-size: 1.9rem;
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

export const Grid = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.85fr);
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
    color: #0b0b0b;
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

export const FormPanel = styled.div`
  display: grid;
  gap: 14px;
  margin-top: 22px;
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;

  span {
    color: #62748d;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
`;

export const Input = styled.input`
  height: 48px;
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

  &::placeholder {
    color: #a0aec0;
  }
`;

export const Textarea = styled.textarea`
  padding: 14px;
  border-radius: 10px;
  border: 1px solid rgba(11, 11, 11, 0.15);
  background: #ffffff;
  color: #0b0b0b;
  font-size: 0.95rem;
  line-height: 1.55;
  resize: vertical;
  min-height: 140px;
  font-family: inherit;
  transition: border-color 120ms ease;

  &:focus {
    outline: none;
    border-color: #ff9000;
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

export const CharCount = styled.span<{ danger?: boolean }>`
  align-self: flex-end;
  font-size: 0.72rem;
  color: ${({ danger }) => (danger ? '#d54c46' : '#a0aec0')};
`;

export const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 4px;
  flex-wrap: wrap;
`;

export const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: 0;
  border-radius: 10px;
  background: #ff9000;
  color: #0b0b0b;
  font-weight: 600;
  cursor: pointer;
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

export const DangerButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  border: 1px solid rgba(213, 76, 70, 0.3);
  border-radius: 10px;
  background: #ffffff;
  color: #d54c46;
  font-weight: 600;
  cursor: pointer;
  transition: background 120ms ease;

  &:hover:not(:disabled) {
    background: #fdecec;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const ActiveCard = styled.div`
  margin-top: 22px;
  padding: 20px;
  border-radius: 10px;
  background: linear-gradient(180deg, #fff4e0 0%, #ffe4c0 100%);
  border: 1px solid rgba(255, 144, 0, 0.28);
  display: flex;
  flex-direction: column;
  gap: 8px;

  strong {
    color: #0b0b0b;
    font-size: 1.05rem;
  }

  p {
    color: #4a3512;
    line-height: 1.55;
    white-space: pre-wrap;
    font-size: 0.92rem;
  }
`;

export const StatusPill = styled.span<{ tone?: 'success' | 'muted' | 'draft' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  align-self: flex-start;
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;

  ${({ tone }) =>
    tone === 'success' &&
    css`
      background: rgba(15, 169, 127, 0.16);
      color: #0b7259;
    `}

  ${({ tone }) =>
    tone === 'draft' &&
    css`
      background: rgba(255, 144, 0, 0.16);
      color: #7a4d00;
    `}

  ${({ tone }) =>
    (!tone || tone === 'muted') &&
    css`
      background: #f6f6fa;
      color: #62748d;
      border: 1px solid rgba(11, 11, 11, 0.06);
    `}

  svg {
    width: 12px;
    height: 12px;
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

export const PreviewPhone = styled.div`
  width: min(320px, 100%);
  border-radius: 24px;
  padding: 12px;
  background: #0b0b0b;
  margin: 22px auto 0;
`;

export const PreviewScreen = styled.div<{ primary: string; secondary: string }>`
  min-height: 100%;
  border-radius: 22px;
  overflow: hidden;
  background: ${(props) => props.primary};
`;

export const PreviewHeader = styled.div<{ secondary: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px;
  color: #fff;

  img {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    object-fit: cover;
    border: 2px solid ${(props) => props.secondary};
  }
`;

export const PreviewBody = styled.div`
  background: rgba(255, 255, 255, 0.06);
  margin: 0 12px 12px;
  border-radius: 16px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 200px;
`;

export const PreviewToast = styled.div<{ secondary: string }>`
  padding: 14px 16px;
  border-radius: 10px;
  background: #ffffff;
  border-left: 4px solid ${(props) => props.secondary};
  color: #0b0b0b;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 6px;

  strong {
    font-size: 0.95rem;
  }

  p {
    color: #4a5568;
    font-size: 0.85rem;
    line-height: 1.5;
    white-space: pre-wrap;
  }
`;
