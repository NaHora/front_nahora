import styled from 'styled-components';
import { shade, lighten, darken } from 'polished';
import TinyColor from 'tinycolor2';

interface PageColor {
  primaryColor: string;
  secondaryColor: string;
  disabled?: boolean;
  currentSelected?: boolean;
}

export const SelectDefault = styled.select`
  width: 200px;
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

export const Container = styled.div<PageColor>`
  background: ${(props) =>
    TinyColor(props.primaryColor).isLight()
      ? darken(0.05, props.primaryColor)
      : lighten(0.03, props.primaryColor)};
  min-height: 100vh;
  width: 100%;
  display: flex;
  color: ${(props) =>
    TinyColor(props.primaryColor).isLight() ? '#000' : '#f4ede8'};
  flex-direction: column;

  > div {
    max-width: 1120px;
    align-self: center;
    width: 100%;
    padding: 10px;

    > div {
      display: flex;
      @media (max-width: 600px) {
        flex-direction: column;
      }
      > label {
        display: flex;
        margin: 0 8px 0;

        flex-direction: column;
      }
    }

    > table {
      margin-top: 32px;
      width: 100%;
      border-spacing: 0;
      color: white;
      thead {
        border-bottom: 1px solid #ff9000;

        tr {
          background: #28262e;
        }

        tr :nth-child(2) {
          position: sticky;
          left: 0;
          background: inherit;
        }

        th {
          font-size: 12px;
          padding: 7px 10px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          max-width: 140px;
          background: inherit;
          height: 50px;
          text-align: start;
        }
      }

      tbody {
        border-radius: 4px;
        border-bottom: 1px solid #28262e;

        tr :nth-child(2) {
          position: sticky;
          left: 0;
        }

        :last-child {
          border-bottom: 0px;
        }

        td {
          height: 50px;
          max-width: 140px;
          font-size: 12px;
          padding: 7px 10px;
          background: inherit;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        tr {
          background: #312e38;

          :hover {
            background: ${lighten(0.05, '#3e3b47')};
          }
        }
      }
    }
    > h2 {
      margin: 32px 0 16px;
    }

    > header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      @media (max-width: 600px) {
        flex-direction: column;
        > label {
          width: 100%;

          > div {
            margin: 8px 0;
            width: 100%;
          }
          > select {
            margin: 8px 0;
            width: 100%;
          }
        }
      }
      > label {
        display: flex;
        margin: 0 8px 0;

        > div {
          height: 55px;
        }
        flex-direction: column;
      }
    }
  }
`;

export const Content = styled.main`
  padding: 15px 20px;
  width: 100%;
  max-width: 1120px;
  margin: 32px auto 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

export const Schedule = styled.div<PageColor>`
  flex: 1;

  max-width: 50%;

  color: ${(props) =>
    TinyColor(props.primaryColor).isLight() ? '#000' : '#f4ede8'};

  @media (max-width: 600px) {
    margin-right: 0;
    margin-top: 40px;
    width: 100%;
    max-width: 100%;
  }
  h1 {
    font-size: 36px;
  }

  p {
    margin-top: 8px;
    color: ${(props) => props.secondaryColor};
    display: flex;
    align-items: center;
    font-weight: 500;

    span {
      display: flex;
      align-items: center;
    }

    span + span::before {
      content: '';
      width: 1px;
      height: 12px;
      background: ${(props) => props.secondaryColor};
      margin: 0 8px;
    }
  }
`;

export const Section = styled.aside<PageColor>`
  margin-top: 48px;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 15px 20px;

  margin: 12px auto;

  strong {
    color: ${(props) => props.secondaryColor};
    cursor: pointer;
  }
  > main {
    display: flex;
    align-items: center;
    > div {
      display: flex;
      overflow-x: scroll;
      width: 100%;
      scroll-behavior: smooth;

      ::-webkit-scrollbar {
        display: none;
      }

      @media (max-width: 600px) {
        ::-webkit-scrollbar {
          display: none;
        }
      }
    }
  }

  > strong {
    color: ${(props) =>
      TinyColor(props.primaryColor).isLight() ? '#3e3b47' : '#f4ede8'};
    font-size: 20px;
    line-height: 26px;
    border-bottom: 1px solid #3e3b47;
    display: block;
    padding-bottom: 16px;
    margin-bottom: 16px;
  }

  > p {
    color: ${(props) =>
      TinyColor(props.primaryColor).isLight() ? '#3e3b47' : '#f4ede8'};
  }
`;

