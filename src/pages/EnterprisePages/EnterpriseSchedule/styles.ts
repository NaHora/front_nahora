import styled from 'styled-components';
import TinyColor from 'tinycolor2';

interface PageColor {
  primaryColor: string;
  secondaryColor: string;
  disabled?: boolean;
  currentSelected?: boolean;
}

export const Container = styled.div``;

export const Services = styled.main`
  width: 100%;
  overflow-x: scroll;
  display: flex;
  flex-direction: column;
  padding: 15px 20px;
  max-width: 1120px;
  margin: 12px auto;
  table {
    width: 100%;
  }

  > div {
    display: flex;
    margin-bottom: 20px;

    label {
      margin-right: 15px;
    }
  }

  @media (min-width: 600px) {
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
      background-color: #ff9000;
      border-radius: 20px;
      width: 1px;
    }
  }
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
    font-size: 36px;
  }
  > main {
    display: flex;
    width: 100%;
    @media (max-width: 600px) {
      flex-direction: column;
    }

    > div {
      display: flex;
      overflow-x: scroll;
      padding: 0 0 10px;

      hr {
        @media (max-width: 600px) {
          display: none;
        }
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
  }
`;

export const DivCategory = styled.div<PageColor>`
  margin: 8px;
  box-shadow: ${(props) => props.currentSelected && '#000 0px 4px 6px'};
  border-radius: 5px;

  white-space: nowrap;

  text-align: center;
  padding: 8px 15px;
  font-size: 20px;
  opacity: ${(props) => (props.currentSelected ? '1' : '0.7')};
  background: ${(props) =>
    props.title ? 'transparent' : props.secondaryColor};
  color: ${(props) =>
    TinyColor(props.secondaryColor).isLight() ? '#000' : '#f4ede8'};

  cursor: pointer;
  border: ${(props) => props.title && '1px solid #ff9000'};
`;

export const ButtonCategory = styled.button<PageColor>`
  margin: 8px;
  box-shadow: #000 0px 4px 6px;
  border-radius: 5px;
  min-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  padding: 8px 15px;
  font-size: 20px;

  background: transparent;
  color: #f4ede8;
  max-width: 25ch;
  cursor: pointer;
  border: 1px solid #ff9000;
`;
