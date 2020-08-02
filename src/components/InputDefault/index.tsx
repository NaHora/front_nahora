import React, {
  InputHTMLAttributes,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';

import { IconBaseProps } from 'react-icons/lib/cjs';
import { FiAlertCircle } from 'react-icons/fi';
import { useField } from '@unform/core';
import { Container, Error } from './styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  value: string;
  containerStyle?: object;
  error?: string;
  icon?: React.ComponentType<IconBaseProps>;
}

const Input: React.FC<InputProps> = ({
  containerStyle,
  name,
  error = '',
  value = '',
  icon: Icon,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isFocused, setFocused] = useState(false);
  const [isFilled, setFilled] = useState(false);

  const handleIinputFocus = useCallback(() => {
    setFocused(true);
  }, []);

  const handleIconColor = useCallback(() => {
    setFocused(false);
    setFilled(!!inputRef.current?.value);
  }, []);

  return (
    <Container
      style={containerStyle}
      erroMsg={!!error}
      isFilled={isFilled}
      isFocused={isFocused}
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

export default Input;
