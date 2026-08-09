import styled, { css } from 'styled-components';

export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

export const MetricCard = styled.div`
  padding: 22px 24px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid rgba(11, 11, 11, 0.06);
  color: #0b0b0b;
  min-height: 154px;

  strong {
    display: block;
    margin-top: 8px;
    font-size: 2rem;
    letter-spacing: -0.05em;
  }

  span {
    display: block;
    margin-top: 8px;
    color: #62748d;
  }
`;

export const MetricEyebrow = styled.span`
  display: inline-block;
  color: #ff9000;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
  gap: 24px;
  margin-top: 24px;

  @media (max-width: 1040px) {
    grid-template-columns: 1fr;
  }
`;

export const MainColumn = styled.div`
  display: grid;
  gap: 24px;
`;

export const SideColumn = styled.div`
  display: grid;
  gap: 24px;
  align-content: start;
`;

export const Panel = styled.section`
  padding: 28px;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(12, 23, 41, 0.08);
  box-shadow: 0 20px 60px rgba(7, 17, 31, 0.12);
`;

export const PanelTitle = styled.h2`
  color: #0c1729;
  font-size: 1.55rem;
  letter-spacing: -0.04em;
`;

export const PanelText = styled.p`
  margin-top: 8px;
  color: #62748d;
  line-height: 1.7;
`;

export const FiltersRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 22px;
`;

export const FilterChip = styled.button<{ selected?: boolean }>`
  padding: 12px 18px;
  border-radius: 999px;
  border: 1px solid rgba(12, 23, 41, 0.08);
  background: #f4f7fb;
  color: #0c1729;
  font-weight: 700;

  ${(props) =>
    props.selected &&
    css`
      background: linear-gradient(135deg, #ff9f43 0%, #ff7a18 100%);
      color: #fff;
      box-shadow: 0 16px 30px rgba(255, 159, 67, 0.24);
      border-color: transparent;
    `}
`;

export const BookingToolbar = styled.div`
  min-width: 320px;

  @media (max-width: 900px) {
    width: 100%;
    min-width: 100%;
  }
`;

export const SelectField = styled.select`
  width: 100%;
  min-height: 56px;
  padding: 0 18px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.08);
  color: #f8fbff;
  font-weight: 700;

  option {
    color: #0c1729;
  }
`;

export const InsightGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 22px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const InsightCard = styled.article`
  padding: 18px 20px;
  border-radius: 24px;
  background: #f7fafe;
  border: 1px solid rgba(12, 23, 41, 0.08);

  > div {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #62748d;
    font-weight: 700;
  }

  strong {
    display: block;
    margin-top: 14px;
    color: #0c1729;
    font-size: 1.5rem;
    letter-spacing: -0.04em;
  }

  p {
    margin-top: 10px;
    color: #62748d;
    line-height: 1.6;
  }
`;

export const InsightList = styled.div`
  display: grid;
  gap: 12px;
  margin-top: 20px;
`;

export const InsightListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 18px;
  border-radius: 20px;
  background: #f7fafe;
  border: 1px solid rgba(12, 23, 41, 0.08);

  > div {
    display: grid;
    gap: 4px;
  }

  strong {
    color: #0c1729;
    font-size: 0.98rem;
  }

  span {
    color: #62748d;
    font-size: 0.88rem;
  }
`;

export const InlineValue = styled.span`
  color: #0c1729;
  font-size: 1.05rem;
  font-weight: 800;
`;

export const ExecutiveGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 22px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const ExecutiveCard = styled.article`
  padding: 20px 22px;
  border-radius: 26px;
  background: linear-gradient(180deg, #f7fafe 0%, #eef4fb 100%);
  border: 1px solid rgba(12, 23, 41, 0.08);

  > div:first-child {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #62748d;
    font-weight: 700;
  }

  strong {
    display: block;
    margin-top: 14px;
    color: #0c1729;
    font-size: 1.9rem;
    letter-spacing: -0.05em;
  }

  p {
    margin-top: 8px;
    color: #62748d;
    line-height: 1.6;
  }
`;

export const DataHighlights = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-top: 20px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const DataHighlight = styled.div`
  padding: 16px 18px;
  border-radius: 20px;
  background: #ffffff;
  border: 1px solid rgba(12, 23, 41, 0.08);

  span {
    display: block;
    color: #62748d;
    font-size: 0.82rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  strong {
    display: block;
    margin-top: 10px;
    color: #0c1729;
    font-size: 1.25rem;
    letter-spacing: -0.04em;
  }
`;

export const FinanceStrip = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-top: 22px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const FinancePill = styled.div<{ tone?: 'positive' | 'negative' | 'neutral' }>`
  padding: 18px 20px;
  border-radius: 22px;
  border: 1px solid rgba(12, 23, 41, 0.08);
  background: ${(props) =>
    props.tone === 'positive'
      ? 'rgba(18, 166, 123, 0.1)'
      : props.tone === 'negative'
      ? 'rgba(252, 56, 76, 0.08)'
      : '#f7fafe'};

  span {
    display: block;
    color: #62748d;
    font-size: 0.84rem;
    font-weight: 700;
  }

  strong {
    display: block;
    margin-top: 10px;
    color: #0c1729;
    font-size: 1.25rem;
    letter-spacing: -0.04em;
  }
`;

export const PriorityList = styled.div`
  display: grid;
  gap: 12px;
  margin-top: 22px;
`;

export const PriorityCard = styled.article`
  display: grid;
  gap: 8px;
  padding: 18px 20px;
  border-radius: 22px;
  background: #f7fafe;
  border: 1px solid rgba(12, 23, 41, 0.08);

  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  strong {
    color: #0c1729;
    font-size: 1rem;
  }

  p {
    color: #62748d;
    line-height: 1.6;
  }
`;

