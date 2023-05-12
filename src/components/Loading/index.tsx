import React from 'react';
import { Container } from './styles';

import darkLoading from '../../img/dark-loading.svg';
import lightLoading from '../../img/light-loading.svg';

interface LoadingProps {
  svgColor?: 'dark' | 'light';
}

export const Loading: React.FC<LoadingProps> = ({ svgColor }: LoadingProps) => {
  const loading = svgColor === 'dark' ? darkLoading : lightLoading;

  return (
    <Container svgColor={svgColor}>
      <img src={loading} alt="Loading" />
    </Container>
  );
};
