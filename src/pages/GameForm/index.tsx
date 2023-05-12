import React, { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import { SiNotion } from 'react-icons/si';
import { FiLogOut } from 'react-icons/fi';

import { api } from '../../services/api';

import {
  Container, Content, GameInfo, GameInfos, InsertGameForm, Logout, TopBarMenu,
} from './styles';

import { useAuth } from '../../hooks/auth';

import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { useToast } from '../../hooks/toast';

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
  const [connectedWithNotion, setConnectedWithNotion] = useState<boolean>(false);
  const [loadingVisible, setLoadingVisible] = useState<boolean>(false);

  const navigate = useHistory();

  const { user, signOut } = useAuth();
  const { createToast } = useToast();

  useEffect(() => {
    document.title = 'Adicione seu jogo';

    setConnectedWithNotion(user.notionUserConnections.length > 0);
  }, [user]);

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
    setLoadingVisible(true);

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
    setLoadingVisible(false);
  }, []);

  const alertToConnect = useCallback(() => {
    if (!connectedWithNotion) {
      createToast({
        type: 'error',
        title: 'Conexão com o Notion necessária',
        description: 'Conecte com o Notion para adicionar um jogo a sua lista',
      });
    }
  }, [connectedWithNotion, createToast]);

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
        <TopBarMenu connectedWithNotion={connectedWithNotion}>
          <Logout>
            <Button icon={FiLogOut} color="#ffffff" onClick={handleSignOut}>
              Logout
            </Button>
          </Logout>
          <h1>
            Olá {user.username}, seja bem vindo
          </h1>
          <a href={process.env.REACT_APP_AUTHORIZATION_URL}>
            <SiNotion size={18} />
            {connectedWithNotion ? 'Conexão com o notion completa' : 'Conectar com o Notion'}
          </a>
        </TopBarMenu>
        <InsertGameForm connectedWithNotion={connectedWithNotion} loadingVisible={loadingVisible}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Adicione o jogo no seu Notion</h1>

            <Input
              onClick={alertToConnect}
              readOnly={!connectedWithNotion}
              placeholder="Título do jogo"
              errorMessage={errors.title?.message}
              {...register('title')}
            />
            {errors.title && <span>This field is required</span>}

            <Button disabled={!connectedWithNotion || loadingVisible} type="submit">Enviar para o Notion</Button>
          </form>
          <GameInfos>
            {!loadingVisible && (
              <>
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
              </>
            )}
            {loadingVisible && <Loading />}
          </GameInfos>
        </InsertGameForm>
      </Content>
    </Container>
  );
};
