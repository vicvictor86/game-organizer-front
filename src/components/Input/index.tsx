import React, {
  InputHTMLAttributes,
  forwardRef,
  ForwardRefRenderFunction,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { IconBaseProps } from 'react-icons/lib';
import { FiAlertCircle } from 'react-icons/fi';

import { useDebounce } from 'use-debounce';
import {
  Container, Error, Suggestion, Suggestions,
} from './styles';
import { Button } from '../Button/index';
import { api } from '../../services/api';
import { Loading } from '../Loading';

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
        {...rest}
        onBlur={handleInputBlur}
        onFocus={handleInputFocus}
        ref={ref}
        type="text"
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

const AutoCompleteInputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
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
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [gamesInfo, setGamesInfo] = useState<string[]>([]);

  const [debounceValue] = useDebounce(text, 1000);
  const [searchingForGame, setSearchingForGame] = useState<boolean>(false);

  // const users = [
  //   'zelda',
  //   'teste2',
  //   'outro teste',
  //   'outro teste 2',
  //   'outro teste 3',
  //   'outro teste 4',
  //   'outro teste 5',
  // ];

  useEffect(() => {
    if (debounceValue && text) {
      setSearchingForGame(true);

      api.get(`games/${text}`).then((response) => {
        setSearchingForGame(false);
        const gamesNames: string[] = response.data.map((game: {name: string}) => game.name);
        setGamesInfo(gamesNames);
      });
    }
  }, [text, debounceValue]);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    // setTimeout(() => {
    //   setSuggestions([]);
    // }, 100);
  }, []);

  const suggestHandler = useCallback(async (userTextInput: string) => {
    setText(userTextInput);
    setSuggestions([]);

    // const response = await api.get(`games/${userTextInput}`);

    // console.log(response);
  }, []);

  useEffect(() => {
    let matches: string[] = [];
    if (text.length > 0) {
      matches = gamesInfo.filter((gameInfo) => {
        const regex = new RegExp(`${text}`, 'gi');
        return gameInfo.match(regex);
      });
    }

    console.log('Matches', matches);
    console.log(gamesInfo);

    setSuggestions(matches);
  }, [gamesInfo, text]);

  const handleChange = useCallback(async (userTextInput: string) => {
    // let matches: string[] = [];
    // if (userTextInput.length > 0) {
    //   matches = gamesInfo.filter((gameInfo) => {
    //     const regex = new RegExp(`${userTextInput}`, 'gi');
    //     return gameInfo.match(regex);
    //   });
    // }

    // console.log('Matches', matches);
    // console.log(gamesInfo);

    // setSuggestions(matches);
    setText(userTextInput);
  }, []);

  return (
    <>
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
          {...rest}
          onBlur={handleInputBlur}
          onFocus={handleInputFocus}
          onChange={(event) => handleChange(event.target.value)}
          ref={ref}
          type="text"
          value={text}
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

      {suggestions && suggestions.length <= 0 && searchingForGame && (
        <Suggestions>
          <Loading />
        </Suggestions>
      )}

      {suggestions && suggestions.length > 0 && (
        <Suggestions>
          {suggestions.map((suggestion) => (
            <Suggestion
              onClick={() => suggestHandler(suggestion)}
              onKeyDown={() => suggestHandler(suggestion)}
              role="presentation"
            >
              <p>{suggestion}</p>
            </Suggestion>
          )).slice(0, 4)}
        </Suggestions>
      )}
    </>
  );
};

export const Input = forwardRef(InputBase);

export const AutoCompleteInput = forwardRef(AutoCompleteInputBase);
