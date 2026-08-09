import styled, { css } from 'styled-components';

export const PeriodBar = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid rgba(11, 11, 11, 0.06);
  align-items: end;
  margin-bottom: 24px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const PeriodField = styled.label`
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

export const PeriodInput = styled.input`
  height: 44px;
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

export const RefreshButton = styled.button`
  height: 44px;
  padding: 0 18px;
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

export const KpiCard = styled.article<{
  tone?: 'income' | 'outcome' | 'net' | 'muted';
}>`
  padding: 22px 24px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid
    ${({ tone }) =>
      tone === 'income'
        ? 'rgba(15, 169, 127, 0.28)'
        : tone === 'outcome'
        ? 'rgba(213, 76, 70, 0.28)'
        : tone === 'net'
        ? 'rgba(255, 144, 0, 0.28)'
        : 'rgba(11, 11, 11, 0.06)'};
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 138px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ tone }) =>
      tone === 'income'
        ? 'linear-gradient(180deg, rgba(15, 169, 127, 0.08), transparent 40%)'
        : tone === 'outcome'
        ? 'linear-gradient(180deg, rgba(213, 76, 70, 0.08), transparent 40%)'
        : tone === 'net'
        ? 'linear-gradient(180deg, rgba(255, 144, 0, 0.08), transparent 40%)'
        : 'transparent'};
    pointer-events: none;
  }

  strong {
    font-size: 1.75rem;
    letter-spacing: -0.04em;
    line-height: 1;
    color: ${({ tone }) =>
      tone === 'income'
        ? '#0b7259'
        : tone === 'outcome'
        ? '#a4212a'
        : '#0b0b0b'};
    position: relative;
  }

  span {
    color: #62748d;
    font-size: 0.9rem;
    line-height: 1.4;
    position: relative;
  }
`;

export const KpiEyebrow = styled.span<{
  tone?: 'income' | 'outcome' | 'net' | 'muted';
}>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  position: relative;
  color: ${({ tone }) =>
    tone === 'income'
      ? '#0fa97f'
      : tone === 'outcome'
      ? '#d54c46'
      : tone === 'net'
      ? '#ff9000'
      : '#62748d'};

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

export const FullWidth = styled.section`
  margin-top: 24px;
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
  height: 44px;
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

export const Select = styled.select`
  height: 44px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid rgba(11, 11, 11, 0.15);
  background: #ffffff;
  color: #0b0b0b;
  font-size: 0.95rem;
  cursor: pointer;
  transition: border-color 120ms ease;

  &:focus {
    outline: none;
    border-color: #ff9000;
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

export const TypeToggle = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

export const TypeButton = styled.button<{ active?: boolean; tone?: 'income' | 'outcome' }>`
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid
    ${({ active, tone }) =>
      !active
        ? 'rgba(11, 11, 11, 0.12)'
        : tone === 'income'
        ? 'rgba(15, 169, 127, 0.4)'
        : 'rgba(213, 76, 70, 0.4)'};
  background: ${({ active, tone }) =>
    !active
      ? '#ffffff'
      : tone === 'income'
      ? 'rgba(15, 169, 127, 0.12)'
      : 'rgba(213, 76, 70, 0.1)'};
  color: ${({ active, tone }) =>
    !active
      ? '#62748d'
      : tone === 'income'
      ? '#0b7259'
      : '#a4212a'};
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 120ms ease, border-color 120ms ease;

  svg {
    width: 15px;
    height: 15px;
  }
`;

export const PrimaryButton = styled.button`
  align-self: flex-end;
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
  margin-top: 22px;
  padding: 22px;
  border-radius: 10px;
  background: #f6f6fa;
  border: 1px dashed rgba(11, 11, 11, 0.12);
  color: #62748d;
  text-align: center;
  font-size: 0.9rem;
`;

export const TransactionList = styled.div`
  margin-top: 22px;
  display: grid;
  gap: 10px;
`;

export const TransactionRow = styled.article`
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) auto auto;
  gap: 14px;
  align-items: center;
  padding: 14px 16px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid rgba(11, 11, 11, 0.06);

  @media (max-width: 620px) {
    grid-template-columns: 40px minmax(0, 1fr);
  }
`;

export const TypeIcon = styled.div<{ tone: 'income' | 'outcome' }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${({ tone }) =>
    tone === 'income' ? 'rgba(15, 169, 127, 0.12)' : 'rgba(213, 76, 70, 0.1)'};
  color: ${({ tone }) => (tone === 'income' ? '#0fa97f' : '#d54c46')};

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const TransactionInfo = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    color: #0b0b0b;
    font-size: 0.98rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  span {
    color: #62748d;
    font-size: 0.82rem;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
  }
`;

export const CategoryChip = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 10px;
  background: #f6f6fa;
  border: 1px solid rgba(11, 11, 11, 0.06);
  color: #62748d;
  font-size: 0.72rem;
  font-weight: 600;
`;

export const Amount = styled.strong<{ tone: 'income' | 'outcome' }>`
  color: ${({ tone }) => (tone === 'income' ? '#0b7259' : '#a4212a')};
  font-size: 1rem;
  letter-spacing: -0.01em;
  white-space: nowrap;
  text-align: right;
`;

export const DeleteButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid rgba(213, 76, 70, 0.3);
  background: #ffffff;
  color: #d54c46;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 120ms ease;

  &:hover {
    background: #fdecec;
  }

  svg {
    width: 15px;
    height: 15px;
  }
`;

export const MobileMeta = styled.div`
  grid-column: 2 / -1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  @media (min-width: 621px) {
    display: none;
  }
`;

export const SearchRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 160px;
  gap: 12px;
  margin-top: 22px;

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

export const SortHint = styled.button<{ active?: boolean }>`
  align-self: flex-start;
  padding: 6px 10px;
  border-radius: 10px;
  border: 1px solid
    ${({ active }) => (active ? '#ff9000' : 'rgba(11, 11, 11, 0.1)')};
  background: ${({ active }) => (active ? '#fff4e0' : '#ffffff')};
  color: #0b0b0b;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  svg {
    width: 12px;
    height: 12px;
  }

  ${({ active }) =>
    active &&
    css`
      color: #7a4d00;
    `}
`;
