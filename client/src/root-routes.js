import { Route, Switch } from "react-router-dom";
import SignInContainer from "./pages/auth/sign-in";
import Register from "./pages/auth/register";
import Game from "./pages/game";
import ForgotPassword from "./pages/auth/forgot-password";
import ResetPassword from "./pages/auth/reset-password";
const RootRoutes = () => {
  return (
    <Switch>
      <Route exact path="/">
        <SignInContainer />
      </Route>
      <Route path="/register">
        <Register />
      </Route>
      <Route path="/forgot-password">
        <ForgotPassword />
      </Route>
      <Route path="/reset-password">
        <ResetPassword />
      </Route>
      <Route path="/game">
        <Game />
      </Route>
    </Switch>
  );
};

export default RootRoutes;
