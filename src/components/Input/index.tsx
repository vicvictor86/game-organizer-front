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
import { GameInfo, useGameInfo } from '../../hooks/gameInfo';

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
  const [suggestions, setSuggestions] = useState<GameInfo[]>([]);
  const [inputGamesInfo, setInputGamesInfo] = useState<GameInfo[]>([]);

  const [debounceValue] = useDebounce(text, 1000);
  const [searchingForGame, setSearchingForGame] = useState<boolean>(false);
  const [gameWasSelected, setGameWasSelected] = useState<boolean>(false);

  const { updateGameInfo } = useGameInfo();

  useEffect(() => {
    if (debounceValue && text && !gameWasSelected) {
      setSearchingForGame(true);

      api.get<GameInfo[]>(`games/${text}`).then((response) => {
        setSearchingForGame(false);

        setInputGamesInfo(response.data);
      });
    }
  }, [text, debounceValue, gameWasSelected]);

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
    const selectedGameInfo = inputGamesInfo.find((game) => game.name === userTextInput);

    setGameWasSelected(true);
    setText(userTextInput);

    if (selectedGameInfo) {
      updateGameInfo(selectedGameInfo);
    }

    setSuggestions([]);
  }, [updateGameInfo, inputGamesInfo]);

  useEffect(() => {
    if (gameWasSelected) return;

    let matches: GameInfo[] = [];
    if (text.length > 0) {
      matches = inputGamesInfo.filter((gameInfo) => {
        const regex = new RegExp(`${text}`, 'gi');
        return gameInfo.name.match(regex);
      });
    }

    setSuggestions(matches);
  }, [inputGamesInfo, text, gameWasSelected]);

  const handleChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (rest && rest.onChange) {
      rest.onChange(event);
    }

    const userTextInput = event.target.value;
    setText(userTextInput);
    setGameWasSelected(false);
  }, [rest]);

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
          onChange={(event) => handleChange(event)}
          ref={ref}
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
              onClick={() => suggestHandler(suggestion.name)}
              onKeyDown={() => suggestHandler(suggestion.name)}
              role="presentation"
            >
              <p>{suggestion.name}</p>
            </Suggestion>
          )).slice(0, 4)}
        </Suggestions>
      )}
    </>
  );
};

export const Input = forwardRef(InputBase);

export const AutoCompleteInput = forwardRef(AutoCompleteInputBase);
