import styled, { css } from 'styled-components';

export const HeroAction = styled.button`
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

  &:hover {
    filter: brightness(0.96);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

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
  min-height: 148px;

  strong {
    font-size: 2.1rem;
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

export const Layout = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(320px, 0.85fr);
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

export const HeaderAction = styled.button<{ variant?: 'primary' | 'muted' }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  padding: 10px 14px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: border-color 120ms ease, filter 120ms ease;

  ${({ variant }) =>
    variant === 'primary'
      ? css`
          border: 0;
          background: #ff9000;
          color: #0b0b0b;
          &:hover {
            filter: brightness(0.96);
          }
        `
      : css`
          border: 1px solid rgba(11, 11, 11, 0.1);
          background: #ffffff;
          color: #0b0b0b;
          &:hover {
            border-color: #ff9000;
          }
        `}

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const FormPanel = styled.div`
  display: grid;
  gap: 14px;
  margin-top: 22px;
  padding: 20px;
  border-radius: 10px;
  background: #f6f6fa;
  border: 1px solid rgba(11, 11, 11, 0.06);
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

export const Label = styled.label`
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

export const NativeInput = styled.input`
  height: 44px;
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
`;

export const NativeSelect = styled.select`
  height: 44px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid rgba(11, 11, 11, 0.15);
  background: #ffffff;
  color: #0b0b0b;
  font-size: 0.95rem;
  cursor: pointer;
  transition: border-color 120ms ease;

  &:focus {
    outline: none;
    border-color: #ff9000;
  }
`;

export const PrimaryButton = styled.button`
  align-self: flex-end;
  padding: 12px 20px;
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
`;

export const PlanList = styled.div`
  margin-top: 22px;
  display: grid;
  gap: 12px;
`;

export const PlanCard = styled.article`
  padding: 16px 18px;
  border-radius: 10px;
  background: #f6f6fa;
  border: 1px solid rgba(11, 11, 11, 0.06);
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 14px;
  align-items: center;
`;

export const PlanIdentity = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;

  h3 {
    color: #0b0b0b;
    font-size: 1rem;
    letter-spacing: -0.01em;
  }
`;

export const PlanPills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const PlanPill = styled.span<{ tone?: 'accent' | 'muted' }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 0.74rem;
  font-weight: 700;
  background: ${({ tone }) => (tone === 'accent' ? '#ff9000' : '#ffffff')};
  color: #0b0b0b;
  border: 1px solid
    ${({ tone }) => (tone === 'accent' ? '#ff9000' : 'rgba(11, 11, 11, 0.08)')};

  svg {
    width: 12px;
    height: 12px;
  }
`;

export const IconButton = styled.button<{ variant?: 'danger' | 'neutral' }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 120ms ease, border-color 120ms ease, background 120ms ease;

  &:hover {
    transform: translateY(-1px);
  }

  svg {
    width: 16px;
    height: 16px;
  }

  ${({ variant }) =>
    variant === 'danger'
      ? css`
          background: #ffffff;
          color: #d54c46;
          border: 1px solid rgba(213, 76, 70, 0.3);
          &:hover {
            background: #fdecec;
          }
        `
      : css`
          background: #ffffff;
          color: #0b0b0b;
          border: 1px solid rgba(11, 11, 11, 0.1);
          &:hover {
            border-color: #ff9000;
          }
        `}
`;

export const RestrictList = styled.div`
  margin-top: 22px;
  display: grid;
  gap: 12px;
`;

export const RestrictCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 10px;
  background: #f6f6fa;
  border: 1px solid rgba(11, 11, 11, 0.06);
`;

export const RestrictInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #0b0b0b;
  font-weight: 600;
  font-size: 0.92rem;

  svg {
    width: 14px;
    height: 14px;
    color: #ff9000;
  }
`;

export const EmptyState = styled.div`
  margin-top: 22px;
  padding: 22px;
  border-radius: 10px;
  background: #f6f6fa;
  border: 1px dashed rgba(11, 11, 11, 0.12);
  color: #62748d;
  text-align: center;
  font-size: 0.9rem;
`;
