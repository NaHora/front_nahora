import styled from 'styled-components';

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

export const Grid = styled.section`
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
    align-items: flex-start;
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
  transition: border-color 120ms ease, background 120ms ease;

  &:hover {
    border-color: #ff9000;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const FinanceRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-top: 22px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const FinancePill = styled.div<{ tone?: 'income' | 'outcome' | 'total' }>`
  padding: 18px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid
    ${({ tone }) =>
      tone === 'income'
        ? 'rgba(15, 169, 127, 0.24)'
        : tone === 'outcome'
        ? 'rgba(213, 76, 70, 0.24)'
        : 'rgba(255, 144, 0, 0.28)'};
  background: ${({ tone }) =>
    tone === 'income'
      ? '#e9f9f0'
      : tone === 'outcome'
      ? '#fdecec'
      : '#fff4e0'};

  span {
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #62748d;
    font-weight: 700;
  }

  strong {
    font-size: 1.5rem;
    letter-spacing: -0.03em;
    color: #0b0b0b;
  }
`;

export const List = styled.ul`
  list-style: none;
  display: grid;
  gap: 12px;
  margin-top: 22px;
`;

export const ListItem = styled.li`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  border-radius: 10px;
  background: #f6f6fa;
  border: 1px solid rgba(11, 11, 11, 0.06);
`;

export const ListInfo = styled.div`
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
    font-size: 0.82rem;
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const ListBadge = styled.span<{ tone?: 'accent' | 'muted' }>`
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${({ tone }) => (tone === 'accent' ? '#ff9000' : '#f6f6fa')};
  color: ${({ tone }) => (tone === 'accent' ? '#0b0b0b' : '#0b0b0b')};
  border: 1px solid
    ${({ tone }) => (tone === 'accent' ? '#ff9000' : 'rgba(11, 11, 11, 0.08)')};
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

export const QuickActions = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 24px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const QuickActionCard = styled.button`
  padding: 20px;
  border-radius: 10px;
  border: 1px solid rgba(11, 11, 11, 0.08);
  background: #ffffff;
  color: #0b0b0b;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  cursor: pointer;
  transition: transform 120ms ease, border-color 120ms ease;
  text-align: left;

  &:hover {
    transform: translateY(-2px);
    border-color: #ff9000;
  }

  strong {
    font-size: 1rem;
  }

  span {
    color: #62748d;
    font-size: 0.82rem;
    line-height: 1.4;
  }

  svg {
    width: 20px;
    height: 20px;
    color: #ff9000;
  }
`;

export const AlertCard = styled.div`
  padding: 20px;
  border-radius: 10px;
  background: #fff4e0;
  border: 1px solid rgba(255, 144, 0, 0.28);
  display: flex;
  flex-direction: column;
  gap: 10px;

  strong {
    color: #0b0b0b;
    font-size: 1rem;
  }

  span {
    color: #7a5a2f;
    font-size: 0.88rem;
    line-height: 1.5;
  }
`;
