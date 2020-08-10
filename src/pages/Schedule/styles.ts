import styled from 'styled-components';

interface CardAction {
  past?: boolean | undefined;
}

export const Container = styled.div``;

export const OpenDelete = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  background: #28262e;
  padding: 50px;
  position: absolute;
  left: 25%;
  top: 50%;
  border-radius: 5px;
  border: 2px solid #ff9000;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);

  > div {
    width: 100%;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    > button {
      width: 200px;
      height: 50px;
    }
  }
`;

export const Content = styled.main`
  max-width: 1120px;
  margin: 34px auto;
  display: flex;
  justify-content: space-between;

  > div {
    width: 100%;
    padding: 30px;

    @media (max-width: 600px) {
      padding: 15px;
    }

    > span {
      font-size: 22px;
    }
  }

  @media (max-width: 600px) {
    flex-direction: column;

    margin-top: 20px;
  }
`;

export const Card = styled.div<CardAction>`
  cursor: pointer;
  width: 100%;
  border-radius: 5px;
  box-shadow: #000 0px 4px 6px;
  background: #3e3b47;
  opacity: ${(props) => props.past && 0.5};
  padding: 17px 22px 15px 15px;
  display: flex;
  flex-direction: column;
  margin: 25px 0;
  position: relative;

  > main {
    hr {
      margin-bottom: 12px;
      margin-top: 8px;
    }

    padding: 5px 10px;
    display: flex;
    flex-direction: column;
    > div {
      display: flex;
      align-items: center;
      margin: 12px 0;
      img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 8px;
      }
    }

    > span {
      margin: 8px 0;
      svg {
        margin-right: 8px;
      }
    }
  }

  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    div {
      display: flex;
      align-items: center;

      span {
        font-size: 18px;
        margin-right: 8px;
      }
      > img {
        border-radius: 5px;
        height: 30px;
        width: 30px;
        margin-right: 8px;
      }
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
  color: ${(props) => (!props.disabled ? '#3e3b47' : '#ff9d3b')};
  background: ${(props) => (props.disabled ? '#3e3b47' : '#ff9d3b')};
  padding: 5px 22px;
  font-weight: bold;
  border-radius: 5px;
  border: none;
  align-self: flex-end;
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
`;

export const SearchContent = styled.div`
  width: 40%;
  @media (max-width: 600px) {
    margin: 25px 0;
    width: 100%;
  }
`;

export const MyEnterprises = styled.div`
  span {
    font-size: 34px;
    font-weight: bold;
  }
  width: 40%;
  @media (max-width: 600px) {
    width: 100%;
  }
`;

export const CardMine = styled.div`
  border-radius: 5px;
  box-shadow: #000 0px 4px 6px;
  background: #3e3b47;
  cursor: pointer;

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
