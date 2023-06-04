/* eslint-disable react/jsx-no-constructed-context-values */
import React, {
  createContext, useContext, useState, useCallback,
} from 'react';

export interface GameInfo {
  name: string;
  platforms: {
    name: string;
  }[];
  releaseDate: string;
  timeToBeat: {
    main: string;
    mainExtra: string;
    completionist: string;
  };
}

interface GameInfoContextData {
  gameInfo: GameInfo | null;
  updateGameInfo(gameInfo: GameInfo): void;
}

interface GameInfoProviderData {
  children: React.ReactNode;
}

export const GameInfoContext = createContext<GameInfoContextData>(
  {} as GameInfoContextData,
);

export const GameInfoProvider: React.FC<GameInfoProviderData> = ({ children }) => {
  const [gameInfo, setGameInfo] = useState<GameInfo | null>(null);

  const updateGameInfo = useCallback((gameInfoUpdated: GameInfo): void => {
    const dateFormatted = new Date(
      gameInfoUpdated.releaseDate,
    ).toLocaleDateString('pt-BR');

    const gameInfoData = {
      name: gameInfoUpdated.name,
      platforms: gameInfoUpdated.platforms,
      releaseDate: dateFormatted,
      timeToBeat: gameInfoUpdated.timeToBeat,
    } as GameInfo;

    setGameInfo(gameInfoData);
  }, []);

  return (
    <GameInfoContext.Provider
      value={{
        gameInfo,
        updateGameInfo,
      }}
    >
      {children}
    </GameInfoContext.Provider>
  );
};

export function useGameInfo(): GameInfoContextData {
  const context = useContext(GameInfoContext);

  if (!context) {
    throw new Error('useGameInfo must be used within an context');
  }

  return context;
}
