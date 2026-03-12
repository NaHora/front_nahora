import styled from 'styled-components';

export const Header = styled.header`
  padding: 22px 24px 0;
`;

export const HeaderContent = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 18px;
  border-radius: 28px;
  background: rgba(8, 16, 30, 0.78);
  border: 1px solid rgba(158, 179, 209, 0.14);
  backdrop-filter: blur(18px);
  box-shadow: 0 20px 50px rgba(7, 17, 31, 0.22);

  @media (max-width: 900px) {
    flex-wrap: wrap;
    justify-content: space-between;
  }
`;

export const Brand = styled.button`
  display: flex;
  align-items: center;
  gap: 14px;
  background: transparent;
  border: 0;
  color: #f8fbff;

  img {
    width: 56px;
    height: 56px;
    object-fit: contain;
  }

  span {
    display: block;
    color: #9eb3d1;
    font-size: 0.76rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  strong {
    display: block;
    margin-top: 3px;
    font-size: 1rem;
    letter-spacing: -0.02em;
  }

  @media (max-width: 700px) {
    width: 100%;
  }
`;

export const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.05);
  margin-left: auto;

  svg {
    color: #ff9f43;
    width: 18px;
    height: 18px;
  }

  @media (max-width: 900px) {
    margin-left: 0;
  }
`;

export const ProfileText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.2;

  span {
    color: #8ea5c5;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  a {
    margin-top: 3px;
    color: #f8fbff;
    font-weight: 700;
    text-decoration: none;
  }
`;
