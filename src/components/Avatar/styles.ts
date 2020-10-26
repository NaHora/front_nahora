import styled from 'styled-components';

interface AvatarProps {
  noMargin: boolean;
  width: string;
  height: string;
  secondaryColor: string;
  primaryColor: string;
}

export const Container = styled.main<AvatarProps>`
  border-radius: 50%;
  height: ${(props) => props.width};
  width: ${(props) => props.height};
  margin-right: ${(props) => (props.noMargin ? '0' : '8px')};
  border: 1px solid ${(props) => props.secondaryColor};
  background: ${(props) => props.primaryColor};
  display: flex;
  justify-content: center;
  align-items: center;

  > img {
    height: ${(props) => props.width};
    width: ${(props) => props.height};
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
    padding: 0;
  }
`;
