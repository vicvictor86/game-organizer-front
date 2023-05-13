import React, {
  InputHTMLAttributes,
  forwardRef,
  ForwardRefRenderFunction,
  useState,
  useCallback,
} from 'react';
import { IconBaseProps } from 'react-icons/lib';
import { FiAlertCircle } from 'react-icons/fi';

import { Container, Error } from './styles';
import { Button } from '../Button/index';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasButton?: boolean;
  leftIcon?: React.ComponentType<IconBaseProps>;
  rightIcon?: React.ComponentType<IconBaseProps>;
  colorIcon?: string;
  errorMessage?: string;
  onClickLeftIcon?: (data: any) => any;
  onClickRightIcon?: (data: any) => any;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  {
    hasButton: HasButton,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    colorIcon: ColorIcon,
    onClickLeftIcon: OnClickLeftIcon,
    onClickRightIcon: OnClickRightIcon,
    errorMessage,
    ...rest
  },
  ref,
) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  return (
    <Container
      leftIcon={LeftIcon}
      rightIcon={RightIcon}
      isFocused={isFocused}
    >
      {LeftIcon && !HasButton && <LeftIcon size={24} color={ColorIcon} />}
      {LeftIcon && HasButton && (
      <Button icon={LeftIcon} onClick={OnClickLeftIcon} color={ColorIcon} />
      )}
      <input
        onBlur={handleInputBlur}
        onFocus={handleInputFocus}
        ref={ref}
        type="text"
        {...rest}
      />
      {RightIcon && !HasButton && <RightIcon size={24} color={ColorIcon} />}
      {RightIcon && HasButton && (
      <Button icon={RightIcon} onClick={OnClickRightIcon} color={ColorIcon} />
      )}
      {errorMessage && (
        <Error title={errorMessage}>
          <FiAlertCircle color="#c53030" size={22} />
        </Error>
      )}
    </Container>
  );
};

export const Input = forwardRef(InputBase);
