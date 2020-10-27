import React, { useCallback } from 'react';

import { Container } from './styles';

interface AvatarProps {
  avatarUrl?: string;
  name: string;
  width: number;
  height: number;
  primaryColor?: string;
  secondaryColor?: string;
  isPrivate: boolean;
  noMargin?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
  avatarUrl,
  name,
  width = 35,
  height = 35,
  isPrivate,
  secondaryColor = '#ff9000',
  primaryColor = '#28262e',
  noMargin = false,
}) => {
  const nameInitials = useCallback((currentName: string) => {
    return currentName
      .split(' ')
      .map((username) => username.charAt(0).toUpperCase())
      .join('')
      .substring(0, 1);
  }, []);

  return (
    <Container
      secondaryColor={secondaryColor}
      primaryColor={primaryColor}
      width={width}
      height={height}
      noMargin={noMargin}
    >
      {!isPrivate && avatarUrl ? (
        <img src={avatarUrl} alt={name} />
      ) : (
        <span>{nameInitials(isPrivate ? 'Anônimo' : name)}</span>
      )}
    </Container>
  );
};

export default Avatar;
