import styled from 'styled-components';

interface PageProps {
  total?: boolean;
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  > div {
    display: flex;
    max-width: 1120px;
    width: 100%;
    align-self: center;

    @media (max-width: 600px) {
      padding: 15px;
    }
  }
`;

export const Section = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;

  > header {
    /* display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between; */
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 32px;

    @media (max-width: 600px) {
      grid-template-columns: repeat(1, 1fr);
    }
  }
`;

export const TotalBox = styled.div<PageProps>`
  display: flex;
  width: 30%;
  flex-direction: column;
  background: ${(props) => (props.total ? '#ff9000' : '#504c5a')};
  padding: 22px 32px;
  border-radius: 5px;
  width: 100%;

  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    p {
      font-size: 16px;
    }
  }
  h1 {
    margin-top: 14px;
    font-size: 36px;
    font-weight: normal;
    line-height: 54px;
  }
`;

export const Table = styled.main`
  margin: 8px 0 32px;
  position: relative;
  overflow: scroll;

  @media (min-width: 600px) {
    ::-webkit-scrollbar {
      display: none;
    }
  }

  table {
    width: 100%;
    border-spacing: 0 8px;
    th {
      color: #969cb3;
      font-weight: normal;
      padding: 20px 32px;
      text-align: left;
      font-size: 16px;
      font-weight: bold;
      line-height: 24px;
    }
    td {
      padding: 20px 32px;
      border: 0;
      background: #504c5a;
      font-size: 16px;
      font-weight: normal;

      &.title {
        color: #363f5f;
      }
      &.income {
        color: #12a454;
      }
      &.outcome {
        color: #e83f5b;
      }
    }
    td:first-child {
      border-radius: 8px 0 0 8px;
      font-weight: bold;
    }
    td:last-child {
      border-radius: 0 8px 8px 0;
    }
  }
`;

export const InputsDiv = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 62px 0;

  @media (max-width: 600px) {
    margin: 32px 0;

    flex-direction: column;
    div {
      width: 100%;
      margin: 8px 0 0;
    }

    select {
      width: 100%;
      margin: 8px 0 0;
    }

    button {
      width: 100%;
      margin: 8px 0 0;
    }
  }
`;

export const ModalInput = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 54px 0 0;
  > div {
    > div {
      width: 100%;
      margin: 0 8px 0;
    }
  }

  @media (max-width: 600px) {
    flex-direction: column;
    > div {
      margin: 16px 0 0;
      flex-direction: column;
      width: 100%;
      > div {
        margin: 4px 0 0;

        width: 100%;
      }
      select {
        margin: 4px 0 0;
        width: 100%;
      }
    }
  }
`;

export const SelectDefault = styled.select`
  width: 180px;
  background: #232129;
  border: none;
  color: white;
  padding: 16px;
  font-size: 16px;
  border: 2px solid #232129;
  border-radius: 10px;

  :focus {
    outline: none;
  }
`;
