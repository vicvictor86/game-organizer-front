import React, { ButtonHTMLAttributes } from 'react';
import { IconBaseProps } from 'react-icons/lib';

import Container from './styles';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ComponentType<IconBaseProps>;
}

export const Button: React.FC<ButtonProps> = ({ children, icon: Icon, ...rest }) => (
  <Container type="button" {...rest}>
    {Icon && <Icon size={24} />}
    {children}
  </Container>
);
