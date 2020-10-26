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
  border: 1px solid ${(props) => props.secondaryColor};
  background: ${(props) => props.primaryColor};
  display: flex;
  justify-content: center;
  align-items: center;

  > img {
    height: ${(props) => props.height}px;
    width: ${(props) => props.width}px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
    padding: 0;
  }

  > span {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
    font-size: ${(props) => Number(props.height) / 2}px;
    padding: 20px;
  }
`;
