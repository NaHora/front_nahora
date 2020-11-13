import React, { useState } from 'react';

import { FiAlertTriangle } from 'react-icons/fi';
import { AlertContainer, Title, Description } from './styles';
import Button from '../Button';

interface ComponentProps {
  description?: string;
  title?: string;
  mobile?: boolean;
}

function AlertToast({
  description = '',
  title = '',
  mobile = false,
}: ComponentProps) {
  const [open, setOpen] = useState(true);
  return (
    <>
      {open && (
        <AlertContainer mobile={mobile}>
          <p onClick={() => setOpen(false)}>x</p>
          <FiAlertTriangle size={50} />
          <Title>{title}</Title>
          <Description>{description}</Description>
          <Button
            style={{ width: '100%', margin: 0 }}
            primaryColor="#ff9000"
            secondaryColor="#28262e"
            onClick={() => setOpen(false)}
          >
            Fechar
          </Button>
        </AlertContainer>
      )}
    </>
  );
}

export default AlertToast;
