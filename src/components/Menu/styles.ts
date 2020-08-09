import styled from 'styled-components';

export const Container = styled.div`
  width: 400px;
  background: #504c5a;
  cursor: default;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  box-shadow: 0px 3px 6px #000000;
  border-radius: 0px 5px 5px 0px;
  padding: 50px 30px;
  display: flex;
  z-index: 2;
  align-items: flex-start;
  flex-direction: column;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }

  hr {
    width: 100%;
    border-color: #777777;
    margin: 30px 0;
    border-style: solid;
  }

  > h2 {
    font-size: 26px;
    color: #ffffff;
    margin: 40px 0 17px;
    font-weight: bold;
  }

  > span {
    font-size: 20px;
    margin: 17px 0;
    cursor: pointer;
    color: #ffffff;
  }

  > div {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;

    > span {
      font-size: 14px;
      cursor: pointer;
      color: #ff9d3b;
    }

    > svg {
      cursor: pointer;
      width: 56px;
    }
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;
