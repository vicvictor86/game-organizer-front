import React from 'react';

import { Switch } from 'react-router-dom';

import { SignIn } from '../pages/SignIn';
import { SignUp } from '../pages/SignUp';
import { GameForm } from '../pages/GameForm';
import { Integration } from '../pages/Integration';
import { Route } from './Route';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />
    <Route path="/sign-up" component={SignUp} />
    <Route path="/game-form" component={GameForm} isPrivate />
    <Route path="/integration" component={Integration} isPrivate />
  </Switch>
);

export default Routes;