export const ToneBadge = styled.span<{ tone?: 'warning' | 'danger' | 'success' | 'info' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 88px;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: ${(props) =>
    props.tone === 'danger'
      ? 'rgba(252, 56, 76, 0.12)'
      : props.tone === 'success'
      ? 'rgba(18, 166, 123, 0.12)'
      : props.tone === 'warning'
      ? 'rgba(255, 179, 71, 0.18)'
      : 'rgba(38, 112, 255, 0.12)'};
  color: ${(props) =>
    props.tone === 'danger'
      ? '#d5384b'
      : props.tone === 'success'
      ? '#127a60'
      : props.tone === 'warning'
      ? '#9a6200'
      : '#2457d6'};
`;

export const ServiceSection = styled.section`
  padding: 28px;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(12, 23, 41, 0.08);
  box-shadow: 0 20px 60px rgba(7, 17, 31, 0.12);
`;

export const ServiceList = styled.div`
  display: grid;
  gap: 18px;
  margin-top: 22px;
`;

export const ServiceCard = styled.article`
  padding: 22px;
  border-radius: 26px;
  background: #f4f7fb;
  border: 1px solid rgba(12, 23, 41, 0.08);

  > div:first-child {
    display: flex;
    justify-content: space-between;
    gap: 16px;
  }

  h3 {
    color: #0c1729;
    font-size: 1.16rem;
    letter-spacing: -0.03em;
  }

  p {
    margin-top: 6px;
    color: #62748d;
    line-height: 1.7;
  }

  > div:first-child > button {
    width: 40px;
    min-width: 40px;
    height: 40px;
    border: 0;
    border-radius: 14px;
    background: rgba(211, 79, 79, 0.12);
    color: #d34f4f;
  }
`;

export const ServiceMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;

  span {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border-radius: 999px;
    background: #ffffff;
    color: #62748d;
    font-weight: 700;
  }
`;

export const ParticipantList = styled.ul`
  list-style: none;
  display: grid;
  gap: 10px;
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid rgba(12, 23, 41, 0.08);

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  li > div {
    display: flex;
    align-items: center;
    color: #0c1729;
  }

  li > button {
    width: 34px;
    height: 34px;
    border-radius: 12px;
    border: 0;
    background: rgba(211, 79, 79, 0.12);
    color: #d34f4f;
  }
`;

export const ServiceActions = styled.div`
  max-width: 260px;
  margin-top: 10px;
`;

export const CalendarPanel = styled(Panel)`
  .DayPicker {
    margin-top: 18px;
    width: 100%;
  }

  .DayPicker-wrapper {
    outline: none;
  }

  .DayPicker-Month {
    width: 100%;
    margin: 0;
  }

  .DayPicker-Caption {
    color: #0c1729;
    margin-bottom: 12px;
  }

  .DayPicker-Weekday {
    color: #62748d;
    font-size: 0.78rem;
  }

  .DayPicker-Day {
    border-radius: 14px;
    color: #0c1729;
  }

  .DayPicker-Day--selected:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside) {
    background: linear-gradient(135deg, #ff9f43 0%, #ff7a18 100%);
    color: #fff;
  }

  .DayPicker-Day--available {
    box-shadow: inset 0 0 0 1px rgba(15, 169, 127, 0.2);
    color: #0f7e61;
  }
`;

export const HighlightCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 20px;
  padding: 18px 20px;
  border-radius: 22px;
  background: #f4f7fb;

  span {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #62748d;
  }

  strong {
    display: block;
    margin-top: 3px;
    color: #0c1729;
    font-size: 1.05rem;
  }
`;

export const AlertCard = styled.section`
  padding: 24px;
  border-radius: 28px;
  background: linear-gradient(
    135deg,
    rgba(255, 159, 67, 0.14),
    rgba(255, 122, 24, 0.1)
  );
  border: 1px solid rgba(255, 159, 67, 0.22);
  color: #0c1729;

  > div {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #9b5a1d;
    font-weight: 700;
  }

  strong {
    display: block;
    margin-top: 14px;
    font-size: 1.2rem;
    letter-spacing: -0.03em;
  }

  p {
    margin-top: 10px;
    color: #5e4630;
    line-height: 1.7;
  }
`;

export const QuickActions = styled.div`
  display: grid;
  gap: 14px;
  margin-top: 20px;
`;

export const QuickActionCard = styled.button`
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 18px 20px;
  border: 1px solid rgba(12, 23, 41, 0.08);
  border-radius: 22px;
  background: #f7fafe;
  text-align: left;

  > svg {
    min-width: 20px;
    min-height: 20px;
    color: #ff8e28;
  }

  strong {
    display: block;
    color: #0c1729;
    font-size: 1rem;
  }

  span {
    display: block;
    margin-top: 4px;
    color: #62748d;
    line-height: 1.5;
  }
`;

export const StatusPill = styled.span<{ expired?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 86px;
  padding: 8px 12px;
  border-radius: 999px;
  background: ${(props) =>
    props.expired ? 'rgba(252, 56, 76, 0.12)' : 'rgba(255, 179, 71, 0.18)'};
  color: ${(props) => (props.expired ? '#d5384b' : '#9a6200')};
  font-size: 0.84rem;
  font-weight: 700;
`;

export const EmptyState = styled.div`
  padding: 26px 22px;
  border-radius: 24px;
  background: #ffffff;
  color: #62748d;
  text-align: center;
`;