export const Appointment = styled.aside<PageColor>`
  display: flex;

  box-shadow: ${(props) => props.currentSelected && '#000 0px 4px 6px'};
  align-items: center;
  opacity: ${(props) =>
    props.disabled ? '0.3' : props.currentSelected ? '1' : '0.7'};
  background: ${(props) => props.secondaryColor};
  padding: 8px;
  border-radius: 5px;
  justify-content: space-between;
  margin-right: 16px;
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};

  svg {
    color: ${(props) =>
      TinyColor(props.secondaryColor).isLight() ? '#000' : '#f4ede8'};
  }
  > div {
    display: flex;
    align-items: center;

    span {
      display: flex;
      align-items: center;
      color: ${(props) =>
        TinyColor(props.secondaryColor).isLight() ? '#000' : '#f4ede8'};

      svg {
        margin-right: 8px;
      }
    }
  }
`;

export const Calendar = styled.aside<PageColor>`
  width: 380px;

  color: ${(props) =>
    TinyColor(props.primaryColor).isLight() ? '#3e3b47' : '#f4ede8'};

  @media (max-width: 600px) {
    width: 100%;
  }

  .DayPicker {
    background: ${(props) => props.primaryColor};
    border-radius: 10px;
  }

  .DayPicker-wrapper {
    padding-bottom: 0;
  }

  .DayPicker,
  .DayPicker-Month {
    width: 100%;
  }

  .DayPicker-Month {
    border-collapse: separate;
    border-spacing: 8px;
    padding: 16px;
    display: block;
    @media (max-width: 600px) {
      padding: 8px;
      border-spacing: 6px;
    }
  }

  .DayPicker-Day {
    width: 40px;
    height: 40px;

    @media (max-width: 600px) {
      width: 30px;
      height: 30px;
      padding: 0.4em;
    }
  }

  .DayPicker-Day--available:not(.DayPicker-Day--outside) {
    background: ${(props) =>
      TinyColor(props.primaryColor).isLight()
        ? darken(0.2, props.primaryColor)
        : lighten(0.2, props.primaryColor)};
    border-radius: 10px;
    color: ${(props) =>
      TinyColor(props.primaryColor).isLight()
        ? TinyColor(darken(0.2, props.primaryColor)).isLight()
          ? '#000'
          : '#fff'
        : TinyColor(lighten(0.2, props.primaryColor)).isLight()
        ? '#fff'
        : '#000'};
  }

  .DayPicker:not(.DayPicker--interactionDisabled)
    .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):not(.DayPicker-Day--outside):hover {
    background: ${(props) => shade(0.2, lighten(0.03, props.secondaryColor))};
  }

  .DayPicker-Day--today {
    font-weight: normal;
  }

  .DayPicker-Day--disabled {
    color: ${(props) =>
      TinyColor(props.primaryColor).isLight()
        ? '#3e3b47'
        : '#f4ede8'} !important;
    background: transparent !important;
    opacity: 0.2;
  }

  .DayPicker-Weekday {
    color: ${(props) =>
      TinyColor(props.primaryColor).isLight()
        ? '#3e3b47'
        : '#f4ede8'} !important;
  }

  .DayPicker-NavBar {
    color: ${(props) =>
      TinyColor(props.primaryColor).isLight()
        ? '#3e3b47'
        : '#f4ede8'} !important;
  }

  .DayPicker-Day--selected {
    background: ${(props) => lighten(0.03, props.secondaryColor)} !important;
    border-radius: 10px;
    color: ${(props) => props.primaryColor} !important;
  }
`;

export const ModalUsers = styled.div<PageColor>`
  box-shadow: #000000 2px 2px 6px;

  border-radius: 5px;
  margin-top: 15px;
  display: flex;
  overflow: hidden;
  align-items: center;
  flex-direction: column;
  background: ${(props) => lighten(0.03, props.secondaryColor)};
  color: ${(props) =>
    TinyColor(props.secondaryColor).isLight() ? '#000' : '#f4ede8'};
  padding: 20px;

  /* img {
    border-radius: 50%;
    height: 30px;
    width: 30px;
    margin-right: 8px;
  } */

  > div {
    overflow-y: scroll;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 10px;

    ::-webkit-scrollbar-track {
      background-color: ${(props) => lighten(0.1, props.secondaryColor)};
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
    }

    @media (max-width: 600px) {
      ::-webkit-scrollbar {
        display: none;
      }
    }
  }

  svg {
    margin: 8px;
  }

  span {
    margin-bottom: 8px;
    display: flex;
    align-items: center;
  }
`;
