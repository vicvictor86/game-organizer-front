/* eslint-disable consistent-return */
import React, { useCallback, useEffect } from 'react';
import { FiLock, FiLogIn, FiUser } from 'react-icons/fi';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

import { Container, Content } from './styles';
import { useAuth } from '../../hooks/Auth';

interface Inputs {
  username: string;
  password: string;
}

export const SignIn: React.FC = () => {
  useEffect(() => {
    document.title = 'Entre na sua conta';
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const { signIn } = useAuth();

  const navigate = useHistory();

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async ({ username, password }) => {
      const signInSuccessful = await signIn({ username, password });

      if (signInSuccessful) {
        return navigate.push('/game-form');
      }
    },
    [signIn, navigate],
  );

  return (
    <Container>
      <Content>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>Faça seu login</h1>

          <Input
            rightIcon={FiUser}
            colorIcon="#FFFFFF"
            placeholder="Username"
            {...register('username')}
          />
          <Input
            rightIcon={FiLock}
            colorIcon="#FFFFFF"
            type="password"
            placeholder="Senha"
            {...register('password')}
          />
          {errors.username && <span>This field is required</span>}

          <Button type="submit">Entrar</Button>
        </form>

        <Button onClick={() => navigate.push('/sign-up')}>
          <FiLogIn />
          Criar Conta
        </Button>
      </Content>
    </Container>
  );
};
