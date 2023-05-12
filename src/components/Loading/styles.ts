import styled from 'styled-components';

interface ContainerProps {
  svgColor?: 'dark' | 'light';
}

export const Container = styled.div<ContainerProps>`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 50px;
  }
`;
