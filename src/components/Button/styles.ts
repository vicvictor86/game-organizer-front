import { shade } from 'polished';
import styled from 'styled-components';

const Container = styled.button`
  background: transparent;
  border: 0;
  transition: color 0.2s;
  color: #707991;

  svg:hover {
    color: ${shade(0.2, '#707991')};
  }
`;

export default Container;
