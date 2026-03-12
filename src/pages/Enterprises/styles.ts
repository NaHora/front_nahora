import styled, { css } from 'styled-components';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 24px;
  margin-top: 24px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const Column = styled.div`
  display: grid;
  gap: 24px;
`;

export const Surface = styled.section`
  padding: 28px;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(12, 23, 41, 0.08);
  box-shadow: 0 20px 60px rgba(7, 17, 31, 0.12);
`;

export const SurfaceHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
`;

export const SectionTitle = styled.h2`
  color: #0c1729;
  font-size: 1.65rem;
  letter-spacing: -0.04em;
`;

export const SectionText = styled.p`
  margin-top: 8px;
  color: #62748d;
  line-height: 1.7;
`;

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

export const SearchRow = styled.div`
  margin-top: 24px;
`;

export const EnterpriseList = styled.div`
  display: grid;
  gap: 18px;
  margin-top: 22px;
`;

export const EnterpriseCard = styled.article<{ featured?: boolean }>`
  display: grid;
  grid-template-columns: 104px 1fr;
  gap: 18px;
  padding: 18px;
  border-radius: 26px;
  background: ${(props) => (props.featured ? '#f7fafe' : '#f4f7fb')};
  border: 1px solid rgba(12, 23, 41, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: ${(props) => (props.onClick ? 'pointer' : 'default')};

  &:hover {
    transform: ${(props) => props.onClick && 'translateY(-2px)'};
    box-shadow: ${(props) => props.onClick && '0 20px 45px rgba(7, 17, 31, 0.08)'};
  }

  > img {
    width: 104px;
    height: 104px;
    border-radius: 22px;
    object-fit: cover;
    background: #e9eef6;
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;

    > img {
      width: 100%;
      height: 180px;
    }
  }
`;

export const EnterpriseCardBody = styled.div`
  display: flex;
  flex-direction: column;

  > div:first-child {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  h3 {
    color: #0c1729;
    font-size: 1.2rem;
    letter-spacing: -0.03em;
  }
`;

export const EnterpriseMeta = styled.div`
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

export const StatusPill = styled.span<{ privateProfile: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 700;

  ${(props) =>
    props.privateProfile
      ? css`
          background: rgba(12, 23, 41, 0.08);
          color: #0c1729;
        `
      : css`
          background: rgba(15, 169, 127, 0.12);
          color: #0f7e61;
        `}
`;

export const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
  margin-top: 18px;
  padding: 13px 18px;
  border: 0;
  border-radius: 16px;
  background: linear-gradient(135deg, #ff9f43 0%, #ff7a18 100%);
  color: #fff;
  font-weight: 700;
  box-shadow: 0 16px 30px rgba(255, 159, 67, 0.24);
  cursor: pointer;

  &:disabled {
    background: #dfe6f0;
    color: #62748d;
    box-shadow: none;
    cursor: default;
  }
`;

export const EmptyState = styled.div`
  padding: 30px 22px;
  border-radius: 24px;
  background: #f4f7fb;
  color: #62748d;
  text-align: center;
  line-height: 1.7;
`;
