import React, { useCallback, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { SiNotion } from 'react-icons/si';

import { useHistory } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import {
  Container, Content, GameInfo, GameInfos, InsertGameForm, Logout, TopBarMenu,
} from './styles';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/Auth';

interface Inputs {
  title: string;
}

interface GameInfo {
  name: string;
  platforms: {
    name: string;
  }[];
  releaseDate: string;
  timeToBeat: {
    main: string,
    mainExtra: string;
    completionist: string;
  }
}

export const GameForm: React.FC = () => {
  const [gameInfo, setGameInfo] = useState<GameInfo | null>(null);

  const navigate = useHistory();

  const { user, signOut } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const handleSignOut = useCallback(() => {
    signOut();

    navigate.push('/');
  }, [navigate, signOut]);

  const onSubmit: SubmitHandler<Inputs> = useCallback(async ({ title }) => {
    const response = await api.post(
      '/games',
      {
        title,
      },
      {
        headers: {
          authorization: `Bearer ${localStorage.getItem('@Game-Organizer:jwt-token')}`,
        },
      },
    );

    const dateFormatted = new Date(response.data.releaseDate).toLocaleDateString('pt-BR');

    const gameInfoData = {
      name: response.data.name,
      platforms: response.data.platforms,
      releaseDate: dateFormatted,
      timeToBeat: response.data.timeToBeat,
    } as GameInfo;

    setGameInfo(gameInfoData as GameInfo);
    console.log(response.data);
  }, []);

  const showPlatforms = useCallback(() => {
    let platformsString = '';
    gameInfo?.platforms.forEach((platform) => {
      platformsString += `${platform.name}, `;
    });

    platformsString = platformsString.substring(0, platformsString.length - 2);

    return platformsString;
  }, [gameInfo]);

  return (
    <Container>
      <Content>
        <TopBarMenu>
          <Logout>
            <Button icon={FiLogOut} color="#ffffff" onClick={handleSignOut}>
              Logout
            </Button>
          </Logout>
          <h1>
            Olá {user.username}, seja bem vindo
          </h1>
          <a href="https://api.notion.com/v1/oauth/authorize?client_id=7fa6a818-b3ff-4a3f-890c-16e6ebeeb64e&response_type=code&owner=user&redirect_uri=https%3A%2F%2Fgame-organizer.up.railway.app%2Fintegration">
            <SiNotion size={18} />
            Conectar com o Notion
          </a>
        </TopBarMenu>
        <InsertGameForm>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Adicione o jogo no seu Notion</h1>

            <Input placeholder="Título do jogo" {...register('title')} />
            {errors.title && <span>This field is required</span>}

            <Button type="submit">Enviar para o Notion</Button>
          </form>
          <GameInfos>
            <h1>Informações coletadas</h1>
            <GameInfo containsData={!!gameInfo && !!gameInfo.name}>
              <p>Título: {gameInfo ? gameInfo.name : 'Título do jogo'}</p>
            </GameInfo>
            <GameInfo containsData={!!gameInfo && !!gameInfo.platforms}>
              Plataformas: {gameInfo ? showPlatforms() : 'Steam'}
            </GameInfo>
            <GameInfo containsData={!!gameInfo && !!gameInfo.releaseDate}>
              <p>Data de lançamento: {gameInfo ? gameInfo.releaseDate.substring(0, 10) : '25/12/2020'}</p>
            </GameInfo>
            <GameInfo containsData={!!gameInfo && !!gameInfo.timeToBeat}>
              <p>Tempo para zerar: {gameInfo ? `${gameInfo.timeToBeat.mainExtra} horas` : '40 horas'}</p>
            </GameInfo>
          </GameInfos>
        </InsertGameForm>
      </Content>
    </Container>
  );
};
