import styled, { css } from 'styled-components';

export const Metrics = styled.section`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 620px) {
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
    font-size: 2rem;
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
  grid-template-columns: minmax(0, 1.4fr) minmax(320px, 0.86fr);
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
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(12, 23, 41, 0.08);
  box-shadow: 0 20px 60px rgba(7, 17, 31, 0.12);
`;

export const PanelHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 760px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const PanelTitleWrap = styled.div`
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

export const SoftAction = styled.button`
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

export const FormPanel = styled.div`
  display: grid;
  gap: 14px;
  margin-top: 20px;
  padding: 22px;
  border-radius: 24px;
  background: linear-gradient(180deg, #f8fbff 0%, #eef4fb 100%);
  border: 1px solid rgba(12, 23, 41, 0.08);
`;

export const InlineGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.label`
  display: grid;
  gap: 8px;
  color: #62748d;
  font-size: 0.88rem;
  font-weight: 700;
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

export const NativeSelect = styled.select`
  min-height: 56px;
  padding: 0 16px;
  border-radius: 18px;
  border: 1px solid rgba(12, 23, 41, 0.08);
  background: #ffffff;
  color: #0c1729;
  box-shadow: 0 18px 40px rgba(7, 17, 31, 0.08);
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

export const ChipRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 20px;
`;

export const Chip = styled.button<{ active?: boolean; danger?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 18px;
  border: 1px solid rgba(12, 23, 41, 0.08);
  background: #f4f7fb;
  color: #0c1729;
  font-weight: 700;

  ${(props) =>
    props.active &&
    css`
      background: linear-gradient(135deg, #ff9f43 0%, #ff7a18 100%);
      color: #fff;
      border-color: transparent;
      box-shadow: 0 16px 30px rgba(255, 159, 67, 0.24);
    `}

  ${(props) =>
    props.danger &&
    css`
      color: #d5384b;
      background: rgba(252, 56, 76, 0.08);
    `}
`;

export const List = styled.div`
  display: grid;
  gap: 14px;
  margin-top: 20px;
`;

export const ListCard = styled.article`
  padding: 18px 20px;
  border-radius: 22px;
  background: linear-gradient(180deg, #f7fafe 0%, #f1f5fb 100%);
  border: 1px solid rgba(12, 23, 41, 0.08);
`;

export const ListTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 760px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const ListTitle = styled.strong`
  color: #0c1729;
  font-size: 1rem;
`;

export const ListText = styled.p`
  margin-top: 6px;
  color: #62748d;
  line-height: 1.6;
`;

export const ActionRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
`;

export const IconButton = styled.button<{ variant?: 'danger' | 'success' }>`
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

export const TableWrap = styled.div`
  margin-top: 20px;
  overflow-x: auto;
  border-radius: 24px;
  border: 1px solid rgba(12, 23, 41, 0.08);
  background: #fff;
`;

export const DataTable = styled.table`
  width: 100%;
  min-width: 760px;
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
    vertical-align: middle;
  }
`;

export const StatusPill = styled.span<{
  tone?: 'default' | 'success' | 'warning' | 'danger';
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  background: ${(props) =>
    props.tone === 'success'
      ? 'rgba(18, 166, 123, 0.12)'
      : props.tone === 'warning'
      ? 'rgba(255, 179, 71, 0.18)'
      : props.tone === 'danger'
      ? 'rgba(252, 56, 76, 0.12)'
      : 'rgba(12, 23, 41, 0.08)'};
  color: ${(props) =>
    props.tone === 'success'
      ? '#0b8a66'
      : props.tone === 'warning'
      ? '#9a6200'
      : props.tone === 'danger'
      ? '#d5384b'
      : '#62748d'};
`;

export const ToggleRow = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 18px;
  border-radius: 20px;
  background: #ffffff;
  border: 1px solid rgba(12, 23, 41, 0.08);
  color: #0c1729;
  font-weight: 700;
`;

export const PreviewPhone = styled.div`
  width: min(320px, 100%);
  min-height: 560px;
  border-radius: 36px;
  padding: 18px;
  background: linear-gradient(180deg, #0f1729 0%, #09111f 100%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
`;

export const PreviewScreen = styled.div<{ primary: string; secondary: string }>`
  min-height: 100%;
  border-radius: 28px;
  overflow: hidden;
  background: ${(props) => props.primary};
`;

export const PreviewHeader = styled.div<{ secondary: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  color: #fff;

  img {
    width: 88px;
    height: 88px;
    border-radius: 24px;
    object-fit: cover;
    border: 2px solid ${(props) => props.secondary};
  }
`;

export const PreviewBody = styled.div<{ primary: string }>`
  min-height: 400px;
  background: rgba(255, 255, 255, 0.06);
  margin: 0 14px 14px;
  border-radius: 24px;
  padding: 20px;
  display: grid;
  align-content: center;
  gap: 14px;
`;

export const PreviewBadge = styled.div`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 10px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
  font-weight: 700;
`;
