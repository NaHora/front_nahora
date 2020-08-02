import styled from 'styled-components';

export const Container = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  padding: 30px;
  overflow: hidden;
  @media (max-width: 600px) {
    padding: 10px;
  }
`;
