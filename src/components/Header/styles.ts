import styled from 'styled-components';

export const Header = styled.header`
  padding: 20px 24px 0;

  @media (max-width: 620px) {
    padding: 12px 12px 0;
  }
`;

export const HeaderContent = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid rgba(11, 11, 11, 0.08);

  @media (max-width: 900px) {
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 10px;
  }

  @media (max-width: 620px) {
    padding: 10px 12px;
  }
`;

export const Brand = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  background: transparent;
  border: 0;
  color: #0b0b0b;
  cursor: pointer;
  padding: 0;
  min-width: 0;
  flex-shrink: 1;

  img {
    width: 44px;
    height: 44px;
    object-fit: contain;
    flex-shrink: 0;
  }

  span {
    display: block;
    color: #62748d;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  strong {
    display: block;
    margin-top: 2px;
    font-size: 0.92rem;
    letter-spacing: -0.02em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 620px) {
    img {
      width: 40px;
      height: 40px;
    }
  }
`;

export const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 10px;
  background: #f6f6fa;
  border: 1px solid rgba(11, 11, 11, 0.06);
  margin-left: auto;
  min-width: 0;

  svg {
    color: #ff9000;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  @media (max-width: 900px) {
    margin-left: 0;
  }

  @media (max-width: 620px) {
    padding: 6px 10px;
    gap: 8px;
    max-width: 100%;
  }

  &.header-enterprise {
    @media (max-width: 620px) {
      display: none;
    }
  }
`;

export const ProfileText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  min-width: 0;

  span {
    color: #62748d;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  a {
    margin-top: 3px;
    color: #0b0b0b;
    font-weight: 700;
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 120px;
    display: inline-block;
  }

  @media (max-width: 620px) {
    span {
      font-size: 0.65rem;
    }
    a {
      font-size: 0.85rem;
      max-width: 90px;
    }
  }
`;
