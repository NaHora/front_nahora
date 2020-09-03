import React, { InputHTMLAttributes, useState, useCallback } from 'react';

import { IconBaseProps } from 'react-icons/lib/cjs';
import { FiAlertCircle } from 'react-icons/fi';

import { Container, Error } from './styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  value: any;
  maxWidth?: string;
  margin?: boolean;
  containerStyle?: object;
  error?: string;
  icon?: React.ComponentType<IconBaseProps>;
}

const InputDefault: React.FC<InputProps> = ({
  containerStyle,
  name,
  maxWidth,
  margin = true,
  error = '',
  value = '',
  icon: Icon,
  ...rest
}) => {
  const [isFocused, setFocused] = useState(false);
  const [isFilled, setFilled] = useState(false);

  const handleIinputFocus = useCallback(() => {
    setFocused(true);
  }, []);

  const handleIconColor = useCallback(() => {
    setFocused(false);
    setFilled(!!value);
  }, [value]);

  return (
    <Container
      style={containerStyle}
      erroMsg={!!error}
      isFilled={isFilled}
      margin={margin}
      isFocused={isFocused}
      maxWidth={maxWidth}
      data-testid="input-container"
    >
      {Icon && <Icon size={20} />}
      <input
        value={value}
        name={name}
        onFocus={handleIinputFocus}
        onBlur={handleIconColor}
        {...rest}
      />
      {error && (
        <Error title={error}>
          <FiAlertCircle size={20} color="#c53030" />
        </Error>
      )}
    </Container>
  );
};

export default InputDefault;
