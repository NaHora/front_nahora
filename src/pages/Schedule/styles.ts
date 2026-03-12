import styled, { css } from 'styled-components';

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const SummaryCard = styled.div`
  padding: 22px 24px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #f8fbff;

  strong {
    display: block;
    font-size: 2.2rem;
    letter-spacing: -0.05em;
  }

  span {
    display: block;
    margin-top: 8px;
    color: #b8c7db;
  }
`;

export const ScheduleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-top: 24px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const ScheduleSection = styled.section`
  padding: 28px;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(12, 23, 41, 0.08);
  box-shadow: 0 20px 60px rgba(7, 17, 31, 0.12);
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
`;

export const SectionTitle = styled.h2`
  color: #0c1729;
  font-size: 1.6rem;
  letter-spacing: -0.04em;
`;

export const SectionText = styled.p`
  margin-top: 8px;
  color: #62748d;
  line-height: 1.7;
`;

export const ScheduleCard = styled.article<{ past?: boolean }>`
  margin-top: 18px;
  padding: 22px;
  border-radius: 26px;
  background: #f4f7fb;
  border: 1px solid rgba(12, 23, 41, 0.08);

  ${(props) =>
    props.past &&
    css`
      opacity: 0.8;
    `}

  > div:first-child {
    display: grid;
    grid-template-columns: 88px 1fr;
    gap: 18px;

    > img {
      width: 88px;
      height: 88px;
      border-radius: 20px;
      object-fit: cover;
      background: #e9eef6;
    }
  }

  h3 {
    color: #0c1729;
    font-size: 1.14rem;
    letter-spacing: -0.03em;
  }
`;

export const ScheduleMeta = styled.div`
  display: grid;
  gap: 8px;
  margin-top: 14px;
  color: #62748d;

  span {
    display: flex;
    align-items: center;
    gap: 8px;
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
    color: #0c1729;
  }
`;

export const EmptyState = styled.div`
  margin-top: 18px;
  padding: 28px 22px;
  border-radius: 24px;
  background: #f4f7fb;
  color: #62748d;
  text-align: center;
`;

export const InlineAction = styled.div`
  max-width: 180px;
  margin-top: 6px;
`;
