import styled, { css } from 'styled-components';

export const HeroAction = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  border: 0;
  border-radius: 18px;
  background: linear-gradient(135deg, #ff9f43 0%, #ff7a18 100%);
  color: #fff;
  font-weight: 700;
  box-shadow: 0 20px 35px rgba(255, 159, 67, 0.26);
`;

export const Metrics = styled.section`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const MetricCard = styled.article`
  padding: 22px 24px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #f8fbff;

  strong {
    display: block;
    font-size: 2.15rem;
    letter-spacing: -0.05em;
  }

  span {
    display: block;
    margin-top: 8px;
    color: #b8c7db;
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

export const FullWidth = styled.section`
  margin-top: 24px;
`;

export const SectionCard = styled.section`
  padding: 28px;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(12, 23, 41, 0.08);
  box-shadow: 0 20px 60px rgba(7, 17, 31, 0.12);
`;

export const SectionHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const SectionTitleWrap = styled.div`
  h2 {
    color: #0c1729;
    font-size: 1.55rem;
    letter-spacing: -0.04em;
  }

  p {
    margin-top: 8px;
    color: #62748d;
    line-height: 1.7;
  }
`;

export const HeaderAction = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 0;
  border-radius: 16px;
  padding: 12px 16px;
  background: #edf3fb;
  color: #0c1729;
  font-weight: 700;
`;

export const FiltersRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 240px;
  gap: 14px;
  margin-top: 22px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const FormPanel = styled.div`
  display: grid;
  gap: 12px;
  margin-top: 18px;
  padding: 20px;
  border-radius: 24px;
  background: linear-gradient(180deg, #f8fbff 0%, #eef4fb 100%);
  border: 1px solid rgba(12, 23, 41, 0.08);
`;

export const InlineGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const Label = styled.label`
  display: grid;
  gap: 8px;
  color: #62748d;
  font-size: 0.88rem;
  font-weight: 700;
`;

export const NativeSelect = styled.select`
  min-height: 56px;
  padding: 0 16px;
  border-radius: 18px;
  border: 1px solid rgba(12, 23, 41, 0.08);
  background: #ffffff;
  color: #0c1729;
  box-shadow: 0 18px 40px rgba(7, 17, 31, 0.08);
`;

export const NativeInput = styled.input`
  min-height: 56px;
  padding: 0 16px;
  border-radius: 18px;
  border: 1px solid rgba(12, 23, 41, 0.08);
  background: #ffffff;
  color: #0c1729;
  box-shadow: 0 18px 40px rgba(7, 17, 31, 0.08);
`;

export const CustomersList = styled.div`
  display: grid;
  gap: 18px;
  margin-top: 20px;
`;

export const CustomerCard = styled.article<{ status?: number }>`
  padding: 22px;
  border-radius: 28px;
  background: linear-gradient(180deg, #f7fafe 0%, #f1f5fb 100%);
  border: 1px solid rgba(12, 23, 41, 0.08);
  border-left: 6px solid
    ${(props) =>
      props.status === undefined
        ? '#dce5f2'
        : props.status < 0
        ? '#fc384c'
        : props.status < 7
        ? '#ffb347'
        : '#12a67b'};
`;

export const CustomerTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 780px) {
    flex-direction: column;
  }
`;

export const CustomerIdentity = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;

  h3 {
    color: #0c1729;
    font-size: 1.12rem;
    letter-spacing: -0.03em;
  }

  p {
    margin-top: 4px;
    color: #62748d;
  }
`;

export const CustomerActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;

  @media (max-width: 780px) {
    justify-content: flex-start;
  }
`;

export const ActionIconButton = styled.button<{ variant?: 'danger' | 'success' }>`
  width: 42px;
  min-width: 42px;
  height: 42px;
  border: 0;
  border-radius: 14px;
  background: ${(props) =>
    props.variant === 'danger'
      ? 'rgba(252, 56, 76, 0.12)'
      : props.variant === 'success'
      ? 'rgba(30, 198, 87, 0.12)'
      : 'rgba(12, 23, 41, 0.08)'};
  color: ${(props) =>
    props.variant === 'danger'
      ? '#fc384c'
      : props.variant === 'success'
      ? '#12a67b'
      : '#0c1729'};
  box-shadow: 0 10px 24px rgba(7, 17, 31, 0.08);
`;

export const CustomerMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 18px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const MetaBox = styled.div`
  padding: 16px 18px;
  border-radius: 20px;
  background: #ffffff;
  border: 1px solid rgba(12, 23, 41, 0.08);

  span {
    display: block;
    color: #62748d;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  strong,
  a {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
    color: #0c1729;
    text-decoration: none;
    font-size: 0.96rem;
  }
`;

export const PlanControls = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 10px;
  min-width: min(100%, 420px);

  @media (max-width: 760px) {
    grid-template-columns: 1fr auto auto;
    min-width: 100%;
  }
`;

export const DetailLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  border: 0;
  background: transparent;
  color: #ff8e28;
  font-weight: 700;
`;

export const SolicitationCard = styled.article`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  margin-top: 16px;
  border-radius: 22px;
  background: linear-gradient(180deg, #f7fafe 0%, #f1f5fb 100%);
  border: 1px solid rgba(12, 23, 41, 0.08);

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const SolicitationIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  strong {
    color: #0c1729;
  }
`;

export const SmallMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
`;

export const SmallMetaPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 999px;
  background: #ffffff;
  border: 1px solid rgba(12, 23, 41, 0.08);
  color: #62748d;
  font-size: 0.86rem;
  font-weight: 700;
`;

export const TableWrap = styled.div`
  margin-top: 20px;
  overflow-x: auto;
  border-radius: 24px;
  border: 1px solid rgba(12, 23, 41, 0.08);
  background: #fff;
`;

export const PlansTable = styled.table`
  width: 100%;
  min-width: 820px;
  border-collapse: collapse;
  background: #ffffff;

  th,
  td {
    padding: 16px 14px;
    border-bottom: 1px solid rgba(12, 23, 41, 0.08);
    text-align: left;
  }

  th {
    color: #62748d;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    background: #f8fbff;
  }

  td {
    color: #0c1729;
  }
`;

export const RestrictList = styled.div`
  display: grid;
  gap: 14px;
  margin-top: 18px;
`;

export const RestrictCard = styled.article`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  border-radius: 22px;
  background: linear-gradient(180deg, #f7fafe 0%, #f1f5fb 100%);
  border: 1px solid rgba(12, 23, 41, 0.08);
`;

export const RestrictInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #0c1729;
  font-weight: 700;
  flex-wrap: wrap;

  span {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
`;

export const EmptyState = styled.div`
  margin-top: 18px;
  padding: 24px 20px;
  border-radius: 24px;
  background: #f4f7fb;
  color: #62748d;
  text-align: center;
  line-height: 1.7;
`;

export const StatusBadge = styled.span<{ tone: 'expired' | 'warning' | 'active' | 'none' }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 700;

  ${(props) =>
    props.tone === 'expired' &&
    css`
      background: rgba(252, 56, 76, 0.1);
      color: #d5384b;
    `}

  ${(props) =>
    props.tone === 'warning' &&
    css`
      background: rgba(255, 179, 71, 0.18);
      color: #9a6200;
    `}

  ${(props) =>
    props.tone === 'active' &&
    css`
      background: rgba(18, 166, 123, 0.12);
      color: #0b8a66;
    `}

  ${(props) =>
    props.tone === 'none' &&
    css`
      background: rgba(12, 23, 41, 0.08);
      color: #62748d;
    `}
`;
