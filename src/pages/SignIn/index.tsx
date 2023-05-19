/* eslint-disable consistent-return */
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Helmet } from 'react-helmet';

import { FiLock, FiLogIn, FiUser } from 'react-icons/fi';

import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

import { AnimationContainer, Container, Content } from './styles';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

interface Inputs {
  username: string;
  password: string;
}

export const SignIn: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const { signIn } = useAuth();
  const { createToast } = useToast();

  const navigate = useHistory();

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async ({ username, password }) => {
      try {
        const signInSuccessful = await signIn({ username, password });

        if (signInSuccessful) {
          return navigate.push('/game-form');
        }
      } catch (err) {
        createToast({
          type: 'error',
          title: 'Erro na autenticação',
          description: 'Usuário ou senha incorreto, verificar credenciais',
        });
      }
    },
    [signIn, navigate, createToast],
  );

  return (
    <Container>
      <Helmet>
        <title>Entre na sua conta</title>
      </Helmet>
      <Content>
        <AnimationContainer>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Faça seu Login</h1>

            <Input
              rightIcon={FiUser}
              colorIcon="#FFFFFF"
              placeholder="Username"
              errorMessage={errors.username?.message}
              {...register('username', {
                required: 'O nome de usuário é obrigatório',
              })}
            />

            <Input
              rightIcon={FiLock}
              colorIcon="#FFFFFF"
              type="password"
              placeholder="Senha"
              errorMessage={errors.password?.message}
              {...register('password', {
                required: 'A senha é obrigatória',
              })}
            />

            <Button type="submit">Entrar</Button>
          </form>

          <Button onClick={() => navigate.push('/sign-up')}>
            <FiLogIn />
            Criar Conta
          </Button>
        </AnimationContainer>
      </Content>
    </Container>
  );
};
