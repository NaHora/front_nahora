import styled from 'styled-components';
import { shade, lighten, darken } from 'polished';
import TinyColor from 'tinycolor2';

interface PageColor {
  primaryColor: string;
  secondaryColor: string;
  disabled?: boolean;
  currentSelected?: boolean;
}

export const Container = styled.div<PageColor>`
  background: ${(props) =>
    TinyColor(props.primaryColor).isLight()
      ? darken(0.03, props.primaryColor)
      : lighten(0.03, props.primaryColor)};
  min-height: 100vh;
  width: 100%;

  > header {
    padding: 15px 20px;
    height: 144px;
    background: ${(props) => props.primaryColor};

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
        color: ${(props) =>
          TinyColor(props.primaryColor).isLight() ? '#3e3b47' : '#f4ede8'};

        @media (max-width: 600px) {
          display: none;
        }
      }

      > img {
        width: 100px;
        height: 100px;
        border-radius: 50px;
        border: 2px solid ${(props) => props.secondaryColor};
      }

      svg {
        color: ${(props) =>
          TinyColor(props.primaryColor).isLight() ? '#3e3b47' : '#f4ede8'};
        width: 24px;
        height: 24px;
      }
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

  > div {
    display: flex;
    overflow-x: scroll;
    width: 100%;
    padding: 0 0 10px;
    span {
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

export const DivCategory = styled.div<PageColor>`
  margin-right: 16px;
  box-shadow: ${(props) => props.currentSelected && '#000 0px 4px 6px'};
  border-radius: 5px;
  white-space: nowrap;
  text-align: center;
  padding: 8px 15px;
  font-size: 20px;
  opacity: ${(props) => (props.currentSelected ? '1' : '0.7')};
  background: ${(props) => props.secondaryColor};
  color: ${(props) =>
    TinyColor(props.secondaryColor).isLight() ? '#000' : '#f4ede8'};
  cursor: pointer;
`;

export const ButtonContainer = styled.main`
  width: 300px;
  margin: 0 auto;
  padding-bottom: 10px;

  @media (max-width: 600px) {
    width: 100%;
    padding: 10px;
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

  > div {
    padding: 0 0 10px;
    display: flex;
    overflow-x: scroll;
    width: 100%;
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
    }

    @media (max-width: 600px) {
      ::-webkit-scrollbar {
        display: none;
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
    margin: 16px;
    @media (max-width: 600px) {
      margin: 8px;
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

  img {
    border-radius: 50%;
    height: 30px;
    width: 30px;
    margin-right: 8px;
  }

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
