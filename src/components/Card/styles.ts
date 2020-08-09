import styled from 'styled-components';

export const CardContainer = styled.div`
  cursor: pointer;
  width: 100%;
  border-radius: 5px;
  box-shadow: #000 0px 4px 6px;
  background: #3e3b47;
  padding: 17px 22px 15px 15px;
  display: flex;
  flex-direction: column;
  margin: 15px 0;
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
      width: 100%;

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
