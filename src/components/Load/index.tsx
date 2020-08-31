import React from 'react';

import Loader from 'react-loader-spinner';
import { Container } from './styles';

const Load: React.FC = () => {
  return (
    <Container>
      <Loader type="Watch" color="#ff9000" height={100} width={100} />
    </Container>
  );
};

export default Load;
