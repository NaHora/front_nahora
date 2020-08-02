import React, { ButtonHTMLAttributes } from 'react';

import Loader from 'react-loader-spinner';
import { Container } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
};

const Button: React.FC<ButtonProps> = ({
  children,
  primaryColor,
  secondaryColor,
  loading,
  ...rest
}) => (
  <Container
    primaryColor={primaryColor || '#28262e'}
    secondaryColor={secondaryColor || '#ff9000'}
    type="button"
    {...rest}
  >
    {loading ? (
      <Loader
        type="Watch"
        color={primaryColor || '#28262e'}
        height={20}
        width={20}
      />
    ) : (
      children
    )}
  </Container>
);

export default Button;
