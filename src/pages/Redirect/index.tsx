import React, { useEffect } from 'react';

import { useHistory, useLocation } from 'react-router-dom';
import { api } from '../../services/api';

export const Redirect: React.FC = () => {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);

  const navigate = useHistory();

  useEffect(() => {
    api.get(`integration?code=${searchParams.get('code')}`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('@Game-Organizer:jwt-token')}`,
      },
    }).then(() => {
      navigate.push('game-form');
    });
  });

  return (
    <h1>Carregando</h1>
  );
};
