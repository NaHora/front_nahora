import styled from 'styled-components';

export const Container = styled.div``;

export const Header = styled.header`
  padding: 32px 0;
  background: #28262e;
`;

export const HeaderContent = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  align-items: center;

  @media (max-width: 600px) {
    margin: 0 15px;
  }

  > img {
    height: 80px;

    @media (max-width: 600px) {
      display: none;
    }
  }

  button {
    margin-left: auto;
    background: transparent;
    border: 0;
  }

  svg {
    color: #999591;
    width: 20px;
    height: 20px;
  }
`;

export const Profile = styled.div`
  display: flex;
  align-items: center;
  margin-left: 80px;

  @media (max-width: 600px) {
    margin-left: 10px;
  }

  img {
    width: 56px;
    height: 56px;
    border-radius: 50%;
  }

  div {
    display: flex;
    flex-direction: column;
    margin-left: 16px;
    line-height: 24px;

    span {
      color: #f4ede8;
    }

    a {
      color: #ff9000;
      text-decoration: none;

      &:hover {
        opacity: 0.8;
      }
    }
  }
`;

export const Content = styled.main`
  max-width: 1120px;
  margin: 64px auto;
  display: flex;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: column;
    padding: 15px;
    margin-top: 20px;
  }
`;

export const Card = styled.div`
  border-radius: 5px;
  box-shadow: #000 0px 4px 6px;
  background: #3e3b47;
  padding: 17px 22px 15px 15px;
  display: flex;
  flex-direction: column;
  margin: 25px 0;

  > div {
    display: flex;
    > img {
      border-radius: 5px;
      height: 100px;
      width: 100px;
      margin-right: 18px;
    }
  }
`;

export const Title = styled.div`
  font-size: 22px;
  color: #ffffff;
  margin-bottom: 5px;
  font-weight: bold;
`;

export const SubTitle = styled.div`
  font-size: 16px;
  margin-bottom: 5px;
  color: #ffffff;
`;

export const Text = styled.div`
  font-size: 14px;
  color: #ffffff;
  margin-bottom: 5px;
`;

export const CadastraButton = styled.button`
  font-size: 16px;
  color: #3e3b47;
  background: #ff9d3b;
  padding: 5px 22px;
  font-weight: bold;
  border-radius: 5px;
  border: none;
  align-self: flex-end;
`;
