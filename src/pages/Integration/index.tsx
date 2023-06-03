import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { Helmet } from 'react-helmet';
import { api } from '../../services/api';

import { useAuth } from '../../hooks/auth';

import { Loading } from '../../components/Loading';
import { Container } from './styles';
import { useToast } from '../../hooks/toast';

interface IntegrationResponse {
  notionUserConnection: any;
  userPages: any;
}

export const Integration: React.FC = () => {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);

  const navigate = useHistory();

  const { getUserUpdate } = useAuth();
  const { createToast } = useToast();

  useEffect(() => {
    try {
      api.get(`integration?code=${searchParams.get('code')}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('@Game-Organizer:jwt-token')}`,
        },
      }).then((response: any) => {
        localStorage.setItem('@Game-Organizer:user-pages', JSON.stringify(response.data.userPages));

        getUserUpdate();

        createToast({
          type: 'success',
          title: 'Conexão com o notion feita com sucesso',
        });

        navigate.push('game-form');
      });
    } catch (err) {
      navigate.push('game-form');

      createToast({
        type: 'error',
        title: 'Erro ao conectar com o notion',
        description: 'Verifique se o login do notion é correto ou se você selecionou apenas um workspace',
      });
    }
  });

  return (
    <Container>
      <Helmet>
        <title>Entre na sua conta</title>
      </Helmet>
      <div>
        <h1>Conectando</h1>
        <Loading svgColor="light" />
      </div>
    </Container>
  );
};
