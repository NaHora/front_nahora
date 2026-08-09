import styled from 'styled-components';
import { darken, lighten } from 'polished';
import TinyColor from 'tinycolor2';

interface LegacyPageColor {
  primaryColor: string;
  secondaryColor: string;
}

export const Metrics = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const MetricCard = styled.article`
  padding: 22px 24px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid rgba(11, 11, 11, 0.06);
  color: #0b0b0b;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 132px;

  strong {
    font-size: 1.9rem;
    letter-spacing: -0.05em;
    line-height: 1;
  }

  span {
    color: #62748d;
    font-size: 0.9rem;
    line-height: 1.4;
  }
`;

export const MetricEyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #ff9000;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const Grid = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(320px, 0.86fr);
  gap: 24px;
  margin-top: 24px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

export const Column = styled.div`
  display: grid;
  gap: 24px;
  align-content: start;
`;

export const Panel = styled.section`
  padding: 28px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid rgba(11, 11, 11, 0.06);
  color: #0b0b0b;

  @media (max-width: 620px) {
    padding: 22px;
  }
`;

export const PanelHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 620px) {
    flex-direction: column;
  }
`;

export const PanelTitleWrap = styled.div`
  h2 {
    color: #0b0b0b;
    font-size: 1.35rem;
    letter-spacing: -0.03em;
  }

  p {
    margin-top: 6px;
    color: #62748d;
    line-height: 1.55;
    font-size: 0.92rem;
  }
`;

export const FormPanel = styled.div`
  display: grid;
  gap: 14px;
  margin-top: 22px;
`;

export const InlineGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const InlineGridThree = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;

  span {
    color: #62748d;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
`;

export const Input = styled.input`
  height: 48px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid rgba(11, 11, 11, 0.15);
  background: #ffffff;
  color: #0b0b0b;
  font-size: 0.95rem;
  transition: border-color 120ms ease;

  &:focus {
    outline: none;
    border-color: #ff9000;
  }

  &::placeholder {
    color: #a0aec0;
  }

  &[type='color'] {
    padding: 4px;
    cursor: pointer;
    height: 48px;
  }
`;

export const LogoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
`;

export const LogoBox = styled.label`
  position: relative;
  width: 128px;
  height: 128px;
  display: block;
  cursor: pointer;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(11, 11, 11, 0.08);
  background: #f6f6fa;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  input {
    display: none;
  }
`;

export const LogoBadge = styled.span`
  position: absolute;
  right: 8px;
  bottom: 8px;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #ff9000;
  color: #0b0b0b;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const LogoText = styled.div`
  flex: 1;
  min-width: 160px;
  color: #62748d;
  font-size: 0.9rem;
  line-height: 1.5;

  strong {
    display: block;
    color: #0b0b0b;
    font-size: 1rem;
    margin-bottom: 6px;
  }
`;


export const Divider = styled.hr`
  margin: 8px 0;
  border: 0;
  border-top: 1px solid rgba(11, 11, 11, 0.06);
`;

export const SectionLabel = styled.h3`
  color: #0b0b0b;
  font-size: 0.95rem;
  letter-spacing: -0.01em;
  margin-top: 6px;
`;

export const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 18px;
  border-radius: 10px;
  background: #f6f6fa;
  border: 1px solid rgba(11, 11, 11, 0.06);
  color: #0b0b0b;
  font-weight: 500;
`;

export const ToggleContent = styled.div`
  flex: 1;
  min-width: 0;

  strong {
    display: block;
    color: #0b0b0b;
    font-size: 0.98rem;
  }

  span {
    display: block;
    color: #62748d;
    font-size: 0.82rem;
    margin-top: 2px;
    line-height: 1.4;
  }
`;

export const SaveButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  border: 0;
  border-radius: 10px;
  background: #ff9000;
  color: #0b0b0b;
  font-weight: 600;
  cursor: pointer;
  transition: filter 120ms ease;

  &:hover:not(:disabled) {
    filter: brightness(0.96);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const ColorRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: center;
`;

export const ColorSwatch = styled.input`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  border: 1px solid rgba(11, 11, 11, 0.15);
  background: transparent;
  padding: 4px;
  cursor: pointer;
`;

export const PreviewPhone = styled.div`
  width: min(320px, 100%);
  border-radius: 24px;
  padding: 12px;
  background: #0b0b0b;
  margin: 0 auto;
`;

export const PreviewScreen = styled.div<{ primary: string; secondary: string }>`
  min-height: 100%;
  border-radius: 22px;
  overflow: hidden;
  background: ${(props) => props.primary};
`;

export const PreviewHeader = styled.div<{ secondary: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px;
  color: #fff;

  img {
    width: 68px;
    height: 68px;
    border-radius: 14px;
    object-fit: cover;
    border: 2px solid ${(props) => props.secondary};
  }
`;

export const PreviewBody = styled.div`
  background: rgba(255, 255, 255, 0.06);
  margin: 0 12px 12px;
  border-radius: 16px;
  padding: 18px;
  display: grid;
  gap: 12px;
`;

export const PreviewButton = styled.button<{ secondary: string }>`
  border: 0;
  border-radius: 10px;
  padding: 12px 18px;
  background: ${(props) => props.secondary};
  color: #0b0b0b;
  font-weight: 600;
  cursor: pointer;
`;

export const Form = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  > div {
    display: flex;
    width: 100%;
    justify-content: space-between;
    @media (max-width: 600px) {
      flex-direction: column-reverse;
      padding: 15px;
    }

    > div {
      display: flex;
      flex-direction: column;
      width: 100%;
      label {
        margin: 10px 0;
      }
      align-items: center;
    }
  }
`;

export const Cel = styled.div`
  border: 1px solid #ff9000;
  border-radius: 5px;
  max-width: 320px;
  width: 100%;
  min-height: 460px;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div<LegacyPageColor>`
  padding: 15px 20px;
  height: 144px;
  background: ${(props) => props.primaryColor};
  color: ${(props) =>
    TinyColor(props.primaryColor).isLight() ? '#000' : '#fff'};
  display: flex;
  justify-content: space-between;
  align-items: center;

  > img {
    width: 100px;
    height: 100px;
    border-radius: 50px;
    border: 2px solid ${(props) => props.secondaryColor};
  }
`;

export const Body = styled.div<LegacyPageColor>`
  padding: 15px 20px;
  flex: 1;
  background: ${(props) =>
    TinyColor(props.primaryColor).isLight()
      ? darken(0.03, props.primaryColor)
      : lighten(0.03, props.primaryColor)};

  display: flex;
  align-items: center;
`;

export const StatusPill = styled.span<{ tone?: 'success' | 'warning' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 0.76rem;
  font-weight: 700;
  background: ${({ tone }) =>
    tone === 'warning' ? 'rgba(255, 179, 71, 0.22)' : 'rgba(15, 169, 127, 0.22)'};
  color: ${({ tone }) => (tone === 'warning' ? '#8b5a00' : '#0b7259')};
`;
