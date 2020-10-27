import styled from 'styled-components';
import TinyColor from 'tinycolor2';

interface PageColor {
  primaryColor: string;
  secondaryColor: string;
  disabled?: boolean;
  currentSelected?: boolean;
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  > header {
    padding: 15px 20px;
    height: 144px;
    background: #28262e;

    display: flex;
    align-items: center;

    div {
      max-width: 1120px;
      width: 100%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;

      > span {
        font-size: 40px;
        font-weight: bold;
        color: #f4ede8;

        @media (max-width: 600px) {
          display: none;
        }
      }

      > img {
        width: 100px;
        height: 100px;
        border-radius: 50px;
        border: 2px solid #ff9000;
      }

      svg {
        color: #f4ede8;
        width: 24px;
        height: 24px;
      }
    }
  }

  > div {
    display: flex;
    max-width: 1120px;
    width: 100%;
    align-self: center;
    margin: 50px 0;

    @media (max-width: 600px) {
      flex-direction: column;

      margin: 15px 0;
    }
  }
`;

export const UserInfo = styled.div`
  background: #28262e;
  border-radius: 5px;
  padding: 32px;
  width: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 600px) {
    width: 100%;
  }
  > main {
    margin: 0px auto 24px;
    img {
      width: 180px;
      height: 180px;
      padding: 9px;
    }

    border: 4px solid #ff9000;
  }

  > h2 {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    color: rgb(225, 225, 230);
  }

  > hr {
    margin: 16px 0;
    width: 100%;
    border-color: rgba(255, 255, 255, 0.2);
  }

  > span {
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    color: rgb(225, 225, 230);
    margin: 4px 0 0 0;
    align-self: flex-start;
  }
`;

export const DivCategory = styled.div<PageColor>`
  margin: 8px;
  box-shadow: ${(props) => props.currentSelected && '#000 0px 4px 6px'};
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  white-space: nowrap;
  div {
    width: 100%;
    margin-right: 8px;
    align-items: center;
    justify-content: center;
    display: flex;
  }
  font-size: 20px;
  span {
    text-align: center;
  }

  padding: 8px 15px;
  opacity: ${(props) => (props.currentSelected ? '1' : '0.7')};
  background: ${(props) =>
    props.title ? 'transparent' : props.secondaryColor};
  color: ${(props) =>
    TinyColor(props.secondaryColor).isLight() ? '#000' : '#f4ede8'};

  cursor: pointer;
  border: ${(props) => props.title && '1px solid #ff9000'};
`;

export const Category = styled.main<PageColor>`
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 15px 20px;
  max-width: 1120px;
  margin: 12px auto;

  > span {
    color: ${(props) =>
      TinyColor(props.primaryColor).isLight() ? '#3e3b47' : '#f4ede8'};
    margin-bottom: 16px;
    font-size: 24px;
  }

  > div {
    display: flex;
    overflow-x: scroll;
    width: 100%;
    padding: 0 0 10px;
    > span {
      color: ${(props) =>
        TinyColor(props.primaryColor).isLight() ? '#3e3b47' : '#f4ede8'};
    }
    strong {
      cursor: pointer;
      color: ${(props) => props.secondaryColor};
    }
    ::-webkit-scrollbar-track {
      background-color: transparent;
      border-radius: 20px;
      width: 2px;
    }

    ::-webkit-scrollbar {
      width: 2px;
      border-radius: 20px;
    }

    ::-webkit-scrollbar-thumb {
      background-color: ${(props) => props.secondaryColor};
      border-radius: 20px;
      width: 1px;
    }

    @media (max-width: 600px) {
      ::-webkit-scrollbar {
        display: none;
      }
    }
  }
`;
