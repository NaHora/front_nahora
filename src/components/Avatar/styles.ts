import styled from 'styled-components';

interface AvatarProps {
  noMargin: boolean;
  width: number;
  height: number;
  secondaryColor: string;
  primaryColor: string;
}

export const Container = styled.main<AvatarProps>`
  border-radius: 50%;
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  margin-right: ${(props) => (props.noMargin ? '0' : '8px')};
  border: 2px solid rgba(255, 255, 255, 0.24);
  background:
    linear-gradient(135deg, rgba(255, 159, 67, 0.2), rgba(48, 86, 211, 0.18)),
    ${(props) => props.primaryColor};
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  > img {
    max-height: ${(props) => props.height}px;
    max-height: ${(props) => props.height}px;
    min-width: ${(props) => props.width}px;
    min-width: ${(props) => props.width}px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
    padding: 1px;
  }

  > span {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
    font-size: ${(props) => Number(props.height) / 2}px;
    padding: 20px;
    color: ${(props) => props.secondaryColor};
    font-weight: 700;
  }
`;
