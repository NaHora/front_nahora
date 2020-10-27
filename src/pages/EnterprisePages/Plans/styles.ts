import styled from 'styled-components';

interface PageProps {
  currentSection?: boolean;
}

interface StatusColor {
  status?: number;
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  > div {
    display: flex;
    max-width: 1120px;
    width: 100%;
    align-self: center;
    margin: 100px 0;

    @media (max-width: 600px) {
      flex-direction: column-reverse;

      margin: 15px 0;
    }
  }
`;

export const MenuTitles = styled.div`
  width: 40%;
  display: flex;
  padding: 0 100px;
  flex-direction: column;
  border-right: 1px solid #fff;

  @media (max-width: 600px) {
    display: none;
  }

  span {
    font-size: 36px;
    cursor: pointer;
    margin-bottom: 25px;
  }
`;

export const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column-reverse;
  padding: 0 50px;
  & + div {
    border-left: 1px solid #fff;
  }
  @media (max-width: 600px) {
    width: 100%;
    padding: 0 15px;
  }

  > span {
    display: flex;
    font-size: 20px;
    align-items: center;
  }

  > div {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
`;

export const CardSolicitation = styled.div<StatusColor>`
  width: 100%;
  border-radius: 5px;
  box-shadow: #000 0px 4px 6px;
  background: #3e3b47;
  padding: 5px 22px;
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
  position: relative;
  overflow: scroll;
  flex-direction: column;
  border-left: 2px solid
    ${(props) =>
      !props.status
        ? 'none'
        : props.status < 0
        ? 'red'
        : props.status < 7
        ? 'yellow'
        : 'green'};
  @media (min-width: 600px) {
    ::-webkit-scrollbar {
      display: none;
    }
  }

  > div {
    display: flex;
    align-items: center;

    margin: 12px 0;
    font-size: 20px;
    :first-child {
      width: 100%;
    }

    > select {
      width: 100%;
      max-width: 400px;
      margin: 0 8px;
      height: 100%;
      background: #232129;
      border-radius: 5px;
      padding: 0 5px;
      color: #fff;
      border: none;

      option {
        background: #232129;
      }
    }

    /* img {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      margin-right: 8px;
    } */

    > svg {
      margin: 0 10px;
    }
  }

  > table {
    max-width: 100%;
    border-collapse: collapse;

    tr {
      th {
        border-right: 1px solid gray;
        padding: 5px 3px;
        text-align: center;
        :last-child {
          border: none;
        }
      }
      td {
        text-align: center;
        border-right: 1px solid gray;
        border-top: 1px solid gray;
        padding: 5px 3px;
        :last-child {
          border: none;
        }

        input {
          width: 100%;
          background: #232129;
          border: none;
          color: white;
          padding: 2px;
          border-radius: 5px;
          :focus {
            outline: none;
          }
        }
        select {
          width: 100%;
          background: #232129;
          border: none;
          color: white;
          padding: 2px;
          border-radius: 0 5px 5px 0;
          :focus {
            outline: none;
          }
        }
      }
    }
  }
`;

export const SolicitationSection = styled.div`
  margin: 10px 0;

  > span {
    cursor: pointer;
    font-size: 22px;
  }

  > div {
    margin: 8px 0;
  }
`;

export const ActiveSection = styled.div`
  margin: 10px 0;
  > header {
    display: flex;
    justify-content: space-between;
    > span {
      cursor: pointer;
      font-size: 22px;
    }

    > div {
      margin: 8px 0;
    }
  }
`;

export const PlanSection = styled.div`
  margin: 10px 0;
  > div {
    margin: 8px 0;
    > label {
      display: flex;
      flex-direction: column;
      margin-bottom: 8px;
      > select {
        width: 100%;

        height: 50px;
        background: #232129;
        border-radius: 5px;
        padding: 0 5px;
        color: #fff;
        border: none;

        option {
          background: #232129;
        }
      }
    }
  }
  > header {
    display: flex;
    justify-content: space-between;
    > span {
      cursor: pointer;
      font-size: 22px;
    }

    > div {
      margin: 8px 0;
      > label {
        > select {
          width: 100%;
          margin: 0 8px;
          height: 100%;
          background: #232129;
          border-radius: 5px;
          padding: 0 5px;
          color: #fff;
          border: none;

          option {
            background: #232129;
          }
        }
      }
    }
  }
`;

export const Span = styled.span<PageProps>`
  color: ${(props) => (props.currentSection ? '#ff9000' : '#fff')};
  cursor: pointer;
`;
