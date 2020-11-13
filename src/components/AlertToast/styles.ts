import styled from 'styled-components';

interface PageProps {
  mobile: boolean;
}

export const AlertContainer = styled.div<PageProps>`
  position: absolute;
  z-index: 1;
  top: 144px;
  right: ${(props) => (props.mobile ? '20px' : 'calc(50% - 565px)')};
  /* right:  5% */

  width: 90%;
  background: #e51a20;
  color: #fff;
  border: 1px solid #fff;
  border-radius: 10px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  box-shadow: 0px 3px 6px #000000;
  max-width: 350px;

  @media (max-width: 600px) {
    right: 20px;
  }

  :before {
    content: '';
    position: absolute;
    right: 45px;
    top: -15px;
    width: 0;
    height: 0;
    border-right: 7px solid transparent;
    border-left: 7px solid transparent;
    border-bottom: 15px solid #fff;
  }

  > svg {
    margin-top: 10px;
    margin-bottom: 30px;
  }
  > p {
    align-self: flex-end;
    cursor: pointer;
    margin: 0;
  }
`;

export const Title = styled.span`
  color: #fff;
  font-size: 20px;
  margin-bottom: 20px;
  font-weight: bold;
`;

export const Description = styled.span`
  color: #fff;
  font-size: 16px;
  margin-bottom: 20px;
  font-weight: 500;
`;
