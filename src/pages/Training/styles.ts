import styled from 'styled-components';

export const Panel = styled.section`
  padding: 28px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid rgba(11, 11, 11, 0.06);
  color: #0b0b0b;
  display: flex;
  flex-direction: column;
  gap: 22px;

  @media (max-width: 620px) {
    padding: 22px;
  }
`;

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 16px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 180px;
  flex: 1;
`;

export const Label = styled.span`
  color: #62748d;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

export const DateInput = styled.input`
  height: 48px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid rgba(11, 11, 11, 0.15);
  background: #ffffff;
  color: #0b0b0b;
  font-size: 0.95rem;
  font-weight: 500;
  transition: border-color 120ms ease;

  &:focus {
    outline: none;
    border-color: #ff9000;
  }
`;

export const Select = styled.select`
  height: 48px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid rgba(11, 11, 11, 0.15);
  background: #ffffff;
  color: #0b0b0b;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 120ms ease;

  &:focus {
    outline: none;
    border-color: #ff9000;
  }
`;

export const EditorWrap = styled.div`
  min-height: 320px;
`;

export const SelectDefault = styled.select`
  height: 48px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid rgba(11, 11, 11, 0.15);
  background: #ffffff;
  color: #0b0b0b;
  font-size: 0.95rem;
  font-weight: 500;

  &:focus {
    outline: none;
    border-color: #ff9000;
  }
`;
