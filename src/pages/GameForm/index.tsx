import React, { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import { SiNotion } from 'react-icons/si';
import { FiLogOut, FiSettings } from 'react-icons/fi';

import { AxiosError } from 'axios';

import { api } from '../../services/api';

import {
  AnimationContainer,
  Container,
  Content,
  GameInfo,
  GameInfos,
  InsertGameForm,
  Logout,
  TopBarMenu,
} from './styles';

import { useAuth } from '../../hooks/auth';

import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { useToast } from '../../hooks/toast';

interface Inputs {
  title: string;
  pageId: string;
}

interface GameInfo {
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

interface ErrorDescriptions {
  [key: string]: string;
}

interface NotionPagesOptions {
  id: string;
  name: string;
  label: string;
}

const errorDescriptions: ErrorDescriptions = {
  'Game already exists': 'Você já adicionou esse jogo',
  'Game not found': 'O jogo adicionado não foi encontrado',
};

export const GameForm: React.FC = () => {
  const [gameInfo, setGameInfo] = useState<GameInfo | null>(null);
  const [connectedWithNotion, setConnectedWithNotion] = useState<boolean>(false);
  const [loadingVisible, setLoadingVisible] = useState<boolean>(false);
  const [notionPages, setNotionPages] = useState<NotionPagesOptions[]>([]);

  const navigate = useHistory();

  const { user, signOut } = useAuth();
  const { createToast } = useToast();

  const getNotionPages = useCallback(async () => api.get<any[]>('info', {
    headers: {
      authorization: `Bearer ${localStorage.getItem('@Game-Organizer:jwt-token')}`,
    },
  }), []);

  useEffect(() => {
    document.title = 'Adicione seu jogo';
    setConnectedWithNotion(user.notionUserConnections.length > 0);

    try {
      getNotionPages().then((response) => {
        const pagesInfo = response.data;

        const notionPagesInfo = pagesInfo.map((pageInfo) => {
          const pageName = pageInfo.properties.title.title[0].text.content;
          return { id: pageInfo.id, label: pageName, name: pageName } as NotionPagesOptions;
        });

        setNotionPages(notionPagesInfo);
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        const errorMessage: string = err.response?.data.message;

        createToast({
          type: 'error',
          title: 'Erro ao adicionar novo jogo',
          description: errorDescriptions[errorMessage] || 'Erro desconhecido',
        });
      }
    }
  }, [user, getNotionPages, createToast]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const handleSignOut = useCallback(() => {
    signOut();

    navigate.push('/');
  }, [navigate, signOut]);

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async ({ title, pageId }) => {
      setLoadingVisible(true);

      try {
        const response = await api.post(
          '/games',
          {
            title,
            pageId,
          },
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem(
                '@Game-Organizer:jwt-token',
              )}`,
            },
          },
        );

        const dateFormatted = new Date(
          response.data.releaseDate,
        ).toLocaleDateString('pt-BR');

        const gameInfoData = {
          name: response.data.name,
          platforms: response.data.platforms,
          releaseDate: dateFormatted,
          timeToBeat: response.data.timeToBeat,
        } as GameInfo;

        setGameInfo(gameInfoData as GameInfo);
        setLoadingVisible(false);

        createToast({
          type: 'success',
          title: 'Jogo adicionado com sucesso',
          description: `O jogo ${gameInfoData.name} foi adicionado com sucesso`,
        });
      } catch (err) {
        if (err instanceof AxiosError) {
          const errorMessage: string = err.response?.data.message;

          createToast({
            type: 'error',
            title: 'Erro ao adicionar novo jogo',
            description: errorDescriptions[errorMessage] || 'Erro desconhecido',
          });
        }

        setLoadingVisible(false);
      }
    },
    [createToast],
  );

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
        <AnimationContainer>
          <TopBarMenu connectedWithNotion={connectedWithNotion}>
            <div>
              <Logout>
                <Button icon={FiLogOut} color="#ffffff" onClick={handleSignOut}>
                  Logout
                </Button>
              </Logout>
              <Button
                icon={FiSettings}
                color="#ffffff"
                onClick={() => navigate.push('settings')}
              />
            </div>
            <h1>Olá {user.username}, seja bem vindo</h1>
            {!connectedWithNotion && (
              <a href={process.env.REACT_APP_AUTHORIZATION_URL}>
                <SiNotion size={18} />
                <p>Conectar com o Notion</p>
              </a>
            )}
          </TopBarMenu>
          <InsertGameForm
            connectedWithNotion={connectedWithNotion}
            loadingVisible={loadingVisible}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <h1>Adicione o jogo no seu Notion</h1>

              <label htmlFor="selected-page">
                Qual página você quer adicionar seu jogo ?
              </label>
              <select
                id="selected-page"
                aria-label="selected-page"
                {...register('pageId')}
              >
                {notionPages
                  && notionPages.map((databaseOption) => (
                    <option
                      key={databaseOption.id}
                      value={databaseOption.id}
                      label={databaseOption.label}
                      disabled={!connectedWithNotion || loadingVisible}
                    >
                      {databaseOption.name}
                    </option>
                  ))}
              </select>

              <label htmlFor="game-title">Nome do jogo</label>
              <Input
                id="game-title"
                onClick={alertToConnect}
                readOnly={!connectedWithNotion}
                placeholder="Título do jogo"
                errorMessage={errors.title?.message}
                {...register('title', {
                  required: 'Adicione o nome do jogo',
                })}
              />

              <Button
                disabled={!connectedWithNotion || loadingVisible}
                type="submit"
              >
                Enviar para o Notion
              </Button>
            </form>
            <GameInfos>
              <h1>Informações coletadas</h1>
              {!loadingVisible && (
                <>
                  <GameInfo containsData={!!gameInfo && !!gameInfo.name}>
                    <p>Título: {gameInfo ? gameInfo.name : 'Título do jogo'}</p>
                  </GameInfo>
                  <GameInfo containsData={!!gameInfo && !!gameInfo.platforms}>
                    Plataformas: {gameInfo ? showPlatforms() : 'Steam'}
                  </GameInfo>
                  <GameInfo containsData={!!gameInfo && !!gameInfo.releaseDate}>
                    <p>
                      Data de lançamento:{' '}
                      {gameInfo
                        ? gameInfo.releaseDate.substring(0, 10)
                        : '25/12/2020'}
                    </p>
                  </GameInfo>
                  <GameInfo containsData={!!gameInfo && !!gameInfo.timeToBeat}>
                    <p>
                      Tempo para zerar:{' '}
                      {gameInfo
                        ? `${gameInfo.timeToBeat.mainExtra} horas`
                        : '40 horas'}
                    </p>
                  </GameInfo>
                </>
              )}
              {loadingVisible && <Loading />}
            </GameInfos>
          </InsertGameForm>
        </AnimationContainer>
      </Content>
    </Container>
  );
};
