import { IconBaseProps } from 'react-icons/lib';
import styled from 'styled-components';
import { ToolTip } from '../Tooltip';

interface ContainerProps {
  leftIcon: React.ComponentType<IconBaseProps> | undefined;
  rightIcon: React.ComponentType<IconBaseProps> | undefined;
  isFocused: boolean;
}

export const Container = styled.div<ContainerProps>`
  display: flex;
  align-items: center;
  max-height: 5.6rem;
  padding: 1.6rem;
  background-color: #FFFFFF;
  border-radius: 1.2rem;
  width: 100%;

  input {
    background: none;
    border: 0;
    flex: 1;
    padding: 1.8rem 0;

    ::placeholder {
      color: #ffffff66;
    }
  }

  svg {
    color: #707991;
  }

  input + svg, input + button svg {
    margin: 0;
  }

  & > button:first-child {
    margin-left: ${(props) => (!props.leftIcon ? '1.6rem' : '0')};
    margin-right: ${(props) => (props.leftIcon ? '1.6rem' : '0')};
  }

  & > button:last-child {
    margin-left: 1.6rem;
  }
`;

export const Error = styled(ToolTip)`
  height: 20px;
  margin-left: 16px;

  svg {
    margin: 0;
  }

  span {
    background: #c53030;
    color: #fff;

    &::before {
      border-color: #c53030 transparent;
    }
  }
`;
